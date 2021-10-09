import * as AWS from "aws-sdk";
import { serverError } from "../../common/errors";
import { GetAuctionsPort } from "../database";

const ddbClient = new AWS.DynamoDB.DocumentClient();

export const getAuctionsPortImplAWS: GetAuctionsPort = async (
  status: string
) => {
  let auctions;

  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.AUCTIONS_TABLE_NAME!,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  try {
    const result = await ddbClient.query(params).promise();
    auctions = result.Items;
  } catch (error) {
    console.error(error);
    return {
      _tag: "Left",
      left: serverError("Error Getting Auctions!!"),
    };
  }

  return {
    _tag: "Right",
    right: auctions,
  };
};
