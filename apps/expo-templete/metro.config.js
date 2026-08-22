const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro"); // make sure this import exists

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 不支持 web 端：限制平台解析，避免误加的 *.web.tsx 被打进包
config.resolver.platforms = ['ios', 'android', 'native'];

// Apply uniwind modifications before exporting
const uniwindConfig = withUniwindConfig(config, {
  // relative path to your global.css file
  cssEntryFile: "./src/global.css",
  // optional: path to typings
  dtsFile: "./types/uniwind-types.d.ts",
});

module.exports = uniwindConfig;
