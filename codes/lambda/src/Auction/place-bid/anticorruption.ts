import { pipe } from "fp-ts/lib/function";
import { PlaceBidRequest } from "./types";
import { clientError, Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";
import * as A from "fp-ts/lib/ReadonlyArray";

const parseId = (event: any): E.Either<Errors[], string> => {
  return pipe(
    E.tryCatch(
      () => event.pathParameters.id,
      (_) => [clientError("Id must be given!!")]
    ),
    E.chain((id) =>
      typeof id === "string"
        ? E.right(id)
        : E.left([clientError("Id must be given!!")])
    )
  );
};

const parseAmount = (event: any): E.Either<Errors[], number> => {
  return pipe(
    E.tryCatch(
      () => event.body.amount,
      (_) => [clientError("Amount must be given!!")]
    ),
    E.chain((amount) =>
      typeof amount === "number"
        ? E.right(amount)
        : E.left([clientError("Amount must be given!!")])
    )
  );
};

const app = E.getApplicativeValidation(A.getSemigroup<Errors>());

export const prepareRequest = (
  event: any
): E.Either<Errors, PlaceBidRequest> => {
  return pipe(
    sequenceT(app)(parseId(event), parseAmount(event)),
    E.bimap(
      (errors) => errors.map((error) => error.message).join(", "),
      ([id, amount]) => ({
        id,
        amount,
      })
    ),
    E.mapLeft(clientError)
  );
};

// it's too hard with io-ts when there are nested properties...

// const inputDecoder = t.type({
//   pathParameters: t.type({
//     id: withMessage(t.string, () => "Id must be given!!"),
//   }),
//   body: t.type({
//     amount: withMessage(t.number, () => "Amount must be given!!"),
//   }),
// });

// type inputType = t.TypeOf<typeof inputDecoder>;

// const transformer = (i: inputType): PlaceBidRequest => ({
//   id: i.pathParameters.id,
//   amount: i.body.amount,
// });

// export const prepareRequest2 = (
//   event: any
// ): E.Either<Errors, PlaceBidRequest> => {
//   return pipe(
//     inputDecoder.decode(event),
//     E.mapLeft((errors) =>
//       errors
//         .map((error) => error.context.map((c) => c.key).join(", "))
//         .join(", ")
//     ),
//     E.mapLeft(clientError),
//     E.map(transformer)
//   );
// };
