export const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: [
    '**/spec/**/*.spec.js',
    '**/features/**/*.steps.js'
  ],
  moduleFileExtensions: ['js', 'json'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.spec.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/features/support/hooks.int.js'],
  globals: {
    describe: 'readonly',
    test: 'readonly',
    expect: 'readonly'
  }
};
export default config;
