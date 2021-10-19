import { CloseAuctionRequest } from "./types";

export const request = (item: any): CloseAuctionRequest => {
  return {
    auctionId: item.id,
    title: item.title,
    seller: item.seller,
    amount: item.highestBid.amount,
    bidder: item.highestBid.bidder,
  };
};
