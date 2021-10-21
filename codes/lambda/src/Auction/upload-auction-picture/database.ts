import * as E from "fp-ts/lib/Either";
import { Errors } from "./../common/errors";

export type AddPictureUrlPort = (
  auctionId: string,
  pictureUrl: string
) => Promise<E.Either<Errors, any>>;
