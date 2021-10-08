import { notFound } from "../../common/errors";
import { GetAuctionByIdPort } from "../database";

import * as AWS from "aws-sdk";
import { serverError } from "../../common/errors";

const ddbClient = new AWS.DynamoDB.DocumentClient();

export const getAuctionByIdPortImplAWS: GetAuctionByIdPort = async (
  id: string
) => {
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
      left: serverError(
        error.message ? error.message : `Error Getting Auction ID: ${id}`
      ),
    };
  }

  if (!auction) {
    return {
      _tag: "Left",
      left: notFound(`Auction with ID "${id}" not found!`),
    };
  }

  return {
    _tag: "Right",
    right: auction,
  };
};
