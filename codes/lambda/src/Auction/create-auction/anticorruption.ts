import { parseEmail } from "./../common/auth";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { CreateAuctionRequest } from "./types";
import { clientError, Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/ReadonlyArray";
// import * as t from "io-ts";

// const inputDecoder = t.type({
//   body: t.type({
//     title: t.string,
//   }),
// });

// export const prepareRequest = (
//   event: any
// ): E.Either<Errors, CreateAuctionRequest> => {
//   return pipe(
//     inputDecoder.decode(event),
//     E.mapLeft((_) => clientError("No Title!!")),
//     E.chain((input) =>
//       input.body.title.length === 0
//         ? E.left(clientError("No Title!!"))
//         : E.right({ title: input.body.title })
//     )
//   );
// };

export const parseTitle = (event: any): E.Either<string[], string> => {
  return pipe(
    E.tryCatch(
      () => event.body.title,
      (_) => ["Title must be given!!"]
    ),
    E.chain((title) =>
      typeof title === "string"
        ? E.right(title)
        : E.left(["Title must be given!!"])
    ),
    E.chain((title) =>
      title.length === 0 ? E.left(["Title must be given!!"]) : E.right(title)
    )
  );
};

const app = E.getApplicativeValidation(A.getSemigroup<string>());

export const prepareRequest = (
  event: any
): E.Either<Errors, CreateAuctionRequest> => {
  return pipe(
    sequenceS(app)({
      title: parseTitle(event),
      email: parseEmail(event),
    }),
    E.mapLeft((errors) => clientError(errors.join(", ")))
  );
};
