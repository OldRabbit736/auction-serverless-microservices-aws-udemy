import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";

export const parseId =
  (errorMessage: string) =>
  (event: any): E.Either<string[], string> => {
    return pipe(
      E.tryCatch(
        () => event.pathParameters.id,
        (_) => [errorMessage]
      ),
      E.chain((id) =>
        typeof id === "string" ? E.right(id) : E.left([errorMessage])
      )
    );
  };
