import { getAuctionByIdPortImplAWS } from "./../get-auction-by-id/implementation/aws";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";

import { handleError, okResponse, Response } from "../common/responses";
import { prepareRequest } from "./anticorruption";
import { workflow } from "./workflow";
import {
  addPictureUrlPortImplAWS,
  uploadPictureToStoragePortImplAWS,
} from "./implementation/aws";

const uploadAuctionPicture = async (event: any): Promise<Response> =>
  pipe(
    prepareRequest(event),
    TE.fromEither,
    TE.chain(
      workflow(getAuctionByIdPortImplAWS)(uploadPictureToStoragePortImplAWS)(
        addPictureUrlPortImplAWS
      )
    ),
    TE.map(JSON.stringify),
    TE.bimap(handleError, okResponse),
    TE.getOrElse(T.of)
  )();

export const handler = uploadAuctionPicture;
