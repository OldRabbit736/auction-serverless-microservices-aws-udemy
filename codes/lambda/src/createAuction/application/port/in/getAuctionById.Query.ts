import * as E from "fp-ts/Either";
import { Auction } from "../../../domain/Auction";

export type GetAuctionByIdQuery = (
  command: GetAuctionByIdCommand
) => Promise<E.Either<string, Auction>>;

export type GetAuctionByIdCommand = {
  id: string;
};
