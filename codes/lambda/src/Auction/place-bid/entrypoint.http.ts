import { workflow } from "./workflow";
import { handleError, okResponse, Response } from "../common/responses";
import { prepareRequest } from "./anticorruption";
import { placeBidPortImpleAWS } from "./implementation/aws";
import { getAuctionByIdPortImplAWS } from "../get-auction-by-id/implementation/aws";

import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import commonMiddleware from "../../lib/commonMiddleware";

const placeBid = (event: any): Promise<Response> =>
  pipe(
    prepareRequest(event),
    TE.fromEither,
    TE.chain(workflow(getAuctionByIdPortImplAWS)(placeBidPortImpleAWS)),
    TE.map(JSON.stringify),
    TE.bimap(handleError, okResponse),
    TE.getOrElse(T.of)
  )();

const handler = commonMiddleware(placeBid);

export { handler };
