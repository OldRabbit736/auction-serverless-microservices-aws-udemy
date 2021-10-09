import { workflow } from "./workflow";
import { handleError, okResponse, Response } from "../common/responses";
import { getAuctionsPortImplAWS } from "./implementation/aws";

import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import commonMiddleware from "../../lib/commonMiddleware";
import { prepareRequest, prepareRequest2 } from "./anticorruption";

const getAuctions = (event: any): Promise<Response> =>
  pipe(
    prepareRequest2(event),
    TE.of,
    TE.chain(workflow(getAuctionsPortImplAWS)),
    TE.map(JSON.stringify),
    TE.bimap(handleError, okResponse),
    TE.getOrElse(T.of)
  )();

const handler = commonMiddleware(getAuctions);

export { handler };
