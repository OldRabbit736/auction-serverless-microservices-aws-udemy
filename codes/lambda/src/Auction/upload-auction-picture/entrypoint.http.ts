import { Response } from "../common/responses";

const uploadAuctionPicture = async (event: any): Promise<Response> => {
  return {
    statusCode: 200,
    body: "upload picture",
  };
};

export const handler = uploadAuctionPicture;
