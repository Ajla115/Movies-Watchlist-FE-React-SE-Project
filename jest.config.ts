import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
    },
    transformIgnorePatterns: [
        "node_modules/(?!(axios|@mui|@tanstack|react-query)/)",
    ],
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
    testMatch: ['**/__tests__/**/*.(spec|test).ts?(x)'],
}; module.exports = {
    testEnvironment: "jsdom",
};

export default config;
export { }; 