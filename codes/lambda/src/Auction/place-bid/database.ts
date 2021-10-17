import { Auction } from "../common/auction";
import { Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";
import { PlaceBidRequest } from "./types";

export type PlaceBidPort = (
  request: PlaceBidRequest
) => Promise<E.Either<Errors, Auction>>;
