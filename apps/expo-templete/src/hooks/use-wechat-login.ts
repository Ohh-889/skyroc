import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';

import type { WechatAuthResponse, WechatResult } from '@/modules/wechat';
import {
  consumePendingWechatAuth,
  getWechatInstallUrl,
  isWechatCancelled,
  isWechatInstalled,
  sendWechatAuth,
} from '@/modules/wechat';

/** 前端只拿得到 code，换 token 必须走后端（需要 AppSecret，不能下发到客户端） */
const exchangeToken = async (code: string) => {
  // 换成自己的接口：后端用 code + AppSecret 调
  // https://api.weixin.qq.com/sns/oauth2/access_token，再返回业务 token
  return `wechat:${code}`;
};

export const useWechatLogin = (onSuccess: (token: string) => void) => {
  const [isPending, setIsPending] = useState(false);

  // 冷启动兜底：进程被系统杀掉后从微信返回时，结果先落在原生侧，JS 起来要主动取一次
  useEffect(() => {
    consumePendingWechatAuth().then(async result => {
      if (!result) return;
      await handle(result, onSuccess);
    });
  }, [onSuccess]);

  const login = async () => {
    if (isPending) return;

    if (!(await isWechatInstalled())) {
      // 安装地址由 SDK 给出，比自己写死 weixin.qq.com 可靠
      const installUrl = await getWechatInstallUrl();
      Alert.alert('未安装微信', '请先安装微信客户端后再试', [
        { style: 'cancel', text: '取消' },
        { onPress: () => Linking.openURL(installUrl), text: '去安装' },
      ]);
      return;
    }

    setIsPending(true);
    try {
      const result = await sendWechatAuth({
        scope: 'snsapi_userinfo',
        // 回调时原样带回，用来确认拿到的就是本次请求的结果
        state: `login_${Date.now()}`,
      });
      console.log('wechat login result', result);
      await handle(result, onSuccess);
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, login };
};

/** 统一处理一次授权结果；不 try/catch，因为模块永远不抛 */
const handle = async (
  result: WechatResult<WechatAuthResponse>,
  onSuccess: (token: string) => void,
) => {
  if (!result.ok) {
    // 用户自己点的取消，不用弹窗打扰
    if (!isWechatCancelled(result)) {
      Alert.alert('微信登录失败', `${result.code}\n${result.message}`);
    }
    return;
  }
  if (result.payload.code) {
    onSuccess(await exchangeToken(result.payload.code));
  }
};
