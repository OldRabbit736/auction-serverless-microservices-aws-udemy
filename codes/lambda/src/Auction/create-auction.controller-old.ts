import createError from "http-errors";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { v4 as uuid } from "uuid";
import { createAuctionPort } from "./shell/create-auction.port";
import { Auction } from "./domain/Auction";
import commonMiddleware from "../lib/commonMiddleware";

const createAuction = async (event: any, context: any) => {
  const { title } = event.body;

  // core: make Auction instance
  // TODO: make smart constructor for Auction
  const auction: Auction = {
    id: uuid(),
    title: title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  // shell
  const result = await createAuctionPort(auction);

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
};

const handler = commonMiddleware(createAuction);

export { handler };
