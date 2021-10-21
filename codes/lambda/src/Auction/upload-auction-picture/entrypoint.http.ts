import { getAuctionByIdPortImplAWS } from "./../get-auction-by-id/implementation/aws";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import { Response } from "../common/responses";
import { prepareRequest } from "./anticorruption";
import { workflow } from "./workflow";
import { uploadPictureToStoragePortImplAWS } from "./implementation/aws";

const uploadAuctionPicture = async (event: any): Promise<Response> => {
  await pipe(
    prepareRequest(event),
    TE.fromEither,
    TE.chain(
      workflow(getAuctionByIdPortImplAWS)(uploadPictureToStoragePortImplAWS)
    )
  )();

  return {
    statusCode: 200,
    body: "upload picture",
  };
};

export const handler = uploadAuctionPicture;
