import { handleError } from "./../common/responses";
import { pipe } from "fp-ts/lib/function";
import {
  closeAuctionPortImplAWS,
  getEndedAuctionsPortImplAWS,
} from "./implementation/aws";

import * as TE from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import * as T from "fp-ts/lib/Task";
import { request } from "./transformer";

const processAuctions = async (_: any) => {
  return pipe(
    () => getEndedAuctionsPortImplAWS(),
    // TE.chainW((items) =>
    //   items.length === 0
    //     ? TE.left(notFound("No Auctions Found"))
    //     : TE.right(items)
    // ),
    TE.map((items) => items.map(request)),
    TE.chain((requests) => {
      return A.sequence(TE.ApplicativePar)(
        requests.map((request) => () => closeAuctionPortImplAWS(request))
      );
    }),
    TE.bimap(handleError, (outputs) => ({
      closed: outputs.length,
    })),
    TE.getOrElseW(T.of)
  )();
};

export const handler = processAuctions;
