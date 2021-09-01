import {
  GetAuctionByIdCommand,
  GetAuctionByIdQuery,
} from "../port/in/getAuctionById.Query";
import { GetAuctionByIdPort } from "../port/out/getAuctionById.Port";

export const getAuctionByIdService = (
  getAuctionByIdPort: GetAuctionByIdPort
): GetAuctionByIdQuery => {
  return async (command: GetAuctionByIdCommand) => {
    return getAuctionByIdPort(command.id);
  };
};
