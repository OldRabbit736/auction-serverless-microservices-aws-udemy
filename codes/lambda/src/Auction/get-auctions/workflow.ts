import { Auction } from "../common/auction";
import { Errors } from "../common/errors";
import { GetAuctionsPort } from "./database";

import * as TE from "fp-ts/lib/TaskEither";

export const workflow = (
  getAuctionsPort: GetAuctionsPort
): TE.TaskEither<Errors, Auction[]> => {
  return () => getAuctionsPort();
};
