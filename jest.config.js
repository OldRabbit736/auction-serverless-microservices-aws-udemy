module.exports = {
  testEnvironment: "node",
  // roots: ["<rootDir>/test"],
  roots: ["<rootDir>/codes/lambda/test"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
