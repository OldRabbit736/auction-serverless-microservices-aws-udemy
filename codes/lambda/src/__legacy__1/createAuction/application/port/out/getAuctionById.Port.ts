import { Auction } from "../../../domain/Auction";
import * as E from "fp-ts/lib/Either";

export type GetAuctionByIdPort = (
  id: string
) => Promise<E.Either<string, Auction>>;
