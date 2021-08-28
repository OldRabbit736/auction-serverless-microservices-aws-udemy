import * as cdk from "@aws-cdk/core";
import { StackName } from "../../config/types/config";

export class BaseStack extends cdk.Stack {
  protected projectPrefix: string;

  constructor(scope: cdk.Construct, projectPrefix: string, id: string) {
    super(scope, BaseStack.createStackName(projectPrefix, id));

    this.projectPrefix = projectPrefix;
  }

  private static createStackName(projectPrefix: string, id: string) {
    return `${projectPrefix}-${id}`;
  }
}
