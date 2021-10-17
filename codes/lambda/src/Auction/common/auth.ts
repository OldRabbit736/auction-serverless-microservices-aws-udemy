import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

export const parseEmail = (event: any): E.Either<string[], string> => {
  return pipe(
    E.tryCatch(
      () => event.requestContext.authorizer.claims.email,
      (_) => ["Email must be given!!"]
    ),
    E.chain((id) =>
      typeof id === "string" ? E.right(id) : E.left(["Email must be given!!"])
    )
  );
};
