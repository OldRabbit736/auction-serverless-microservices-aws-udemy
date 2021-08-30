import * as AWS from "aws-sdk";
import commonMiddleware from "./lib/commonMiddleware";
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

const handler = commonMiddleware(getAuctions);

export { handler };
