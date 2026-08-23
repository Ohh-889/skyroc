const path = require("node:path");

const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro"); // make sure this import exists

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 不支持 web 端：限制平台解析，避免误加的 *.web.tsx 被打进包
config.resolver.platforms = ['ios', 'android', 'native'];

// 这些库把状态挂在模块作用域上（jotai 的 store 和 React context），装出第二份就等于多一套
// 互相看不见的全局状态：<JotaiProvider> 提供的 store 对另一份的 useAtomValue 完全不可见。
// pnpm 的 peer 解析一分叉就会给 app 和 workspace 包各装一份（jotai@2.18.0 现在就有三份），
// 所以这里统一钉到 app 自己依赖的那一份 —— web 端在 admin-vite 里用 resolve.dedupe 解决的是同一个问题。
const SINGLETONS = ['jotai'];

const singletonRoots = new Map(
  SINGLETONS.map(name => [name, path.dirname(require.resolve(`${name}/package.json`, { paths: [__dirname] }))])
);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const [name, root] of singletonRoots) {
    if (moduleName === name || moduleName.startsWith(`${name}/`)) {
      // 子路径也要一起钉：jotai/utils 的 RESET 是个模块级 symbol，两份各有各的，
      // 拿 A 份的 RESET 去写 B 份的 atom，判等不成立，RESET 会被当成普通值存进去
      return context.resolveRequest(context, root + moduleName.slice(name.length), platform);
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

// Apply uniwind modifications before exporting
const uniwindConfig = withUniwindConfig(config, {
  // relative path to your global.css file
  cssEntryFile: "./src/global.css",
  // optional: path to typings
  dtsFile: "./types/uniwind-types.d.ts",
});

module.exports = uniwindConfig;
