import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";

export class AuctionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new lambda.Function(this, "random-lambda", {
      code: lambda.Code.fromAsset("codes/lambda"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: cdk.Duration.minutes(2),
    });
  }
}
