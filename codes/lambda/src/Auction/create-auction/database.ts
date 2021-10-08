import { Auction } from "../common/auction";
import { Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";

export type CreateAuctionPort = (
  auction: Auction
) => Promise<E.Either<Errors, Auction>>;
