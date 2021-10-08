import { CreateAuctionRequest } from "./types";
import { clientError, Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";

export const prepareRequest = (
  event: any
): E.Either<Errors, CreateAuctionRequest> => {
  return typeof event.body.title === "string"
    ? E.right({ title: event.body.title })
    : E.left(clientError("No Title!!"));
};
