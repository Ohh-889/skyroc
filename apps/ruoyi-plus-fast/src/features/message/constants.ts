/**
 * Message 模块在实时协议上占的消息类型，与后端 app/modules/message/constants.py 逐字一致。
 *
 * 这是跨仓库契约，改一个字前后端要一起发版。命名是 `模块.资源.动作`，第一级把各模块隔开。
 */

/** 上行：把消息投给指定的人。data 形状 `{ recipients: [42], body: {…} }`。 */
export const DIRECT_SEND = 'message.direct.send';

/** 上行：发给本租户所有在线的人。data 形状 `{ body: {…} }`，范围不接受客户端指定。 */
export const BROADCAST_SEND = 'message.broadcast.send';

/** 下行：有人给你发了一条定向消息。 */
export const DIRECT_CREATED = 'message.direct.created';

/** 下行：有一条群发消息。和上面分开，可以渲染成公告而不是私信。 */
export const BROADCAST_CREATED = 'message.broadcast.created';
