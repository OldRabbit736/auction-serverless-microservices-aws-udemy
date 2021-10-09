import { handleError } from "./../common/responses";
import { pipe } from "fp-ts/lib/function";
import {
  closeAuctionPortImplAWS,
  getEndedAuctionsPortImplAWS,
} from "./implementation/aws";

import { notFound } from "../common/errors";

import * as TE from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import * as T from "fp-ts/lib/Task";

const processAuctions = async (event: any) => {
  return pipe(
    () => getEndedAuctionsPortImplAWS(),
    // TE.chainW((items) =>
    //   items.length === 0
    //     ? TE.left(notFound("No Auctions Found"))
    //     : TE.right(items)
    // ),
    TE.map((items) => items.map((item) => item.id as string)),
    TE.chain((auctionIds) => {
      return A.sequence(TE.ApplicativePar)(
        auctionIds.map((id) => () => closeAuctionPortImplAWS(id))
      );
    }),
    TE.bimap(handleError, (outputs) => ({
      closed: outputs.length,
    })),
    TE.getOrElseW(T.of)
  )();
};

export const handler = processAuctions;
