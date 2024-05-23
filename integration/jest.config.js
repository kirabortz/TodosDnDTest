module.exports = {
  preset: "jest-puppeteer",
  testRegex: "./*.test.js$",
  setupFilesAfterEnv: ["./setupTests.js"],
  testTimeout: 100000, //
  // transformIgnorePatterns: [
  //   "node_modules/(?!axios)"
  // ]
};
