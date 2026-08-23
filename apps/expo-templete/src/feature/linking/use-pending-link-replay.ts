import { router, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';

import { useSession } from '@/feature/auth';

import { consumePendingLink } from './pending-link';

/**
 * 登录完成后重放被拦下的深链。挂在根 `_layout` 里，全 App 只需要一处。
 *
 * 之所以不写在三个登录出口（密码登录 / 验证码 / 微信）里：那三处只调 `signIn`，
 * 页面切换是 `Stack.Protected` 的守卫在做，它们根本不知道自己「跳」到了哪。
 * 把重放挂在「isLoggedIn 变 true」这个事实上，新增登录方式时不用再记得补一遍。
 *
 * 用 push 不用 replace：此时登录页已经被守卫从栈里摘掉，(app) 组按 `unstable_settings.anchor`
 * 以 (tabs) 打底，push 上去的详情页返回时正好回到首页。
 */
export function usePendingLinkReplay() {
  const { isLoggedIn } = useSession();

  const rootState = useRootNavigationState();

  useEffect(() => {
    // 导航器还没挂载时调 router 会被静默丢掉，冷启动必须等这个 key
    if (!isLoggedIn || !rootState?.key) return;

    const href = consumePendingLink();

    if (href) router.push(href);
  }, [isLoggedIn, rootState?.key]);
}
