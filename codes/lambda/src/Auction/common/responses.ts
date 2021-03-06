import { Errors } from "./errors";

/* Types */
export type Response = {
  readonly statusCode: number;
  readonly body?: string;
};

/* Makers */
export const handleError = (err: Errors): Response => {
  function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here");
  }

  switch (err.type) {
    case "ClientError": {
      return badRequestResponse(err.message);
    }

    case "NotFoundError": {
      return notFoundResponse(err.message);
    }

    case "ServerError": {
      console.warn(err.message);
      return internalServerErrorResponse(err.message);
    }

    case "Forbidden": {
      return forbiddenResponse(err.message);
    }
  }

  return assertUnreachable(err);
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

export const forbiddenResponse = (body?: string): Response => ({
  statusCode: 403,
  body,
});

export const notFoundResponse = (body?: string): Response => ({
  statusCode: 404,
  body,
});

export const internalServerErrorResponse = (body?: string): Response => ({
  statusCode: 500,
  body: body ? body : "Internal Server Error",
});
