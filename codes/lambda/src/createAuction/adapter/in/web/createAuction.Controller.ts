import commonMiddleware from "../../../../lib/commonMiddleware";
import createError from "http-errors";
import {
  CreateAuctionCommand,
  CreateAuctionUseCase,
} from "../../../application/port/in/createAuction.UseCase";
import { createAuctionService } from "../../../application/service/createAuction.Service";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { createAuctionPortImpl } from "../../out/persistence/AuctoinPersistenceAdapter";

const createAuction = async (event: any, context: any) => {
  const { title } = event.body;

  const command: CreateAuctionCommand = {
    title,
  };

  // dependency injection (createAuctionPortImpl)
  const createAuctionUseCase: CreateAuctionUseCase = createAuctionService(
    createAuctionPortImpl
  );
  const result = await createAuctionUseCase(command);

  return pipe(
    result,
    E.fold(
      (errormessage) => {
        throw new createError.InternalServerError(errormessage);
      },
      (auction) => {
        return {
          statusCode: 201,
          body: JSON.stringify(auction),
        };
      }
    )
  );
};

const handler = commonMiddleware(createAuction);

export { handler };
