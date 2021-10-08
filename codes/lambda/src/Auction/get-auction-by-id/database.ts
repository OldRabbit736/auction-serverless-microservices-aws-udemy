import { Auction } from "../common/auction";
import { Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";

export type GetAuctionByIdPort = (
  id: string
) => Promise<E.Either<Errors, Auction>>;
