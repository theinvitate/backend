module.exports = {
  preset: 'ts-jest',
  roots: [
    "./tests"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/"
  ],
  collectCoverage: true,
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testEnvironmentVariables: {
    DATABASE_URL: 'postgresql://testtest:example@localhost:5432/theinvitate?schema=public'
  }
};
