// const { defaults } = require('jest-config');
module.exports = {
  coverageReporters: ['html', 'text-summary'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testEnvironment: 'node',
};
