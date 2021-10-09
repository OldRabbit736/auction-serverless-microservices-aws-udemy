import { pipe } from "fp-ts/lib/function";
import { GetAuctionsRequest } from "./types";
import { clientError, Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";

export const prepareRequest = (
  event: any
): E.Either<Errors, GetAuctionsRequest> => {
  return pipe(
    E.tryCatch(
      () => event.queryStringParameters.status,
      (_) => clientError("Status must be given!!")
    ),
    E.chain((status) =>
      typeof status === "string"
        ? E.right({ status })
        : E.left(clientError("Status must be given!!"))
    )
  );
};
