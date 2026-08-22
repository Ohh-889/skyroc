import { Stack } from 'expo-router';

// (auth) 分组下没有 index 路由，进入分组时默认落在账号密码登录页
// oxlint-disable-next-line react/only-export-components -- expo-router 约定的路由配置导出
export const unstable_settings = {
  anchor: 'login'
};

// 页面各自套 AuthShell 决定自己的排版，这里只负责栈式导航（验证码页需要能返回上一步）
const AuthLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
