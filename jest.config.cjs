// jest.config.cjs
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

    transform: {
        // Use ts-jest for .ts and .tsx files
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            // Point ts-jest to our new, test-specific tsconfig file
            tsconfig: 'tsconfig.test.json'
        }],
    },

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};