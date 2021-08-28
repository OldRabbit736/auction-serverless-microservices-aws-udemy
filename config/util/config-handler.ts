import { Config } from "../types/config";
import devConfig from "../app-config-dev";
import prodConfig from "../app-config-prod";

type Stage = "dev" | "prod";

// IO
const getStage = () => {
  const stage = process.env.STAGE as Stage;
  if (stage !== "dev" && stage !== "prod") {
    throw new Error("STAGE environment must be dev | prod");
  }
  return stage;
};

const getConfig = (stage: Stage): Config => {
  switch (stage) {
    case "dev":
      return devConfig;

    case "prod":
      return prodConfig;
  }
};

export const loadConfig = () => {
  const stage = getStage();
  const config = getConfig(stage);

  return {
    prefix: prefix(config),
    config,
  };
};

const prefix = (config: Config) =>
  `${config.Project.Name}${config.Project.Stage}`;

// // IO
// const getConfig = (): any => {
//   const configpath = process.env.APP_CONFIG;

//   if (!configpath) {
//     throw new Error("APP_CONFIG not exported!");
//   }

//   return JSON.parse(fs.readFileSync(configpath).toString());

//   // return pipe(
//   //   E.fromNullable("No Path Exported")(process.env.APP_CONFIG),
//   //   E.map((filepath) => JSON.parse(fs.readFileSync(filepath).toString()))
//   // );
//   // //TODO: handler for invalid filepath (no file found...)
// };

// export const getPrefix = () => {
//   const config = getConfig();

//   return `${config.Project.Name}${config.Project.Stage}`;
// };

// export const printConfig = () => {
//   const configpath = process.env.APP_CONFIG;

//   if (!configpath) {
//     throw new Error("APP_CONFIG not exported!");
//   }

//   console.log(fs.readFileSync(configpath).toString());
// };
