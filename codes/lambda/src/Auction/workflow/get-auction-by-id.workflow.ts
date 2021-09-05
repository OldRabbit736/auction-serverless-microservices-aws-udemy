import * as E from "fp-ts/lib/Either";
import { Auction } from "../domain/Auction";

export type GetAuctionByIdPort = (
  id: string
) => Promise<E.Either<string, Auction>>;

export const getAuctionByIdWorkflow =
  (getAuctionByIdPort: GetAuctionByIdPort) => (id: string) => {
    // shell
    return getAuctionByIdPort(id);
  };
