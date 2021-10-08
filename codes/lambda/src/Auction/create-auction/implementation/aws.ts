import * as AWS from "aws-sdk";

import { Auction } from "../../common/auction";
import { serverError } from "../../common/errors";
import { CreateAuctionPort } from "../database";

const ddbClient = new AWS.DynamoDB.DocumentClient();

export const createAuctionPortImplAWS: CreateAuctionPort = async (
  auction: Auction
) => {
  try {
    await ddbClient
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        Item: auction,
      })
      .promise();
    return {
      _tag: "Right",
      right: auction,
    };
  } catch (error) {
    console.error(error);
    return {
      _tag: "Left",
      left: serverError("Server Error"),
    };
  }
};
