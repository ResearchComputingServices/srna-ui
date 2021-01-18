module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/index.js',
    ],
    testMatch: [
        '**/__tests__/**/*.(js|ts|tsx)',
        '**/?(*.)+(spec|test).(js|ts|tsx)',
    ],
};
