import { prepareRequest } from "../../../src/Auction/create-auction/anticorruption";
import * as E from "fp-ts/lib/Either";
import { clientError } from "../../../src/Auction/common/errors";

describe("create-auction parseEvent", () => {
  it("should parse event", () => {
    const event = {
      body: {
        title: "mac mini",
      },
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.right({ title: "mac mini" }));
  });

  it("should throw", () => {
    const event = {
      body: {},
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.left(clientError("No Title!!")));
  });
});
