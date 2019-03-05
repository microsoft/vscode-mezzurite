module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'client/**/*.ts',
    'server/**/*.ts'
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [ 'node_modules' ]
};
