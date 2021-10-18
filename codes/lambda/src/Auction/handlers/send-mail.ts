import AWS from "aws-sdk";
import { SendEmailRequest } from "aws-sdk/clients/ses";

const ses = new AWS.SES({ region: "ap-northeast-2" });

const sendMail = async (event: any) => {
  const params: SendEmailRequest = {
    Source: "sylvan0212@gmail.com",
    Destination: {
      ToAddresses: ["sylvan0212@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Data: "Hello from JS",
        },
      },
      Subject: {
        Data: "Test Mail",
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const handler = sendMail;
