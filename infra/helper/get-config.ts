import * as fs from "fs";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

// IO
export const getConfig = (): E.Either<string, any> => {
  return pipe(
    E.fromNullable("No Path Exported")(process.env.APP_CONFIG),
    E.map((filepath) => JSON.parse(fs.readFileSync(filepath).toString()))
  );
  //TODO: handler for invalid filepath (no file found...)
};

export const prefix = (config: any) => {
  return `${config.Project.Name}${config.Project.Stage}`;
};
