import { prepareRequest } from "../../../src/Auction/create-auction/anticorruption";
import * as E from "fp-ts/lib/Either";
import { clientError } from "../../../src/Auction/common/errors";

describe("create-auction parseEvent", () => {
  it("should parse event", () => {
    const event = {
      body: {
        title: "mac mini",
      },
      requestContext: {
        authorizer: {
          claims: {
            email: "abc@gmail.com",
          },
        },
      },
    };

    const result = prepareRequest(event);

    expect(result).toEqual(
      E.right({ title: "mac mini", email: "abc@gmail.com" })
    );
  });

  it("should result in error", () => {
    const event = {
      body: {
        title: "mac mini",
      },
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.left(clientError("Email must be given!!")));
  });

  it("should result in error", () => {
    const event = {
      body: {},
      requestContext: {
        authorizer: {
          claims: {
            email: "abc@gmail.com",
          },
        },
      },
    };

    const result = prepareRequest(event);

    expect(result).toEqual(E.left(clientError("Title must be given!!")));
  });
});
