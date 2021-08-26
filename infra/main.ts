#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AuctionStack } from "./stacks/auction-stack";
import { getConfig } from "./helper/get-config";

// const filepath = getConfig();
// console.log(filepath);

const app = new cdk.App();
new AuctionStack(app, "AuctionStack", {});
