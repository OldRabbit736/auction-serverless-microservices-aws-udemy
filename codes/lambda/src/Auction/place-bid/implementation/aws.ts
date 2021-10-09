import { PlaceBidPort } from "../database";

import * as AWS from "aws-sdk";
import { serverError } from "../../common/errors";
const ddbClient = new AWS.DynamoDB.DocumentClient();

export const placeBidPortImpleAWS: PlaceBidPort =
  (auctionId: string) => async (amount: number) => {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME!,
      Key: { id: auctionId },
      UpdateExpression: "set highestBid.amount = :amount",
      ExpressionAttributeValues: {
        ":amount": amount,
      },
      ReturnValues: "ALL_NEW",
    };

    let updatedAuction;

    try {
      const result = await ddbClient.update(params).promise();
      updatedAuction = result.Attributes;

      return {
        _tag: "Right",
        right: updatedAuction,
      };
    } catch (error) {
      console.error(error);

      return {
        _tag: "Left",
        left: serverError("Error Setting New Bid"),
      };
    }
  };
