module.exports = {
    roots: [
        '<rootDir>/src',
    ],
    transform: { '^.+\\.tsx?$': 'ts-jest' },
    setupFilesAfterEnv: [
        '<rootDir>/src/setupTests.js',
    ],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js?$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
};
