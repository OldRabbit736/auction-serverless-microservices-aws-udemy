import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { GetAuctionByIdPort, PlaceBidPort } from "./dependency";
import { isBiddable } from "../domain/Auction";

export const placeBidWorkflow =
  (getAuctionByIdPort: GetAuctionByIdPort) =>
  (placeBidPort: PlaceBidPort) =>
  async (id: string, amount: number) => {
    // IO
    const auction = await getAuctionByIdPort(id);

    // Pure
    const biddableOrNot = pipe(
      auction,
      E.chainW((auction) => {
        const biddable = isBiddable(auction)(amount);

        if (!biddable) {
          const error: BidLowError = {
            _tag: "BidLowError",
            message: `Your bid must be higher than ${auction.highestBid.amount}`,
          };

          return {
            _tag: "Left",
            left: error,
          };
        }

        return {
          _tag: "Right",
          right: auction,
        };
      })
    );

    // Pure
    if (biddableOrNot._tag === "Left") {
      return biddableOrNot;
    }

    // IO
    const biddableAuction = biddableOrNot.right;
    return placeBidPort(biddableAuction.id)(amount);
  };

export type BidLowError = {
  _tag: "BidLowError";
  message: string;
};

//   if (amount <= auction.highestBid.amount) {
//     throw new createError.Forbidden(
//       `Your bid must be higher than ${auction.highestBid.amount}`
//     );
//   }
