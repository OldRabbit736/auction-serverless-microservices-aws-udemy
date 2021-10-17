import { pipe } from "fp-ts/lib/function";
import { clientError, Errors, forbidden, serverError } from "./errors";

import { v4 as uuid } from "uuid";
import * as E from "fp-ts/lib/Either";

type AuctionProps = {
  id: string;
  title: string;
  status: "OPEN";
  createdAt: string;
  endingAt: string;
  highestBid: {
    amount: number;
    bidder?: string;
  };
  seller: string;
};

type AuctionBrand = {
  readonly Auction: unique symbol;
};

export type Auction = AuctionProps & AuctionBrand;

const alwaysPass = (a: AuctionProps): a is Auction => {
  return true;
};

export const isBiddable =
  (amount: number, bidder: string) => (auction: Auction) => {
    const isAmountHigher = (amount: number) => (auction: Auction) =>
      auction.highestBid.amount < amount
        ? E.right(auction)
        : E.left(
            forbidden(
              `Your bid must be higher than ${auction.highestBid.amount}`
            )
          );

    const isAuctionNotClosed = (auction: Auction) =>
      auction.status === "OPEN"
        ? E.right(auction)
        : E.left(
            forbidden(
              `You cannot place bid on not open auction: "${auction.title}"`
            )
          );

    const isBidderSellerDifferent = (bidder: string) => (auction: Auction) =>
      bidder === auction.seller
        ? E.left(forbidden(`You cannot bid on your own auctions!`))
        : E.right(auction);

    const isDoubleBidding = (bidder: string) => (auction: Auction) =>
      bidder === auction.highestBid.bidder
        ? E.left(forbidden(`You are already the highest bidder`))
        : E.right(auction);

    return pipe(
      isAuctionNotClosed(auction),
      E.chain(isAmountHigher(amount)),
      E.chain(isBidderSellerDifferent(bidder)),
      E.chain(isDoubleBidding(bidder))
    );
  };

export const makeAuction =
  ({ title, email }: { title: string; email: string }) =>
  ({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): E.Either<Errors, Auction> => {
    if (startDate >= endDate) {
      return E.left(clientError("end date must be later than start date"));
    }

    if (title.length === 0) {
      return E.left(clientError("Title should be long enough"));
    }

    const a: AuctionProps = {
      id: uuid(),
      title,
      status: "OPEN",
      createdAt: startDate.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: 0,
      },
      seller: email,
    };

    return alwaysPass(a)
      ? E.right(a)
      : E.left(serverError("error making auction from title"));
  };
