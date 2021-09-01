import { v4 as uuid } from "uuid";
import {
  CreateAuctionUseCase,
  CreateAuctionCommand,
} from "../port/in/createAuction.UseCase";
import { Auction } from "../../domain/Auction";
import { CreateAuctionPort } from "../port/out/createAuction.Port";

export const createAuctionService = (
  createAuctionPort: CreateAuctionPort
): CreateAuctionUseCase => {
  return async (command: CreateAuctionCommand) => {
    const auction: Auction = {
      id: uuid(),
      title: command.title,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      highestBid: {
        amount: 0,
      },
    };

    // IO
    return createAuctionPort(auction);
  };
};
