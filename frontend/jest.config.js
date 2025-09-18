module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.ts",
  ],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest", // use babel-jest for js/ts/tsx
    "^.+\\.mjs$": "babel-jest", // <── transform ESM .mjs files
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|react-native-.*|@react-navigation/.*|@expo/.*|expo-.*|expo|expo-router|react-native-worklets|firebase|@firebase)/)"
  ],
};
