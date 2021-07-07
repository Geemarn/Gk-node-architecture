module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: "((\\.|/*.)(spec))\\.ts?$",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  setupFilesAfterEnv: ['./jest.setup.js']
};
