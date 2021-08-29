import * as AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormarlizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const ddbClient = new AWS.DynamoDB.DocumentClient();

const getAuction = async (event: any, context: any) => {
  let auction = undefined;

  const { id } = event.pathParameters;

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
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

const middled = middy(getAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormarlizer())
  .use(httpErrorHandler());

export { middled as handler };
