import createError from "http-errors";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createAuctionPort } from "./shell/create-auction.port";
import commonMiddleware from "../lib/commonMiddleware";
import { createAuctionWorkflow } from "./workflow/create-auction.workflow";

const createAuction = async (event: any, context: any) => {
  const { title } = event.body;

  // setup the dependenies
  const workflow = createAuctionWorkflow(createAuctionPort);

  const result = await workflow(title);

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
