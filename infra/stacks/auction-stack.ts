import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";

export class AuctionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const mylambda = new lambda.Function(this, "random-lambda", {
      code: lambda.Code.fromAsset("codes/lambda"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: cdk.Duration.minutes(2),
    });

    const restApi = new apigw.RestApi(this, "Api", {
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });

    const hello = restApi.root.addResource("hello");
    const helloIntegration = new apigw.LambdaIntegration(mylambda);
    hello.addMethod("GET", helloIntegration);

    new cdk.CfnOutput(this, "api_endpoint", {
      value: restApi.url,
    });
  }
}
