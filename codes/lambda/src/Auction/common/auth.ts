import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { clientError, Errors } from "./errors";

export const parseEmail = (event: any): E.Either<Errors[], string> => {
  return pipe(
    E.tryCatch(
      () => event.requestContext.authorizer.claims.email,
      (_) => [clientError("Email must be given!!")]
    ),
    E.chain((id) =>
      typeof id === "string"
        ? E.right(id)
        : E.left([clientError("Email must be given!!")])
    )
  );
};
