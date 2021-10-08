import { GetAuctionByIdPort } from "./dependency";

export const getAuctionByIdWorkflow =
  (getAuctionByIdPort: GetAuctionByIdPort) => (id: string) => {
    // shell
    return getAuctionByIdPort(id);
  };
