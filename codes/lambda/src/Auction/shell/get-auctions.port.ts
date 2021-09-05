import { GetAuctionsPort } from "../workflow/dependency";

import * as AWS from "aws-sdk";
const ddbClient = new AWS.DynamoDB.DocumentClient();

export const getAuctionsPort: GetAuctionsPort = async () => {
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

    return {
      _tag: "Left",
      left: {
        _tag: "infra error",
        message: error.message as string,
      },
    };
  }

  return {
    _tag: "Right",
    right: auctions,
  };
};
