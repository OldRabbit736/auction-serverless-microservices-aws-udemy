import * as AWS from "aws-sdk";
import { serverError } from "../../common/errors";
import { GetAuctionsPort } from "../database";

const ddbClient = new AWS.DynamoDB.DocumentClient();

export const getAuctionsPortImplAWS: GetAuctionsPort = async () => {
  let auctions;

  try {
    const result = await ddbClient
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME!,
      })
      .promise();

    auctions = result.Items;
  } catch (error) {
    console.error(error);

    return {
      _tag: "Left",
      left: serverError("Error Getting Auctions!!"),
    };
  }

  return {
    _tag: "Right",
    right: auctions,
  };
};
