import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import { createMDX } from 'fumadocs-mdx/next';
import { withUniwind } from 'uniwind-turbo-plugin-next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 必须关掉：react-native-web 的 Modal 不是 StrictMode 安全的。它的 ModalPortal 在 render 阶段
  // document.createElement 出容器节点、却在 effect 的 cleanup 里把它移除并把 ref 置空
  // （dist/exports/Modal/ModalPortal.js）。dev 下 StrictMode 会 mount → unmount → remount 一遍 effect，
  // 容器就此被摘掉，而重建只发生在 render 阶段，除非组件再渲染一次，否则永远回不来。
  // 于是「挂载时就可见」的 Modal（showDialog 这类命令式弹窗，第一次渲染 show 就是 true）
  // 在预览里完全不显示；而声明式 <Dialog show={false} /> 因为后续 show 变化触发了重渲染，反而正常。
  // 生产构建不受影响（StrictMode 不会重复执行 effect），这里只影响 dev 预览。
  reactStrictMode: false,
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
      '*.ttf': { type: 'asset' },
      // CanvasKit（Skia 的 web 运行时）整套都按 asset 走，只取 URL，不进模块图：
      // canvaskit.js 是 emscripten 胶水层，里面有 node 分支（require('fs')），
      // 打包器静态解析时必然报 Module not found；而 canvaskit.wasm 也不需要 wasm
      // 模块实例化，它由 canvaskit.js 自己 fetch。详见 lib/skia-web.ts
      '*.wasm': { type: 'asset' },
      '**/canvaskit-wasm/bin/full/canvaskit.js': { type: 'asset' }
    }
  }
};

// 让 next dev 也能拿到 Cloudflare 的 env / bindings（R2 增量缓存等），生产构建走 opennextjs-cloudflare build。
initOpenNextCloudflareForDev();

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
