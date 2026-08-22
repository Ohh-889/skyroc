import { Stack } from 'expo-router';

// 深链直接落到二级页时，把 (tabs) 垫在返回栈底，避免用户退无可退
// oxlint-disable-next-line react/only-export-components -- expo-router 约定的路由配置导出
export const unstable_settings = {
  anchor: '(tabs)'
};

/**
 * 登录后的导航容器。
 *
 * 二级页与 (tabs) 平级：push 时整页盖住 tab bar，这是移动端详情/编辑流程的默认形态。 只有必须保留 tab 上下文的流程才在对应 tab 目录里再套一层 Stack。
 *
 * ScreenOptions 不会跨导航器继承，根 _layout 上那份管不到这里，所以转场参数要在本文件重写一遍， 否则 (app) 内部的 push 会退回平台默认动画，和从根栈进来的第一屏对不上。
 *
 * 全组关掉原生 header，头部由页面自己拼（`NavBar`）。原生 header 的高度、背景和安全区都由系统算， 业务要的沉浸式背景、渐变、搜索框、右侧多按钮全嵌不进去；一旦一半页面自定义、一半用原生，
 * 两套头部在高度和返回手势上永远对不齐。索性统一交给页面，`options.title` 也就不用再写了。
 */
const AppLayout = () => {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        animationMatchesGesture: true,
        contentStyle: { flex: 1 },
        headerShown: false
      }}
    />
  );
};

export default AppLayout;
