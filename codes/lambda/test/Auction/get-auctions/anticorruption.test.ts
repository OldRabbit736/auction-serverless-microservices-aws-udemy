import { prepareRequest } from "../../../src/Auction/get-auctions/anticorruption";

import * as E from "fp-ts/lib/Either";
import { clientError } from "../../../src/Auction/common/errors";

describe("GetAuctions parseRequest", () => {
  it("should be given status from request", () => {
    const event = {
      queryStringParameters: {
        status: "OPEN",
      },
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.right({ status: "OPEN" }));
  });

  it("should return warning", () => {
    const event = {};

    const result = prepareRequest(event);

    expect(result).toEqual(E.left(clientError("Status must be given!!")));
  });
});
