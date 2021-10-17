import { CreateAuctionRequest } from "./types";
import { makeAuction } from "../common/auction";
import { CreateAuctionPort } from "./database";

import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

const makeDates = () => {
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  return { startDate: now, endDate: endDate };
};

export const workflow =
  (createAuctionPort: CreateAuctionPort) =>
  (createAuctionRequest: CreateAuctionRequest) => {
    return pipe(
      makeDates(),
      makeAuction(createAuctionRequest),
      TE.fromEither,
      TE.chain((auction) => () => createAuctionPort(auction))
    );
  };
