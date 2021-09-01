import * as AWS from "aws-sdk";
import commonMiddleware from "./lib/commonMiddleware";
import createError from "http-errors";

const ddbClient = new AWS.DynamoDB.DocumentClient();

export const getAuctionById = async (id: string) => {
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
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found!`);
  }

  return auction;
};

const getAuction = async (event: any, context: any) => {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
};

const handler = commonMiddleware(getAuction);

export { handler };
