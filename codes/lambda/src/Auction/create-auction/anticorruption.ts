import { CreateAuctionRequest } from "./types";
import { clientError, Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";

const parseEvent = (event: any): CreateAuctionRequest => ({
  title: event.body.title as string,
});

export const prepareRequest = (
  event: any
): E.Either<Errors, CreateAuctionRequest> =>
  E.tryCatch(
    () => parseEvent(event),
    (error) =>
      error instanceof Error
        ? clientError(error.message)
        : clientError("input value problem")
  );
