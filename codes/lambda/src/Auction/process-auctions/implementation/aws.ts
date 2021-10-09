import { pipe } from "fp-ts/lib/function";
import * as AWS from "aws-sdk";
import { serverError } from "../../common/errors";

import * as TE from "fp-ts/lib/TaskEither";
import { getMessageOr } from "../../common/util";

const ddbClient = new AWS.DynamoDB.DocumentClient();

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

export const closeAuctionPortImplAWS = async (auctionId: string) => {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    Key: { id: auctionId },
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
      getMessageOr("AWS Error 3!")
    ),
    TE.chain((result) =>
      result.$response.error
        ? TE.left(result.$response.error.message)
        : TE.right(result.$response.data)
    ),
    TE.mapLeft(serverError)
  )();
};
