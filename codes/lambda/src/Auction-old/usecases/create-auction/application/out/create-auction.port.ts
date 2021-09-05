import * as E from "fp-ts/lib/Either";
import { Auction } from "../../../../domain/Auction";

export type CreateAuctionPort = (
  auction: Auction
) => Promise<E.Either<string, Auction>>;
