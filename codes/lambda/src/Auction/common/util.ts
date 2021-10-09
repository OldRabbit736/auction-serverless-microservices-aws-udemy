export const hasMessage = (u: unknown): u is { message: string } =>
  Object.keys(u).filter((key) => key === "message").length === 1;

export const getMessageOr =
  (defaultMessage: string) =>
  (u: unknown): string =>
    hasMessage(u) ? u.message : defaultMessage;
