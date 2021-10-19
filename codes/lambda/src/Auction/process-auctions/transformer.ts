import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";

import {
  CloseAuctionRequest,
  ClosingAuction,
  WithBidder,
  WithoutBidder,
} from "./types";

export const request = (item: any): CloseAuctionRequest => {
  return closingAuction(item);
};

export const closingAuction = (item: any): ClosingAuction => {
  return pipe(
    item.highestBid,
    O.fromNullable,
    O.chain((bid) =>
      sequenceS(O.Applicative)({
        bidder: O.fromNullable(bid.bidder),
        amount: O.fromNullable(bid.amount),
      })
    ),
    O.fold(
      (): ClosingAuction => ({
        tag: "WithoutBidder",
        auctionId: item.id,
        title: item.title,
        seller: item.seller,
      }),
      (info): ClosingAuction => ({
        tag: "WithBidder",
        auctionId: item.id,
        title: item.title,
        seller: item.seller,
        bidder: info.bidder as string,
        amount: info.amount as number,
      })
    )
  );
};
