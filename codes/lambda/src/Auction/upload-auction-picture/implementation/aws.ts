import { pipe } from "fp-ts/lib/function";
import { UploadPictureToStoragePort } from "./../storage";
import AWS from "aws-sdk";
import { AddPictureUrlPort } from "../database";

import * as TE from "fp-ts/lib/TaskEither";
import { getMessageOr } from "../../common/util";
import { serverError } from "../../common/errors";

const s3 = new AWS.S3();
const ddbClient = new AWS.DynamoDB.DocumentClient();

export const uploadPictureToStoragePortImplAWS: UploadPictureToStoragePort =
  async (key: string, body: Buffer) => {
    const result = await s3
      .upload({
        Bucket: process.env.AUCTIONS_BUCKET_NAME!,
        Key: key,
        Body: body,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      })
      .promise();

    return result.Location;
  };

export const addPictureUrlPortImplAWS: AddPictureUrlPort = async (
  auctionId: string,
  pictureUrl: string
) => {
  const input: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    Key: {
      id: auctionId,
    },
    UpdateExpression: "set pictureUrl = :pictureUrl",
    ExpressionAttributeValues: {
      ":pictureUrl": pictureUrl,
    },
    ReturnValues: "ALL_NEW",
  };

  return pipe(
    TE.tryCatch(
      () => ddbClient.update(input).promise(),
      getMessageOr("Error Updating Auction with pictureUrl")
    ),
    TE.map((result) => result.Attributes),
    TE.mapLeft(serverError)
  )();
};
