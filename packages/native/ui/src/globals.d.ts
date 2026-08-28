/**
 * Metro 在运行时注入的开发标记。
 *
 * React-native 自带的类型声明里既没有 **DEV** 也没有 process，而本包 tsconfig 的 types 只挂了 react-native，所以在这里补一次全局声明——避免为了一个环境判断把整套
 *
 * @types/node 拉进 RN 组件库。
 *
 * 本文件不能出现顶层 import / export，否则会变成模块，declare const 也就不再是全局声明。
 */
declare const __DEV__: boolean;
