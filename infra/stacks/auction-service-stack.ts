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
        entry: "codes/lambda/src/createAuction.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.minutes(2),
      }
    );

    const getAuctionsLambda = new nodelambda.NodejsFunction(
      this,
      "get-auctions",
      {
        entry: "codes/lambda/src/getAuctions.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.minutes(2),
      }
    );

    const restApi = new apigw.RestApi(this, "Api", {
      restApiName: `${projectPrefix}-${stackConfig.ApiGateWayName}`,
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });

    const auctionResource = restApi.root.addResource("auction");
    const createAuctionIntegration = new apigw.LambdaIntegration(
      createAuctionLambda
    );
    auctionResource.addMethod("POST", createAuctionIntegration);

    const auctionsResource = restApi.root.addResource("auctions");
    const getAuctionsIntegration = new apigw.LambdaIntegration(
      getAuctionsLambda
    );
    auctionsResource.addMethod("GET", getAuctionsIntegration);

    const auctionsTable = new ddb.Table(this, "AuctionsTable", {
      tableName: `${projectPrefix}-${stackConfig.TableName}`,
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
    getAuctionsLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );
    auctionsTable.grantReadData(getAuctionsLambda);
  }
}
