/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/__test__/singleton.ts"],
  moduleNameMapper: {"^src/(.*)$": "<rootDir>/src/$1", "^~/(.*)$": "<rootDir>/src/$1"},
};