import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";

export const parseBody =
  (errorMessage: string) =>
  (event: any): E.Either<string[], string> => {
    return pipe(
      E.tryCatch(
        () => event.body,
        (_) => [errorMessage]
      ),
      E.chain((body) =>
        typeof body === "string" ? E.right(body) : E.left([errorMessage])
      )
    );
  };
