// TODO: define domain objects for the fields
// TODO: define smart constructor
export type Auction = {
  id: string;
  title: string;
  status: "OPEN";
  createdAt: string;
  endingAt: string;
  highestBid: {
    amount: number;
  };
};

export const isBiddable = (auction: Auction) => (amount: number) => {
  return auction.highestBid.amount < amount;
};
