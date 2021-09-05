import { Auction } from "../domain/Auction";
import { GetAuctionByIdPort } from "../workflow/get-auction-by-id.workflow";
import * as E from "fp-ts/lib/Either";

import * as AWS from "aws-sdk";
const ddbClient = new AWS.DynamoDB.DocumentClient();

export const getAuctionByIdPort: GetAuctionByIdPort = async (
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
    // TODO: to throw or return http error
    return {
      _tag: "Left",
      left: "Internal Server Error",
    };
  }

  if (!auction) {
    // TODO: to throw or return http error
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
