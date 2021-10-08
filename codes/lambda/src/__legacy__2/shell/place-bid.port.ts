import { PlaceBidPort } from "../workflow/dependency";

import * as AWS from "aws-sdk";
const ddbClient = new AWS.DynamoDB.DocumentClient();

export const placeBidPort: PlaceBidPort =
  (id: string) => async (amount: number) => {
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME!,
      Key: { id },
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
        left: {
          _tag: "infra error",
          message: error.message as string,
        },
      };
    }
  };
