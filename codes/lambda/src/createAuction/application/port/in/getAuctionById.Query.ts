import * as E from "fp-ts/Either";
import { Auction } from "../../../domain/Auction";

export type GetAuctionByIdQuery = (
  command: GetAuctionByIdCommand
) => Promise<E.Either<string, Auction>>;

export type GetAuctionByIdCommand = {
  id: string;
};

// export type GetAuctionByIdQuery = (
//   command: GetAuctionByIdCommand
// ) => Promise<E.Either<InternalError | NoAuctionFoundError, Auction>>;

// export type GetAuctionByIdCommand = {
//   id: string;
// };

// export type InternalError = {
//   _tag: "InternalError";
//   message: string;
// };

// export type NoAuctionFoundError = {
//   _tag: "NoAuctionFoundError";
//   message: string;
// };
