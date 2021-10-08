import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { placeBidWorkflow } from "./workflow/place-bid.workflow";
import { placeBidPort } from "./shell/place-bid.port";
import { getAuctionByIdPort } from "./shell/get-auction-by-id-port";

const placeBid = async (event: any, context: any) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const result = await placeBidWorkflow(getAuctionByIdPort)(placeBidPort)(
    id,
    amount
  );

  return pipe(
    result,
    E.fold(
      (error) => {
        if (error._tag === "BidLowError") {
          throw new createError.Forbidden(error.message);
        }

        if (error._tag === "infra error") {
          throw new createError.InternalServerError(error.message);
        }

        if (error._tag === "no auction found") {
          throw new createError.NotFound(error.message);
        }
      },
      (updatedAuction) => {
        return {
          statusCode: 200,
          body: JSON.stringify(updatedAuction),
        };
      }
    )
  );
};

const handler = commonMiddleware(placeBid);

export { handler };
