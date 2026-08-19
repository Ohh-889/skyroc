import { createMDX } from 'fumadocs-mdx/next';
import { withUniwind } from 'uniwind-turbo-plugin-next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 这里必须列全 @skyroc/native-ui 会拉到的整套 RN 依赖，原因有三条，缺一条都会炸：
  //
  // 1. node_modules 默认按外部模块处理、不做 JSX / TS 转换。@rn-primitives/slot 的 dist/index.mjs
  //    直接发了未编译的 JSX（`return <>` 原样进 chunk，报 "Unexpected token '<'"）；SDK 57 起
  //    expo / expo-image / expo-haptics / expo-modules-core 的 package.json main 直接指向
  //    src/*.ts，未列进来就是 "Unknown module type"。
  // 2. 下面的 resolveExtensions（.web.* 优先）只对「非 foreign」代码生效，而 Turbopack 判定
  //    foreign 的依据正是「不在 transpilePackages 里的 node_modules」。列进来才会解析到
  //    react-native-gesture-handler/lib/module/**/*.web.js、@shopify/react-native-skia 的
  //    Skia.web.js 等 web 实现，否则走原生实现，撞上 react-native-web 没有的 TurboModuleRegistry /
  //    DrawerLayoutAndroid，或者 Module not found: '../specs/RNGestureHandlerButtonNativeComponent'。
  // 3. 走不到 .web.* 的原生实现会 import react-native/Libraries/** 深路径，那是 Flow 源码
  //    （`import type {ColorValue} from ...`），Turbopack 用 TS 语法解析，直接 "Expected ',', got '{'"。
  //    withUniwind 的 react-native 别名只覆盖裸 'react-native'，管不到深路径。
  //
  // 新增 RN 依赖（对齐 packages/native/ui 的 peerDependencies 与 playground 的 dependencies）时同步补这里。
  transpilePackages: [
    '@rn-primitives/slot',
    '@gorhom/bottom-sheet',
    '@shopify/react-native-skia',
    'expo',
    'expo-haptics',
    'expo-image',
    'expo-modules-core',
    // react-native-modal 的传递依赖，同样直接发未编译 JSX
    'react-native-animatable',
    'react-native-confirmation-code-field',
    'react-native-gesture-handler',
    'react-native-modal',
    'react-native-pager-view',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-ui-datepicker',
    'react-native-worklets'
  ],
  turbopack: {
    resolveAlias: {
      // @expo/vector-icons 整条依赖链（expo-font → expo-modules-core）在 web 上跑不通，
      // 换成本地 lucide-react 替身。详见 lib/expo-vector-icons.tsx 顶部注释。
      // withUniwind 会先展开这里再补自己的 react-native 别名，两者不冲突。
      // 六个字体集入口要列全：漏掉任意一个都会把真包（含未编译 JSX 的 createIconSet.js）拖回来。
      // expo-router 同理：真包会拖进 react-native-screens 整条原生导航栈（Flow 源码 +
      // TurboModuleRegistry + web 上没发出来的子模块）。文档站要渲染 playground 的整页
      // 组件页（app/components/*.tsx），只用到 Stack 与 useRouter().back()，换成本地
      // no-op 替身即可。详见 lib/expo-router.tsx 顶部注释。
      'expo-router': './lib/expo-router.tsx',
      '@expo/vector-icons/AntDesign': './lib/expo-vector-icons.tsx',
      '@expo/vector-icons/Feather': './lib/expo-vector-icons.tsx',
      '@expo/vector-icons/FontAwesome': './lib/expo-vector-icons.tsx',
      '@expo/vector-icons/Ionicons': './lib/expo-vector-icons.tsx',
      '@expo/vector-icons/MaterialIcons': './lib/expo-vector-icons.tsx',
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
