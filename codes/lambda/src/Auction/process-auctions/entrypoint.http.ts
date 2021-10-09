import { getEndedAuctionsPortImplAWS } from "./implementation/aws";

const processAuctions = async (event: any) => {
  const auctionsToClose = await getEndedAuctionsPortImplAWS();
  console.log(auctionsToClose);
};

export const handler = processAuctions;
