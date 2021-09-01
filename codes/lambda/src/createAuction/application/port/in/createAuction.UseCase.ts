import * as E from "fp-ts/Either";
import { Auction } from "../../../domain/Auction";

export type CreateAuctionUseCase = (
  command: CreateAuctionCommand
) => Promise<E.Either<string, Auction>>;

export type CreateAuctionCommand = {
  title: string;
};
