import { prepareRequest } from "../../../src/Auction/get-auction-by-id/anticorruption";
import * as E from "fp-ts/lib/Either";
import { clientError } from "../../../src/Auction/common/errors";

describe("create-auction parseEvent", () => {
  it("should parse event", () => {
    const event = {
      pathParameters: {
        id: "123",
      },
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.right({ id: "123" }));
  });

  it("should throw", () => {
    const event = {
      pathParameters: {},
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.left(clientError("No Id!!")));
  });

  // TODO
  //   it("should throw", () => {
  //     const event = {};

  //     const result = prepareRequest(event);

  //     expect(result).toEqual(E.left(clientError("No Id!!")));
  //   });
});
