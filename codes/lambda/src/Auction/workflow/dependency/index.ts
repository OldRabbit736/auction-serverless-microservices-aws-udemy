import { Auction } from "../../domain/Auction";
import { InfraError } from "../../errors";
import * as E from "fp-ts/lib/Either";

export type CreateAuctionPort = (
  auction: Auction
) => Promise<E.Either<InfraError, Auction>>;

export type GetAuctionByIdPort = (
  id: string
) => Promise<E.Either<InfraError | NoAuctionFound, Auction>>;

export type NoAuctionFound = {
  _tag: "no auction found";
  message: string;
};

export type PlaceBidPort = (
  id: string
) => (amount: number) => Promise<E.Either<InfraError, Auction>>;
