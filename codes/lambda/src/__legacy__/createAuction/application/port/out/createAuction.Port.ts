import { Auction } from "../../../domain/Auction";
import * as E from "fp-ts/lib/Either";

export type CreateAuctionPort = (
  auction: Auction
) => Promise<E.Either<string, Auction>>;
