module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
      '\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
      '\\.(jpg|jpeg|png|gif|svg|woff2?|eot|ttf)$': '<rootDir>/__mocks__/fileMock.js',
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json', isolatedModules: true }],
    },
    testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
    collectCoverageFrom: [
      'src/common/**/*.{ts,tsx}',
      'src/services/**/*.{ts,tsx}',
      '!**/*.d.ts',
      '!**/index.ts',
    ],
    coverageThreshold: {
      global: { branches: 100, functions: 100, lines: 100, statements: 100 },
    },
  };
  