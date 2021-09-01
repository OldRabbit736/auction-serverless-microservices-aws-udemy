import commonMiddleware from "../../../../lib/commonMiddleware";
import createError from "http-errors";
import { CreateAuctionCommand } from "../../../application/port/in/createAuction.UseCase";
import { createAuctionService } from "../../../application/service/createAuction.Service";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createAuctionPortImpl } from "../../out/persistence/AuctoinPersistenceAdapter";

const createAuction = async (event: any, context: any) => {
  const { title } = event.body;

  const command: CreateAuctionCommand = {
    title,
  };

  // dependency injection (createAuctionPortImpl)
  const result = await createAuctionService(createAuctionPortImpl)(command);

  return pipe(
    result,
    E.fold(
      (errormessage) => {
        throw new createError.InternalServerError(errormessage);
      },
      (auction) => {
        return {
          statusCode: 201,
          body: JSON.stringify(auction),
        };
      }
    )
  );

  // const auction = {
  //   id: uuid(),
  //   title,
  //   status: "OPEN",
  //   createdAt: new Date().toISOString(),
  //   highestBid: {
  //     amount: 0,
  //   },
  // };

  // try {
  //   await ddbClient
  //     .put({
  //       TableName: process.env.AUCTIONS_TABLE_NAME!,
  //       Item: auction,
  //     })
  //     .promise();
  // } catch (error) {
  //   console.error(error);
  //   throw new createError.InternalServerError(error);
  // }

  // return {
  //   statusCode: 201,
  //   body: JSON.stringify(auction),
  // };
};

const handler = commonMiddleware(createAuction);

export { handler };
