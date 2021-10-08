import { v4 as uuid } from "uuid";
import { Auction } from "../../../../domain/Auction";
import {
  CreateAuctionCommand,
  CreateAuctionDto,
} from "../in/create-auction.command";
import { CreateAuctionPort } from "../out/create-auction.port";

export const createAuctionService = (
  createAuctionPort: CreateAuctionPort
): CreateAuctionCommand => {
  return async (dto: CreateAuctionDto) => {
    const auction: Auction = {
      id: uuid(),
      title: dto.title,
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
