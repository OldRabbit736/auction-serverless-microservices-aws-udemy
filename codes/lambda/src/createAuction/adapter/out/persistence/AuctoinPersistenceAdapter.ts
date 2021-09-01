import { CreateAuctionPort } from "../../../application/port/out/createAuction.Port";
import { Auction } from "../../../domain/Auction";
import * as E from "fp-ts/lib/Either";
import * as AWS from "aws-sdk";
import { GetAuctionByIdPort } from "../../../application/port/out/getAuctionById.Port";
const ddbClient = new AWS.DynamoDB.DocumentClient();

export const createAuctionPortImpl: CreateAuctionPort = async (
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

export const getAuctionByIdPortImpl: GetAuctionByIdPort = async (
  id: string
): Promise<E.Either<string, Auction>> => {
  let auction = undefined;

  try {
    const result = await ddbClient
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        Key: { id },
      })
      .promise();
    auction = result.Item;
  } catch (error) {
    console.error(error);
    return {
      _tag: "Left",
      left: "Internal Server Error",
    };
  }

  if (!auction) {
    return {
      _tag: "Left",
      left: `Auction with ID "${id}" not found!`,
    };
  }

  return {
    _tag: "Right",
    right: auction,
  };
};
