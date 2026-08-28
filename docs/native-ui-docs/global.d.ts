/// <reference types="uniwind/types" />

/**
 * Uniwind 用 `declare module 'react-native'` 把 className 增强到各组件 props 上。
 *
 * @skyroc/native-ui 的 main 指向 src 而非 dist，TS 会顺着 import 直接类型检查它的源码，
 * 但那个包自己的 uniwind-env.d.ts 不在本项目的 include 范围内，所以这里必须再引一次，
 * 否则 next build 会在 "Property 'className' does not exist on type ViewProps" 上失败。
 */
declare module 'uniwind' {
  export interface UniwindConfig {
    themes: readonly ['light', 'dark'];
  }
}

export {};
