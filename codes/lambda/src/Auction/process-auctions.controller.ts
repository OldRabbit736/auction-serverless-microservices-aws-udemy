import { getEndedAuction } from "./shell/get-ended-auctions";

const processAuctions = async (event: any, context: any) => {
  const auctionsToClose = await getEndedAuction();
  console.log(auctionsToClose);
};

export { processAuctions as handler };
