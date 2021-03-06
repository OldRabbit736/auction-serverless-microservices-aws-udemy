import { Config } from "./types/config";

const config: Config = {
  Project: {
    Name: "Auction",
    Stage: "Dev",
    Region: "ap-northeast-2",
  },
  Stack: {
    AuctionService: {
      Name: "AuctionServiceStack",
      TableName: "AuctionsTable",
      ApiGateWayName: "AuctionsService",
    },
  },
};

export default config;
