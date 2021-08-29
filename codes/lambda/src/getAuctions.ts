import * as AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormarlizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const ddbClient = new AWS.DynamoDB.DocumentClient();

const getAuctions = async (event: any, context: any) => {
  let auctions;

  try {
    const result = await ddbClient
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME!,
      })
      .promise();

    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
};

const middled = middy(getAuctions)
  .use(httpJsonBodyParser())
  .use(httpEventNormarlizer())
  .use(httpErrorHandler());

export { middled as handler };
