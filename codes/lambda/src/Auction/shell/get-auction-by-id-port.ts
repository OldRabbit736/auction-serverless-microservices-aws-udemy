import { GetAuctionByIdPort } from "../workflow/get-auction-by-id.workflow";

import * as AWS from "aws-sdk";
const ddbClient = new AWS.DynamoDB.DocumentClient();

export const getAuctionByIdPort: GetAuctionByIdPort = async (id: string) => {
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
      left: {
        _tag: "infra error",
        message: error.message as string,
      },
    };
  }

  if (!auction) {
    return {
      _tag: "Left",
      left: {
        _tag: "no auction found",
        message: `Auction with ID "${id}" not found!`,
      },
    };
  }

  return {
    _tag: "Right",
    right: auction,
  };
};
