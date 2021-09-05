// import { pipe } from "fp-ts/lib/function";
// import * as E from "fp-ts/lib/Either";
// import createError from "http-errors";

// import {
//   GetAuctionByIdCommand,
//   GetAuctionByIdQuery,
// } from "./../../../application/port/in/getAuctionById.Query";
// import { getAuctionByIdPortImpl } from "../../out/persistence/AuctoinPersistenceAdapter";
// import { getAuctionByIdService } from "../../../application/service/getAuctionById.Service";
// import commonMiddleware from "../../../../../lib/commonMiddleware";

// const getAuction = async (event: any, context: any) => {
//   const { id } = event.pathParameters;

//   const getAuctionByIdQuery: GetAuctionByIdQuery = getAuctionByIdService(
//     getAuctionByIdPortImpl
//   );

//   const command: GetAuctionByIdCommand = { id };
//   const result = await getAuctionByIdQuery(command);

//   return pipe(
//     result,
//     E.fold(
//       (errormessage) => {
//         throw new createError.InternalServerError(errormessage);
//       },
//       (auction) => {
//         return {
//           statusCode: 200,
//           body: JSON.stringify(auction),
//         };
//       }
//     )
//   );
// };

// const handler = commonMiddleware(getAuction);

// export { handler };
