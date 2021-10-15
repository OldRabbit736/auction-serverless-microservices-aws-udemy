import Amplify, { Auth } from "aws-amplify";
import { config } from "./config";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.APP_CLIENT_ID,
    authenticationiFlowType: "USER_PASSWORD_AUTH",
  },
});

const signInAndPrint = async (username: string, password: string) => {
  const result = await Auth.signIn(username, password);
  console.log(result);
};

signInAndPrint(config.TEST_USER_NAME, config.TEST_USER_PASSWORD);
