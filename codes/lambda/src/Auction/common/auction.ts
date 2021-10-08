import { clientError, Errors, serverError } from "./errors";

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
  };
};

type AuctionBrand = {
  readonly Auction: unique symbol;
};

export type Auction = AuctionProps & AuctionBrand;

const alwaysPass = (a: AuctionProps): a is Auction => {
  return true;
};

export const makeAuction =
  (title: string) =>
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
    };

    return alwaysPass(a)
      ? E.right(a)
      : E.left(serverError("error making auction from title"));
  };
