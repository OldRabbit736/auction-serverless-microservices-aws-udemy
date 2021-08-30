import { v4 as uuid } from "uuid";
import {
  CreateAuction,
  CreateAuctionCommand,
} from "../port/in/createAuction.UseCase";

import * as AWS from "aws-sdk";
import { Auction } from "../../domain/Auction";
const ddbClient = new AWS.DynamoDB.DocumentClient();

export const createAuctionService: CreateAuction = async (
  command: CreateAuctionCommand
) => {
  const auction: Auction = {
    id: uuid(),
    title: command.title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  // TODO: use out port instead
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
