import { StackName } from "../../config/types/config";
import * as cdk from "@aws-cdk/core";
import * as nodelambda from "@aws-cdk/aws-lambda-nodejs";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as ddb from "@aws-cdk/aws-dynamodb";

import * as base from "../../lib/stack/base-stack";
import { AuctionService } from "../../config/types/config";

export class AuctionServiceStack extends base.BaseStack {
  constructor(
    scope: cdk.Construct,
    projectPrefix: string,
    stackConfig: AuctionService
  ) {
    super(scope, projectPrefix, stackConfig.Name);

    const createAuctionLambda = new nodelambda.NodejsFunction(
      this,
      "create-auction",
      {
        entry: "codes/lambda/createAuction.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.minutes(2),
      }
    );

    const restApi = new apigw.RestApi(this, "Api", {
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });

    const auctionResource = restApi.root.addResource("auction");
    const createAuctionIntegration = new apigw.LambdaIntegration(
      createAuctionLambda
    );
    auctionResource.addMethod("POST", createAuctionIntegration);

    const auctionsTable = new ddb.Table(this, "AuctionsTable", {
      tableName: `${this.projectPrefix}-AuctionsTable`,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    createAuctionLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );
    auctionsTable.grantWriteData(createAuctionLambda);
  }
}
