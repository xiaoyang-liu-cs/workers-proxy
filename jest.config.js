module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.ts',
  ],
};
