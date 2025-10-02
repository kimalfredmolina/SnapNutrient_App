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
    "node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-web-browser|@expo-google-fonts/.*|react-clone-referenced-element|@react-navigation/.*))"
  ],
};
