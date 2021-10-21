import { StackName } from "../../config/types/config";
import * as cdk from "@aws-cdk/core";
import * as nodelambda from "@aws-cdk/aws-lambda-nodejs";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as event from "@aws-cdk/aws-events";
import * as eventTargets from "@aws-cdk/aws-events-targets";
import * as cognito from "@aws-cdk/aws-cognito";
import { AuthorizationType } from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
import * as sqs from "@aws-cdk/aws-sqs";
import * as s3 from "@aws-cdk/aws-s3";

import * as base from "../../lib/stack/base-stack";
import { AuctionService } from "../../config/types/config";
import { SqsEventSource } from "@aws-cdk/aws-lambda-event-sources";
import { CfnOutput } from "@aws-cdk/core";

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
    const auctionAuthorizer = new apigw.CognitoUserPoolsAuthorizer(
      this,
      "AuctionAuthorizer",
      {
        cognitoUserPools: [userPool],
      }
    );

    const restApi = new apigw.RestApi(this, "Api", {
      restApiName: `${projectPrefix}-${stackConfig.ApiGateWayName}`,
      endpointTypes: [apigw.EndpointType.REGIONAL],
    });

    // POST auction
    const auctionResource = restApi.root.addResource("auction");
    const createAuctionIntegration = new apigw.LambdaIntegration(
      createAuctionLambda
    );
    auctionResource.addMethod("POST", createAuctionIntegration, {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: auctionAuthorizer,
    });

    // GET auctions
    const auctionsResource = restApi.root.addResource("auctions");
    const getAuctionsIntegration = new apigw.LambdaIntegration(
      getAuctionsLambda
    );
    auctionsResource.addMethod("GET", getAuctionsIntegration, {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: auctionAuthorizer,
    });

    // GET auction/{id}
    const auctionIdResource = auctionResource.addResource("{id}");
    const getAuctionIntegration = new apigw.LambdaIntegration(getAuctionLambda);
    auctionIdResource.addMethod("GET", getAuctionIntegration, {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: auctionAuthorizer,
    });

    // PATCH auction/{id}/bid
    const bidResource = auctionIdResource.addResource("bid");
    const placeBidIntegration = new apigw.LambdaIntegration(placeBidLambda);
    bidResource.addMethod("PATCH", placeBidIntegration, {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: auctionAuthorizer,
    });

    /************* Mail Lambda, Queue *************/
    const mailerLambda = new nodelambda.NodejsFunction(this, "send-mail", {
      entry: "codes/lambda/src/Auction/handlers/send-mail.ts",
      handler: "handler",
      memorySize: 128,
      timeout: cdk.Duration.seconds(30),
    });

    mailerLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ses:SendEmail"],
        resources: [
          `arn:aws:ses:ap-northeast-2:${
            cdk.Stack.of(this).account
          }:identity/sylvan0212@gmail.com`,
        ],
      })
    );

    const mailQueue = new sqs.Queue(this, "mailQueue", {
      visibilityTimeout: cdk.Duration.seconds(30),
    });

    mailerLambda.addEventSource(
      new SqsEventSource(mailQueue, { batchSize: 1 })
    );

    processAuctionsLambda.addEnvironment("MAIL_QUEUE_URL", mailQueue.queueUrl);
    mailQueue.grantSendMessages(processAuctionsLambda);

    /************* S3 *************/
    const uploadAuctionPictureLambda = new nodelambda.NodejsFunction(
      this,
      "upload-auction-picture",
      {
        entry:
          "codes/lambda/src/Auction/upload-auction-picture/entrypoint.http.ts",
        handler: "handler",
        memorySize: 128,
        timeout: cdk.Duration.minutes(2),
      }
    );
    auctionsTable.grantReadData(uploadAuctionPictureLambda);

    // PATCH auction/{id}/picture
    const pictureResource = auctionIdResource.addResource("picture");
    const uploadAuctionPictureIntegration = new apigw.LambdaIntegration(
      uploadAuctionPictureLambda
    );
    pictureResource.addMethod("PATCH", uploadAuctionPictureIntegration, {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: auctionAuthorizer,
    });

    const pictureBucket = new s3.Bucket(this, "auction-bucket-ra3pb2xoj2", {
      lifecycleRules: [
        {
          id: "ExpirePictures",
          expiration: cdk.Duration.days(1),
          enabled: true,
        },
      ],
      publicReadAccess: true,
    });
    pictureBucket.grantWrite(uploadAuctionPictureLambda);

    uploadAuctionPictureLambda.addEnvironment(
      "AUCTIONS_BUCKET_NAME",
      pictureBucket.bucketName
    );
    uploadAuctionPictureLambda.addEnvironment(
      "AUCTIONS_TABLE_NAME",
      auctionsTable.tableName
    );

    /************* Outputs *************/
    new CfnOutput(this, "MailQueueUrl", {
      value: mailQueue.queueUrl,
    });
    new CfnOutput(this, "MailQueueArn", {
      value: mailQueue.queueArn,
    });
  }
}
