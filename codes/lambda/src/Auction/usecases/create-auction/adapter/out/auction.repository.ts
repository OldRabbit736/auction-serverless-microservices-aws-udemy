import * as E from "fp-ts/lib/Either";
import * as AWS from "aws-sdk";
import { CreateAuctionPort } from "../../application/out/create-auction.port";
import { Auction } from "../../../../domain/Auction";

const ddbClient = new AWS.DynamoDB.DocumentClient();

export const createAuctionPort: CreateAuctionPort = async (
  auction: Auction
): Promise<E.Either<string, Auction>> => {
  try {
    await ddbClient
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME!,
        Item: auction,
      })
      .promise();
    return {
      _tag: "Right",
      right: auction,
    };
  } catch (error) {
    console.error(error);
    return {
      _tag: "Left",
      left: error.message as string,
    };
  }
};

// export const getAuctionByIdPortImpl: GetAuctionByIdPort = async (
//   id: string
// ): Promise<E.Either<string, Auction>> => {
//   let auction = undefined;

//   try {
//     const result = await ddbClient
//       .get({
//         TableName: process.env.AUCTIONS_TABLE_NAME!,
//         Key: { id },
//       })
//       .promise();
//     auction = result.Item;
//   } catch (error) {
//     console.error(error);
//     // TODO: to throw or return http error
//     return {
//       _tag: "Left",
//       left: "Internal Server Error",
//     };
//   }

//   if (!auction) {
//     // TODO: to throw or return http error
//     return {
//       _tag: "Left",
//       left: `Auction with ID "${id}" not found!`,
//     };
//   }

//   return {
//     _tag: "Right",
//     right: auction,
//   };
// };
