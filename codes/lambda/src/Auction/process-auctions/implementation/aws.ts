import { pipe } from "fp-ts/lib/function";
import * as AWS from "aws-sdk";
import { serverError } from "../../common/errors";

import * as TE from "fp-ts/lib/TaskEither";

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
      (_) => "AWS Error!"
    ),
    TE.chain((result) =>
      result.$response.error ? TE.left("AWS Error!") : TE.right(result.Items)
    ),
    TE.mapLeft(serverError)
  )();
};
