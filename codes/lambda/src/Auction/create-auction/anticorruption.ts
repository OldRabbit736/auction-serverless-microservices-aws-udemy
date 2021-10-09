import { pipe } from "fp-ts/lib/function";
import { CreateAuctionRequest } from "./types";
import { clientError, Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";

const inputDecoder = t.type({
  body: t.type({
    title: t.string,
  }),
});

export const prepareRequest = (
  event: any
): E.Either<Errors, CreateAuctionRequest> => {
  return pipe(
    inputDecoder.decode(event),
    E.mapLeft((_) => clientError("No Title!!")),
    E.chain((input) =>
      input.body.title.length === 0
        ? E.left(clientError("No Title!!"))
        : E.right({ title: input.body.title })
    )
  );
};
