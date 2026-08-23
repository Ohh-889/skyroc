import { showDialog } from '@skyroc/native-ui';
import { useEffect, useRef, useState } from 'react';

import type { WechatAuthResponse, WechatResult } from '@skyroc/expo-wechat';
import { consumePendingWechatAuth, isWechatCancelled, sendWechatAuth } from '@skyroc/expo-wechat';

/** 前端只拿得到 code，换 token 必须走后端（需要 AppSecret，不能下发到客户端） */
const exchangeToken = async (code: string): Promise<Api.Auth.LoginToken> => {
  // 换成自己的接口：后端用 code + AppSecret 调
  // https://api.weixin.qq.com/sns/oauth2/access_token，再返回业务凭据。
  // 真实写法就是 service/api/auth/api.ts 里那样的一行 request()
  return { refreshToken: 'demo-refresh-token', token: `wechat:${code}` };
};

/**
 * 本次请求的标记，微信会原样回传，用来确认拿到的就是这次的结果。
 *
 * 只用于对上号，不是安全凭证——真正的防重放在后端用 code 换 token 时做。
 */
const createState = () => `login_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

/**
 * 统一处理一次授权结果。
 *
 * 自己吞掉所有异常：两个调用点（点击、冷启动）都拿不住 promise， 抛出去就是一条 unhandled rejection + 用户看不到任何提示。
 */
const handleAuthResult = async (
  result: WechatResult<WechatAuthResponse>,
  onSuccess: (tokens: Api.Auth.LoginToken) => void
) => {
  if (!result.ok) {
    // 用户自己点的取消，不用弹窗打扰
    if (!isWechatCancelled(result)) {
      showDialog({ message: result.message, title: '微信登录失败' });
    }
    return;
  }

  // 微信说成功却没给票据，换不了 token，不能就这么静默结束
  if (!result.payload.code) {
    showDialog({ message: '微信没有返回授权码，请重试', title: '微信登录失败' });
    return;
  }

  try {
    onSuccess(await exchangeToken(result.payload.code));
  } catch (error) {
    console.warn('[useWechatLogin] 换取业务 token 失败', error);
    showDialog({ message: '登录失败，请稍后重试', title: '微信登录失败' });
  }
};

export const useWechatLogin = (onSuccess: (tokens: Api.Auth.LoginToken) => void) => {
  const [isPending, setIsPending] = useState(false);

  // 重入锁用 ref 不用 state：同一帧内连点两次都会读到旧的 isPending
  const isPendingRef = useRef(false);

  // 冷启动兜底：进程被系统杀掉后从微信返回时，结果先落在原生侧，JS 起来要主动取一次
  useEffect(() => {
    let active = true;

    const consume = async () => {
      const pending = await consumePendingWechatAuth();

      if (!pending) return;

      // 这条路径同样要走一次网络换 token，不给反馈用户会以为 App 卡住了
      if (active) setIsPending(true);
      try {
        await handleAuthResult(pending, onSuccess);
      } finally {
        if (active) setIsPending(false);
      }
    };

    consume().catch(error => {
      console.warn('[useWechatLogin] 读取冷启动授权结果失败', error);
    });

    return () => {
      active = false;
    };
  }, []);

  const login = async () => {
    if (isPendingRef.current) return;

    isPendingRef.current = true;

    setIsPending(true);

    try {
      const state = createState();

      const result = await sendWechatAuth({ scope: 'snsapi_userinfo', state });

      // 对不上号说明这是别的请求留下的结果，直接丢弃
      if (result.ok && result.payload.state !== state) return;

      await handleAuthResult(result, onSuccess);
    } finally {
      isPendingRef.current = false;

      setIsPending(false);
    }
  };

  return { isPending, login };
};
