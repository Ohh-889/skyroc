import process from 'node:process';

import { defineConfig } from '@skyroc/web-admin-vite';
import { loadEnv } from 'vite';

export default defineConfig(configEnv => {
  const env = loadEnv(configEnv?.mode ?? 'test', process.cwd());

  // 实时推送的两个端点挂在 /resource 下，不在 VITE_SERVICE_BASE_URL 的 /api/v1 前缀里，
  // 走不了自动生成的 /proxy-default，只能单独挂一条。
  //
  // 不挂的话浏览器要跨源直连后端，那时 SSE 必须靠后端回 CORS 头才连得上（WebSocket 无所谓，
  // 握手不受同源策略约束）—— 症状是同一个页面 WS 正常、SSE 静默连不上，后端日志里什么都
  // 看不出来。走代理之后是同源请求，浏览器连 Origin 都不发，这一层问题不存在。
  const realtimeTarget = env.VITE_SERVICE_BASE_URL ? new URL(env.VITE_SERVICE_BASE_URL).origin : '';

  return {
    application: {
      css: {
        additionalData: '@use "@/styles/scss/global.scss" as *;'
      }
    },
    vite: realtimeTarget
      ? {
          server: {
            proxy: {
              '/resource': {
                changeOrigin: true,
                target: realtimeTarget,
                // WebSocket 目前用的是绝对 ws:// 地址，没走这里；开着是为了以后改成相对
                // 路径时不用再回来动这个文件。
                ws: true
              }
            }
          }
        }
      : {}
  };
});
