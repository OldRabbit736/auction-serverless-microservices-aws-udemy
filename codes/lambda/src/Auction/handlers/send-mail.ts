import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";

import AWS from "aws-sdk";
import { prepareRequest } from "./anticorruption";

const ses = new AWS.SES({ region: "ap-northeast-2" });

const sendMail = async (event: any) => {
  return pipe(
    prepareRequest(event),
    TE.fromEither,
    TE.chain((request) =>
      TE.tryCatch(
        () => ses.sendEmail(request).promise(),
        (error) => error
      )
    ),
    TE.getOrElseW((e) => T.of(console.error("error sending email:", e)))
  )();

  // const params: SendEmailRequest = {
  //   Source: "sylvan0212@gmail.com",
  //   Destination: {
  //     ToAddresses: ["sylvan0212@gmail.com"],
  //   },
  //   Message: {
  //     Body: {
  //       Text: {
  //         Data: "Hello from JS",
  //       },
  //     },
  //     Subject: {
  //       Data: "Test Mail",
  //     },
  //   },
  // };

  // try {
  //   const result = await ses.sendEmail(params).promise();
  //   console.log(result);
  //   return result;
  // } catch (error) {
  //   console.error(error);
  // }
};

export const handler = sendMail;
