import { pipe } from "fp-ts/lib/function";
import { GetAuctionsRequest } from "./types";
import { clientError, Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";

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

const inputDecoder = t.type({
  queryStringParameters: t.type({
    status: t.keyof({
      OPEN: null,
      CLOSED: null,
    }),
  }),
});

type input = t.TypeOf<typeof inputDecoder>;

const transformer = (i: input): GetAuctionsRequest => ({
  status: i.queryStringParameters.status,
});

export const prepareRequest2 = (event: any): GetAuctionsRequest => {
  return pipe(
    inputDecoder.decode(event),
    E.fold((_): GetAuctionsRequest => ({ status: "OPEN" }), transformer)
  );
};
