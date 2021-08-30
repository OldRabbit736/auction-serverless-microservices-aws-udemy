import * as E from "fp-ts/Either";
import { Auction } from "../../../domain/Auction";

export type CreateAuction = (
  command: CreateAuctionCommand
) => Promise<E.Either<string, Auction>>;

export type CreateAuctionCommand = {
  title: string;
};
