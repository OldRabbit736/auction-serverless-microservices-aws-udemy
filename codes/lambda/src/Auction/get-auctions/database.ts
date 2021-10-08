import { Auction } from "../common/auction";
import { Errors } from "../common/errors";

import * as E from "fp-ts/lib/Either";

export type GetAuctionsPort = () => Promise<E.Either<Errors, Auction[]>>;
