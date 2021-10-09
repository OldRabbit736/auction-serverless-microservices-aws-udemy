import { Auction } from "../common/auction";
import { Errors } from "../common/errors";
import { GetAuctionsPort } from "./database";

import * as TE from "fp-ts/lib/TaskEither";
import { GetAuctionsRequest } from "./types";

export const workflow =
  (getAuctionsPort: GetAuctionsPort) =>
  (getAuctionRequest: GetAuctionsRequest): TE.TaskEither<Errors, Auction[]> => {
    return () => getAuctionsPort(getAuctionRequest.status);
  };
