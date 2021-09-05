import * as E from "fp-ts/Either";
import { Auction } from "../../../../domain/Auction";

export type CreateAuctionDto = {
  title: string;
};

export type CreateAuctionCommand = (
  dto: CreateAuctionDto
) => Promise<E.Either<string, Auction>>;
