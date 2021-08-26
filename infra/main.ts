#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AuctionStack } from "./stacks/auction-stack";

const app = new cdk.App();
new AuctionStack(app, "AuctionStack", {});
