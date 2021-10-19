import { sequenceS } from "fp-ts/lib/Apply";
import { CloseAuctionRequest } from "./../types";
import { pipe } from "fp-ts/lib/function";
import * as AWS from "aws-sdk";
import { serverError } from "../../common/errors";

import * as TE from "fp-ts/lib/TaskEither";
import { getMessageOr } from "../../common/util";
import { SendMessageRequest } from "aws-sdk/clients/sqs";

const ddbClient = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export const getEndedAuctionsPortImplAWS = async () => {
  const now = new Date();
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  return pipe(
    TE.tryCatch(
      () => ddbClient.query(params).promise(),
      getMessageOr("AWS Error 1!")
    ),
    TE.chain((result) =>
      result.$response.error
        ? TE.left(result.$response.error.message)
        : TE.right(result.Items)
    ),
    TE.mapLeft(serverError)
  )();
};

export const closeAuctionPortImplAWS = async (request: CloseAuctionRequest) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    Key: { id: request.auctionId },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  return pipe(
    TE.tryCatch(
      () => ddbClient.update(params).promise(),
      getMessageOr("AWS Error 2!")
    ),
    TE.chain((result) =>
      result.$response.error
        ? TE.left(result.$response.error.message)
        : TE.right(result.$response.data)
    ),
    TE.map((_) => notifyMessages(request)),
    TE.chain((notifyMessageRequests) =>
      notifyMessageRequests.tag === "NotifySellerBidderRequests"
        ? sequenceS(TE.ApplicativePar)({
            notifySeller: TE.tryCatch(
              () =>
                sqs.sendMessage(notifyMessageRequests.notifySeller).promise(),
              getMessageOr(
                `Error sending notifying email to seller. auction id: ${request.auctionId}`
              )
            ),
            notifyBidder: TE.tryCatch(
              () =>
                sqs.sendMessage(notifyMessageRequests.notifyBidder).promise(),
              getMessageOr(
                `Error sending notifying email to bidder. auction id: ${request.auctionId}`
              )
            ),
          })
        : sequenceS(TE.ApplicativePar)({
            notifySeller: TE.tryCatch(
              () =>
                sqs.sendMessage(notifyMessageRequests.notifySeller).promise(),
              getMessageOr(
                `Error sending notifying email to seller. auction id: ${request.auctionId}`
              )
            ),
          })
    ),
    TE.mapLeft(serverError)
  )();
};

const notifyMessages = (
  request: CloseAuctionRequest
): NotifyMessageRequests => {
  return request.tag === "WithBidder"
    ? {
        tag: "NotifySellerBidderRequests",
        notifySeller: messageRequest(process.env.MAIL_QUEUE_URL!)({
          subject: "Your item has been sold!",
          recipient: request.seller,
          body: `Woohoo! Your item "${request.title}" has been sold for $${request.amount}`,
        }),
        notifyBidder: messageRequest(process.env.MAIL_QUEUE_URL!)({
          subject: "You won an auction!",
          recipient: request.bidder,
          body: `What a great deal! You got yourself a "${request.title}" for $${request.amount}`,
        }),
      }
    : {
        tag: "NotifySellerRequest",
        notifySeller: messageRequest(process.env.MAIL_QUEUE_URL!)({
          subject: "Auction Ends",
          recipient: request.seller,
          body: `Oh no! No bids on your "${request.title}" item`,
        }),
      };
};

const messageRequest =
  (queUrl: string) =>
  (message: Message): SendMessageRequest => ({
    QueueUrl: queUrl,
    MessageBody: JSON.stringify(message),
  });

type Message = {
  subject: string;
  recipient: string;
  body: string;
};

type NotifyMessageRequests = NotifySellerRequest | NotifySellerBidderRequests;

type NotifySellerRequest = {
  tag: "NotifySellerRequest";
  notifySeller: SendMessageRequest;
};

type NotifySellerBidderRequests = {
  tag: "NotifySellerBidderRequests";
  notifySeller: SendMessageRequest;
  notifyBidder: SendMessageRequest;
};
