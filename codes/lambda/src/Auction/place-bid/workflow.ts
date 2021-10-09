import { GetAuctionByIdPort } from "../get-auction-by-id/database";
import { PlaceBidRequest } from "./types";
import { PlaceBidPort } from "./database";

import { Errors } from "../common/errors";
import { Auction, isBiddable } from "../common/auction";

import { flow, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

export const workflow =
  (getAuctionByIdPort: GetAuctionByIdPort) =>
  (placeBidPort: PlaceBidPort) =>
  (request: PlaceBidRequest): TE.TaskEither<Errors, Auction> => {
    return pipe(
      () => getAuctionByIdPort(request.id),
      TE.chain(flow(isBiddable(request.amount), TE.fromEither)),
      TE.chain((_) => () => placeBidPort(request.id)(request.amount))
    );
  };
