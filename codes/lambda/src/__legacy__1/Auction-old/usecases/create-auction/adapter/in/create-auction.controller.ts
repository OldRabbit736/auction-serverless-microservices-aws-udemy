// import commonMiddleware from "../../../../../lib/commonMiddleware";
// import createError from "http-errors";
// import * as E from "fp-ts/lib/Either";
// import { pipe } from "fp-ts/lib/function";
// import {
//   CreateAuctionCommand,
//   CreateAuctionDto,
// } from "../../application/in/create-auction.command";
// import { createAuctionService } from "../../application/service/create-auction.service";
// import { createAuctionPort } from "../out/auction.repository";

// const createAuction = async (event: any, context: any) => {
//   const { title } = event.body;

//   const dto: CreateAuctionDto = {
//     title,
//   };

//   // dependency injection (createAuctionPort)
//   // TODO: IoC container should manage dependencies
//   const command: CreateAuctionCommand = createAuctionService(createAuctionPort);
//   const result = await command(dto);

//   return pipe(
//     result,
//     E.fold(
//       (errormessage) => {
//         throw new createError.InternalServerError(errormessage);
//       },
//       (auction) => {
//         return {
//           statusCode: 201,
//           body: JSON.stringify(auction),
//         };
//       }
//     )
//   );
// };

// const handler = commonMiddleware(createAuction);

// export { handler };
