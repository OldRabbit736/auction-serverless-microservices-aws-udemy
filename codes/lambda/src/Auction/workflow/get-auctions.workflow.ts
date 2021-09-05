import { GetAuctionsPort } from "./dependency";

export const getAuctionsWorkflow = (getAuctionsPort: GetAuctionsPort) => () => {
  return getAuctionsPort();
};
