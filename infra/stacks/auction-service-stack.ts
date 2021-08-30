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

    const getAuctionLambda = new nodelambda.NodejsFunction(
      this,
      "get-auction",
      {
        entry: "codes/lambda/src/getAuction.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.minutes(2),
      }
    );

    const placeBidLambda = new nodelambda.NodejsFunction(this, "place-bid", {
      entry: "codes/lambda/src/placeBid.ts",
      handler: "handler",
      memorySize: 128,
      timeout: cdk.Duration.minutes(2),
    });

    const restApi = new apigw.RestApi(this, "Api", {
      restApiName: `${projectPrefix}-${stackConfig.ApiGateWayName}`,
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });

    // POST auction
    const auctionResource = restApi.root.addResource("auction");
    const createAuctionIntegration = new apigw.LambdaIntegration(
      createAuctionLambda
    );
    auctionResource.addMethod("POST", createAuctionIntegration);

    // GET auctions
    const auctionsResource = restApi.root.addResource("auctions");
    const getAuctionsIntegration = new apigw.LambdaIntegration(
      getAuctionsLambda
    );
    auctionsResource.addMethod("GET", getAuctionsIntegration);

    // GET auction/{id}
    const auctionIdResource = auctionResource.addResource("{id}");
    const getAuctionIntegration = new apigw.LambdaIntegration(getAuctionLambda);
    auctionIdResource.addMethod("GET", getAuctionIntegration);

    // PATCH auction/{id}/bid
    const bidResource = auctionIdResource.addResource("bid");
    const placeBidIntegration = new apigw.LambdaIntegration(placeBidLambda);
    bidResource.addMethod("PATCH", placeBidIntegration);

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

    getAuctionLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );
    auctionsTable.grantReadData(getAuctionLambda);

    placeBidLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );
    auctionsTable.grantWriteData(placeBidLambda);
  }
}
