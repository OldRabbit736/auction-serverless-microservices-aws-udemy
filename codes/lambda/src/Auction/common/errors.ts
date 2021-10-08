/* Types */
export type ClientError = {
  readonly type: "ClientError";
  readonly message: string;
};

export type ServerError = {
  readonly type: "ServerError";
  readonly message: string;
};

export type NotFoundError = {
  readonly type: "NotFoundError";
  readonly message?: string;
};

export type Errors = ClientError | ServerError | NotFoundError;

/* Makers */
export const clientError = (message: string): ClientError => {
  return {
    type: "ClientError",
    message,
  };
};

export const serverError = (message: string): ServerError => {
  return {
    type: "ServerError",
    message,
  };
};

export const notFound = (message?: string): NotFoundError => {
  return {
    type: "NotFoundError",
    message,
  };
};
