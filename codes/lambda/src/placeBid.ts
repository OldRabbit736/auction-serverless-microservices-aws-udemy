import { v4 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import commonMiddleware from "./lib/commonMiddleware";
import createError from "http-errors";

const ddbClient = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event: any, context: any) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;

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
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

const handler = commonMiddleware(placeBid);

export { handler };
