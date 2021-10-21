import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as A from "fp-ts/lib/ReadonlyArray";

import { clientError, Errors } from "./../common/errors";
import { parseId } from "./../common/parseId";
import { UploadAuctionPictureRequest } from "./types";
import { parseBody } from "../common/parseBody";

export const prepareRequest = (
  event: any
): E.Either<Errors, UploadAuctionPictureRequest> => {
  return pipe(
    sequenceS(app)({
      auctionId: parseId("Id must be given!!")(event),
      base64Buffer: base64Buffer(event),
    }),
    E.mapLeft((errors) => errors.join(", ")),
    E.mapLeft(clientError)
  );
};

const app = E.getApplicativeValidation(A.getSemigroup<string>());

const base64Buffer = (event: any): E.Either<string[], Buffer> => {
  return pipe(
    parseBody("Body must be given!!")(event),
    E.map((body) => body.replace(/^data:image\/\w+;base64,/, "")),
    E.map((base64) => Buffer.from(base64, "base64"))
  );
};
