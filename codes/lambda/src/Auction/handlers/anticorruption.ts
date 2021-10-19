import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import JSON, { JsonRecord } from "fp-ts/lib/Json";
import { SendEmailRequest } from "aws-sdk/clients/ses"; // Infra detail leaks into this layer... but it's ok.

export const prepareRequest = (
  event: any
): E.Either<string, SendEmailRequest> => {
  return pipe(
    E.tryCatch(
      () => event.Records[0],
      (_) => "Records not present"
    ),
    E.chain(parseRecord)
  );
};

const parseRecord = (record: any): E.Either<string, SendEmailRequest> => {
  return pipe(
    record.body,
    E.fromNullable("no body"),
    E.chain(JSON.parse),
    E.map((email) => {
      // can be converted to sequenceS
      const { subject, body, recipient } = email as JsonRecord;
      return { subject, body, recipient };
    }),
    E.map(mailRequest),
    E.mapLeft((u) =>
      u instanceof Error
        ? u.message
        : typeof u === "string"
        ? u
        : "Unkown Error"
    )
  );
};

const mailRequest = ({
  subject,
  body,
  recipient,
}: {
  subject: string;
  body: string;
  recipient: string;
}): SendEmailRequest => {
  return {
    Source: "sylvan0212@gmail.com",
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };
};
