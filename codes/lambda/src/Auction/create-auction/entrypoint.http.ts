import { workflow } from "./workflow";
import { createdResponse, handleError, Response } from "../common/responses";
import { prepareRequest } from "./anticorruption";
import { createAuctionPortImplAWS } from "./implementation/aws";

import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import commonMiddleware from "../../lib/commonMiddleware";

const createAuction = (event: any): Promise<Response> =>
  pipe(
    prepareRequest(event),
    TE.fromEither,
    TE.chain(workflow(createAuctionPortImplAWS)),
    TE.map(JSON.stringify),
    TE.bimap(handleError, createdResponse),
    TE.getOrElse(T.of)
  )();

const handler = commonMiddleware(createAuction);

export { handler };

// http related stuff + spin workflow

// http request(event) -> json (done by middleware)
// json deserialize (parse) -> unvalidated something (domain object)

// workflow setting
// dependency injection

// workflow invokeing
// validate unvalidated something
// processing
// DB connection
// result

// result to http response
