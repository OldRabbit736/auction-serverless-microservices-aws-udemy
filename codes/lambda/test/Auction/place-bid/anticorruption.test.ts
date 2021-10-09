import { prepareRequest } from "../../../src/Auction/place-bid/anticorruption";
import * as E from "fp-ts/lib/Either";
import { clientError } from "../../../src/Auction/common/errors";

describe("place-bid parseEvent", () => {
  it("should parse event", () => {
    const event = {
      pathParameters: {
        id: "abc",
      },
      body: {
        amount: 400,
      },
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.right({ id: "abc", amount: 400 }));
  });

  it("should return error when no amount", () => {
    const event = {
      pathParameters: {
        id: "abc",
      },
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.left(clientError("Amount must be given!!")));
  });

  it("should return error when no id", () => {
    const event = {
      body: {
        amount: 400,
      },
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.left(clientError("Id must be given!!")));
  });

  it("should return error when neither id nor amount", () => {
    const event = {};

    const result = prepareRequest(event);

    expect(result).toEqual(E.left(clientError("Id must be given!!")));
  });
});
