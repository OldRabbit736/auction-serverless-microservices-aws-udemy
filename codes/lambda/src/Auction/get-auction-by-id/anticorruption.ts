import { clientError, Errors } from "../common/errors";
import { GetAuctionByIdRequest } from "./types";

import * as E from "fp-ts/lib/Either";

export const prepareRequest = (
  event: any
): E.Either<Errors, GetAuctionByIdRequest> => {
  const id = event.pathParameters.id;
  return typeof id === "string"
    ? E.right({ id })
    : E.left(clientError("No Id!!"));
};
