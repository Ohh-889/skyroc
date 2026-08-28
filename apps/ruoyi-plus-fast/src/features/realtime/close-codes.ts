/**
 * WebSocket 关闭码。
 *
 * 分两组是因为归属不同：一组由后端定义、客户端只读，一组是客户端自己关自己时用的。 关闭帧双向可见，两组共用 4000-4999 这个应用私有段，加码前先看另一组占了什么。
 */

/** 服务端发来的关闭码，与后端 app/infra/realtime/constants.py 逐字对齐，改要两个仓库一起发版。 */
export const ServerCloseCode = {
  /** 这次登录已经结束（登出、封禁、会话失效），拿同一张凭据重连没有意义。 */
  POLICY_VIOLATION: 1008,
  /** 令牌过期或被续签换掉了，但登录还活着，换新令牌重连即可。 */
  TOKEN_STALE: 4001
} as const;

/** 客户端主动关闭时用的码，号段与后端协商，不要和 ServerCloseCode 撞。 */
export const ClientCloseCode = {
  /** 用户退出或组件卸载。 */
  NORMAL: 1000,
  /** 心跳没等到响应，连接多半已经半开。 */
  HEARTBEAT_TIMEOUT: 4000
} as const;
