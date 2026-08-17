import { createMDX } from 'fumadocs-mdx/next';
import { withUniwind } from 'uniwind-turbo-plugin-next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @rn-primitives/slot 的 dist/index.mjs 里直接发了未编译的 JSX。node_modules 默认按外部模块处理、
  // 不做 JSX 转换，漏掉它会让 `return <>` 原样进 chunk，报 "Unexpected token '<'"。
  transpilePackages: ['@rn-primitives/slot'],
  turbopack: {
    resolveAlias: {
      // @expo/vector-icons 整条依赖链（expo-font → expo-modules-core）在 web 上跑不通，
      // 换成本地 lucide-react 替身。详见 lib/expo-vector-icons.tsx 顶部注释。
      // withUniwind 会先展开这里再补自己的 react-native 别名，两者不冲突。
      '@expo/vector-icons/AntDesign': './lib/expo-vector-icons.tsx',
      '@expo/vector-icons/Feather': './lib/expo-vector-icons.tsx',
      '@expo/vector-icons/Octicons': './lib/expo-vector-icons.tsx'
    },
    // 对应 @expo/next-adapter 里的 resolve.extensions：Expo 生态用 .web.* 后缀存放 web 实现
    // （如 expo-font/build/ExpoFontLoader.web.js、expo-modules-core/src/requireNativeModule.web.ts）。
    // 不加这条会解析到原生实现，进而 import 到 react-native-web 没有的 TurboModuleRegistry。
    // 注意：Turbopack 这里是整体替换而非前置追加，所以默认列表必须原样抄全。
    resolveExtensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.web.mjs',
      '.mdx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json'
    ],
    rules: {
      // RN 生态里字体是 asset，Metro 默认支持，Turbopack 需要显式声明模块类型。
      '*.ttf': { type: 'asset' }
    }
  }
};

// withUniwind 是 async：它在 config 阶段要先 buildCSS / buildDtsFile，必须 await 后再交给 withMDX。
// 否则 createMDX 展开的是一个 Promise，uniwind 的 resolveAlias 与 loaders 会被静默丢弃，
// react-native 源码会被当普通 JS 解析，撞上 Flow 语法直接报错。
export default withMDX(
  await withUniwind(nextConfig, {
    // 指向专用入口而非 global.css：uniwind 遍历 @import 图时会把 fumadocs preset 里
    // @plugin 引用的 JS 模块当成 CSS 解析并崩溃。详见 app/uniwind.css 顶部注释。
    cssEntryFile: './app/globals.css'
  })
);
