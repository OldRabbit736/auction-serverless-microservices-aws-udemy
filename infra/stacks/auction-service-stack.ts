import { StackName } from "../../config/types/config";
import * as cdk from "@aws-cdk/core";
import * as nodelambda from "@aws-cdk/aws-lambda-nodejs";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as event from "@aws-cdk/aws-events";
import * as eventTargets from "@aws-cdk/aws-events-targets";
import * as cognito from "@aws-cdk/aws-cognito";

import * as base from "../../lib/stack/base-stack";
import { AuctionService } from "../../config/types/config";

export class AuctionServiceStack extends base.BaseStack {
  constructor(
    scope: cdk.Construct,
    projectPrefix: string,
    stackConfig: AuctionService
  ) {
    super(scope, projectPrefix, stackConfig.Name);

    const auctionsTable = new ddb.Table(this, "AuctionsTable", {
      tableName: `${projectPrefix}-${stackConfig.TableName}`,
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    auctionsTable.addGlobalSecondaryIndex({
      partitionKey: {
        name: "status",
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: "endingAt",
        type: ddb.AttributeType.STRING,
      },
      projectionType: ddb.ProjectionType.ALL,
      indexName: "statusAndEndDate",
    });

    /************* Lambda *************/
    const createAuctionLambda = new nodelambda.NodejsFunction(
      this,
      "create-auction",
      {
        entry: "codes/lambda/src/Auction/create-auction/entrypoint.http.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.minutes(2),
      }
    );

    createAuctionLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );
    auctionsTable.grantWriteData(createAuctionLambda);

    const getAuctionsLambda = new nodelambda.NodejsFunction(
      this,
      "get-auctions",
      {
        entry: "codes/lambda/src/Auction/get-auctions/entrypoint.http.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.minutes(2),
      }
    );

    getAuctionsLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );
    auctionsTable.grantReadData(getAuctionsLambda);

    const getAuctionLambda = new nodelambda.NodejsFunction(
      this,
      "get-auction",
      {
        entry: "codes/lambda/src/Auction/get-auction-by-id/entrypoint.http.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.minutes(2),
      }
    );

    getAuctionLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );
    auctionsTable.grantReadData(getAuctionLambda);

    const placeBidLambda = new nodelambda.NodejsFunction(this, "place-bid", {
      entry: "codes/lambda/src/Auction/place-bid/entrypoint.http.ts",
      handler: "handler",
      memorySize: 128,
      timeout: cdk.Duration.minutes(2),
    });

    placeBidLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );
    auctionsTable.grantReadWriteData(placeBidLambda);

    const processAuctionsLambda = new nodelambda.NodejsFunction(
      this,
      "process-auctions",
      {
        entry: "codes/lambda/src/Auction/process-auctions/entrypoint.http.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.minutes(2),
      }
    );

    processAuctionsLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );
    auctionsTable.grantReadWriteData(processAuctionsLambda);

    // const rule = new event.Rule(this, "ScheduleRule", {
    //   schedule: event.Schedule.rate(cdk.Duration.minutes(1)),
    // });

    // rule.addTarget(new eventTargets.LambdaFunction(processAuctionsLambda));

    /************* Cognito *************/
    const userPool = new cognito.UserPool(this, "AuctionUserPool", {
      signInAliases: {
        username: true,
        email: true,
      },
      // standardAttributes: {
      //   email: {
      //     required: true,
      //     mutable: true,
      //   },
      //   fullname: {
      //     required: true,
      //     mutable: true,
      //   },
      // },
    });
    const client = userPool.addClient("test-client", {
      authFlows: {
        // userPassword: true,
        userSrp: true,
      },
      preventUserExistenceErrors: true,
    });

    /************* REST API *************/
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
  }
}
