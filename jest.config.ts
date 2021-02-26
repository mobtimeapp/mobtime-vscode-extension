module.exports = {
  "globals": {
    "ts-jest": {
      "tsconfig": "./src/app/tsconfig.json"
    }
  },
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};