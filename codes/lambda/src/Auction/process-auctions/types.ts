export type CloseAuctionRequest = ClosingAuction;

export type ClosingAuction = WithoutBidder | WithBidder;

export type WithoutBidder = {
  tag: "WithoutBidder";
  auctionId: string;
  title: string;
  seller: string;
};

export type WithBidder = {
  tag: "WithBidder";
  auctionId: string;
  title: string;
  seller: string;
  bidder: string;
  amount: number;
};
