import * as E from "fp-ts/lib/Either";
import { Auction } from "../domain/Auction";
import { InfraError } from "../errors";

export type GetAuctionByIdPort = (
  id: string
) => Promise<E.Either<InfraError | NoAuctionFound, Auction>>;

export type NoAuctionFound = {
  _tag: "no auction found";
  message: string;
};

export const getAuctionByIdWorkflow =
  (getAuctionByIdPort: GetAuctionByIdPort) => (id: string) => {
    // shell
    return getAuctionByIdPort(id);
  };
