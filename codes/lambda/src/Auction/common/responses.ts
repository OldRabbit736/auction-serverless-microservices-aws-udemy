import { Errors } from "./errors";

/* Types */
export type Response = {
  readonly statusCode: number;
  readonly body?: string;
};

/* Makers */
export const handleError = (err: Errors): Response => {
  switch (err.type) {
    case "ClientError": {
      return badRequestResponse(err.message);
    }

    case "NotFoundError": {
      return notFoundResponse();
    }

    case "ServerError": {
      console.warn(err.message);
      return internalServerErrorResponse(err.message);
    }
  }
};

export const okResponse = (body: string): Response => ({
  statusCode: 200,
  body,
});

export const createdResponse = (body?: string): Response => ({
  statusCode: 201,
  body,
});

export const badRequestResponse = (body?: string): Response => ({
  statusCode: 400,
  body,
});

export const notFoundResponse = (): Response => ({
  statusCode: 404,
});

export const internalServerErrorResponse = (body?: string): Response => ({
  statusCode: 500,
  body: body ? body : "Internal Server Error",
});
