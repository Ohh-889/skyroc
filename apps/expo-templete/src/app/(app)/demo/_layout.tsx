import { Stack } from 'expo-router';

/**
 * 组件与原生能力演示分组。
 *
 * 它是一个真实路径段（/demo/*）而不是路由分组，免得和 (tabs) 一样映射到 `/` 造成歧义； 生产包里可以整个目录删掉，不影响业务路由。
 *
 * 和 (app) 下的其它页面一样不用原生 header，头部由各页自己拼 `modules/DemoHeader`。 转场参数同样要重写一遍——screenOptions 不跨导航器继承。
 */
const DemoLayout = () => {
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

export default DemoLayout;
