import * as AWS from "aws-sdk";
const ddbClient = new AWS.DynamoDB.DocumentClient();

export const getEndedAuction = async () => {
  const now = new Date();
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const result = await ddbClient.query(params).promise();
  return result.Items;
};
