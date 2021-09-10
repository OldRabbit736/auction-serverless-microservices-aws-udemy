import { v4 as uuid } from "uuid";
import { Auction } from "../domain/Auction";
import { CreateAuctionPort } from "./dependency";

export const createAuctionWorkflow =
  (createAuctionPort: CreateAuctionPort) => async (title: string) => {
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);

    // core: make Auction instance
    // TODO: make smart constructor for Auction
    const auction: Auction = {
      id: uuid(),
      title: title,
      status: "OPEN",
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: 0,
      },
    };

    // shell
    return await createAuctionPort(auction);
  };
