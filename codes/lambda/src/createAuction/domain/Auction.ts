// TODO: define domain objects for the fields
export type Auction = {
  id: string;
  title: string;
  status: "OPEN";
  createdAt: string;
  highestBid: {
    amount: number;
  };
};
