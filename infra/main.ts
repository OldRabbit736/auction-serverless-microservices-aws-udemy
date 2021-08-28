#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AuctionServiceStack } from "./stacks/auction-service-stack";
import { loadConfig } from "../config/util/config-handler";

const { prefix, config } = loadConfig();

const app = new cdk.App();
new AuctionServiceStack(app, prefix, config.Stack.AuctionService);
