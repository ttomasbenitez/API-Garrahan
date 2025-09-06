export const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: [
    '**/spec/**/*.spec.js',
  ],
  moduleFileExtensions: ['js', 'json'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.spec.js'
  ],
  globals: {
    describe: 'readonly',
    test: 'readonly',
    expect: 'readonly'
  }
};
export default config;
