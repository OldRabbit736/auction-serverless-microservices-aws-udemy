import { pipe } from "fp-ts/lib/function";
import { PlaceBidRequest } from "./types";

import * as E from "fp-ts/lib/Either";
import { sequenceS } from "fp-ts/lib/Apply";
import { clientError, Errors } from "../common/errors";

const parseId = (event: any): E.Either<Errors, string> => {
  return pipe(
    E.tryCatch(
      () => event.pathParameters.id,
      (_) => clientError("Id must be given!!")
    ),
    E.chain((id) =>
      typeof id === "string"
        ? E.right(id)
        : E.left(clientError("Id must be given!!"))
    )
  );
};

const parseAmount = (event: any): E.Either<Errors, number> => {
  return pipe(
    E.tryCatch(
      () => event.body.amount,
      (_) => clientError("Amount must be given!!")
    ),
    E.chain((amount) =>
      typeof amount === "number"
        ? E.right(amount)
        : E.left(clientError("Amount must be given!!"))
    )
  );
};

export const prepareRequest = (
  event: any
): E.Either<Errors, PlaceBidRequest> => {
  return sequenceS(E.Applicative)({
    id: parseId(event),
    amount: parseAmount(event),
  });
};
