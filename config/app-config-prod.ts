import { Config } from "./types/config";

const config: Config = {
  Project: {
    Name: "Auction",
    Stage: "Prod",
    Region: "ap-northeast-2",
  },
  Stack: {
    AuctionService: {
      Name: "AuctionServiceStack",
      TableName: "AuctionsTable",
    },
  },
};

export default config;
