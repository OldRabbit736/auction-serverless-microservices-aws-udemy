export type StackName = {
  Name: string;
};

export type AuctionService = {
  TableName: string;
  ApiGateWayName: string;
} & StackName;

export type Config = {
  Project: {
    Name: string;
    Stage: "Dev" | "Prod";
    Region: "ap-northeast-2";
  };
  Stack: {
    AuctionService: AuctionService;
  };
};
