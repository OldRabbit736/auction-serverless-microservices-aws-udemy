import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import createError from "http-errors";
import { getAuctionByIdWorkflow } from "./workflow/get-auction-by-id.workflow";
import { getAuctionByIdPort } from "./shell/get-auction-by-id-port";
import commonMiddleware from "../lib/commonMiddleware";

const getAuction = async (event: any, context: any) => {
  const { id } = event.pathParameters;

  // setup the dependencies
  const workflow = getAuctionByIdWorkflow(getAuctionByIdPort);

  const result = await workflow(id);

  return pipe(
    result,
    E.fold(
      (error) => {
        if (error._tag === "infra error") {
          throw new createError.InternalServerError(error.message);
        }
        throw new createError.NotFound(error.message);
      },
      (auction) => {
        return {
          statusCode: 200,
          body: JSON.stringify(auction),
        };
      }
    )
  );
};

const handler = commonMiddleware(getAuction);

export { handler };
