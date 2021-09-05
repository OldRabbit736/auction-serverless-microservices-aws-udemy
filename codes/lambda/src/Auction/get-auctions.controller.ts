import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";

import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { getAuctionsPort } from "./shell/get-auctions.port";
import { getAuctionsWorkflow } from "./workflow/get-auctions.workflow";

const getAuctions = async (event: any, context: any) => {
  // setup the dependencies
  const workflow = getAuctionsWorkflow(getAuctionsPort);

  const result = await workflow();

  return pipe(
    result,
    E.fold(
      (error) => {
        throw new createError.InternalServerError(error.message);
      },
      (auctions) => {
        return {
          statusCode: 200,
          body: JSON.stringify(auctions),
        };
      }
    )
  );
};

const handler = commonMiddleware(getAuctions);

export { handler };
