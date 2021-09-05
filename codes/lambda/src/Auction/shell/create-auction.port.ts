import * as E from "fp-ts/lib/Either";
import * as AWS from "aws-sdk";
import { Auction } from "../domain/Auction";
import { CreateAuctionPort } from "../workflow/create-auction.workflow";

const ddbClient = new AWS.DynamoDB.DocumentClient();

export const createAuctionPort: CreateAuctionPort = async (
  auction: Auction
): Promise<E.Either<string, Auction>> => {
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
      left: error.message as string,
    };
  }
};
