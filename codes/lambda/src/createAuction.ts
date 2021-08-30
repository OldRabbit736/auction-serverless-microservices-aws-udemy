import { v4 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import commonMiddleware from "./lib/commonMiddleware";
import createError from "http-errors";

const ddbClient = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event: any, context: any) => {
  const { title } = event.body;
  // const { title } = JSON.parse(event.body);

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  try {
    await ddbClient
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

const handler = commonMiddleware(createAuction);

export { handler };
