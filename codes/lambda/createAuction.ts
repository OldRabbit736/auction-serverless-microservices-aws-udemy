import { v4 as uuid } from "uuid";
import * as AWS from "aws-sdk";

const ddbClient = new AWS.DynamoDB.DocumentClient();

const createAuction = async (event: any, context: any) => {
  const { title } = JSON.parse(event.body);

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  await ddbClient
    .put({
      TableName: process.env.AUCTIONS_TABLE_NAME!,
      Item: auction,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export { createAuction as handler };
