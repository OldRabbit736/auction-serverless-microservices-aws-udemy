import { GetAuctionByIdPort } from "./database";

import * as TE from "fp-ts/lib/TaskEither";
import { Errors } from "../common/errors";
import { Auction } from "../common/auction";
import { GetAuctionByIdRequest } from "./types";

export const workflow =
  (getAuctionByIdPort: GetAuctionByIdPort) =>
  (request: GetAuctionByIdRequest): TE.TaskEither<Errors, Auction> =>
  () =>
    getAuctionByIdPort(request.id);
