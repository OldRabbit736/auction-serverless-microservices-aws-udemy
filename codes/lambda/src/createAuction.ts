import { v4 as uuid } from "uuid";
import * as AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormarlizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
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

const middled = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormarlizer())
  .use(httpErrorHandler());

export { middled as handler };
