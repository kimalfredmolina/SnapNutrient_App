module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest", { configFile: "./babel.config.js" }]
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-web-browser|@expo-google-fonts/.*|react-clone-referenced-element|@react-navigation/.*))"
  ],
  moduleNameMapper: {
    "^../../servers$": "<rootDir>/__mocks__/server.ts",
    "^../servers$": "<rootDir>/__mocks__/server.ts",
    "./servers": "<rootDir>/__mocks__/server.ts"
  },
  testEnvironment: "node",
  globals: {
    "process.env.EXPO_OS": "web"
  }
}
