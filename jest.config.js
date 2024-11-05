module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["vue", "js", "jsx", "ts", "tsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Handle CSS imports
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  setupFiles: ["<rootDir>/src/__tests__/setup.ts"],
};
