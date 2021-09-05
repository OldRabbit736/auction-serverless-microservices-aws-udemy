import { v4 as uuid } from "uuid";
import { Auction } from "../domain/Auction";
import { CreateAuctionPort } from "./dependency";

export const createAuctionWorkflow =
  (createAuctionPort: CreateAuctionPort) => async (title: string) => {
    // core: make Auction instance
    // TODO: make smart constructor for Auction
    const auction: Auction = {
      id: uuid(),
      title: title,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      highestBid: {
        amount: 0,
      },
    };

    // shell
    return await createAuctionPort(auction);
  };
