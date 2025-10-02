module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { 
        jsxImportSource: "nativewind",
        platform: process.env.EXPO_OS || 'web' // Add this line
      }],
      "nativewind/babel",
    ],
    plugins: [
      'react-native-worklets/plugin',
    ],
  };
};