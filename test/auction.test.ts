import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Auction from "../infra/stacks/auction-stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Auction.AuctionStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
