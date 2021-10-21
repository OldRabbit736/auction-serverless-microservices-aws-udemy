import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import { serverError } from "./../common/errors";
import { GetAuctionByIdPort } from "../get-auction-by-id/database";
import { UploadAuctionPictureRequest } from "./types";
import { Errors } from "../common/errors";
import { getMessageOr } from "../common/util";
import { UploadPictureToStoragePort } from "./storage";
import { AddPictureUrlPort } from "./database";

export const workflow =
  (getAuctionByIdPort: GetAuctionByIdPort) =>
  (uploadPictureToStoragePort: UploadPictureToStoragePort) =>
  (addPictureUrlPort: AddPictureUrlPort) =>
  (request: UploadAuctionPictureRequest): TE.TaskEither<Errors, any> => {
    return pipe(
      () => getAuctionByIdPort(request.auctionId),
      TE.chain((_) =>
        TE.tryCatch(
          () =>
            uploadPictureToStoragePort(request.auctionId, request.base64Buffer),
          (u) => serverError(getMessageOr("Error uploading picture")(u))
        )
      ),
      TE.chain(
        (location) => () => addPictureUrlPort(request.auctionId, location)
      )
    );
  };
