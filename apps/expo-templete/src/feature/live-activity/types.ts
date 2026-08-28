/**
 * 排队的四个阶段，和后端叫号系统的状态机一一对应。
 *
 * - `waiting` 正常排队
 * - `upcoming` 快轮到了（前面 ≤ 2 位），提醒患者回候诊区
 * - `called` 已叫号，进入到场倒计时，超时按过号处理
 * - `done` 就诊结束，卡片即将消失
 */
export type QueueStage = 'called' | 'done' | 'upcoming' | 'waiting';

/**
 * 灵动岛 / 锁屏卡片上要显示的全部内容。
 *
 * 这个对象会被 `JSON.stringify` 后交给 ActivityKit，因此有三条硬约束：
 *
 * 1. **只能放能 JSON 化的标量**。`Date` 会被序列化成字符串再送进 widget 进程，两边类型对不上， 所以时间一律以 ISO 字符串传递，由 widget 侧 `new Date(...)` 还原。
 * 2. **整体不能超过 4KB**（ActivityKit 对 content state 的上限），别把整个订单/病历塞进来， 只放这一屏要渲染的字段。
 * 3. **每次 update 都是全量覆盖**，没有增量补丁，所以字段要能独立描述当前状态。
 */
export interface QueueActivityProps {
  /** 前面还有几位。0 表示下一个就是你 */
  aheadCount: number;

  /** 叫号时刻的 ISO 字符串，和 `deadlineAt` 一起构成倒计时的两端 */
  calledAt?: string;

  /** 到场截止时刻的 ISO 字符串，超过就算过号 */
  deadlineAt?: string;

  /** 科室名 */
  department: string;

  /** 出诊医生 */
  doctor: string;

  /** 预计叫号时刻的 ISO 字符串，widget 里用 SwiftUI 的 Text(date:) 渲染成本地时间 */
  estimatedAt: string;

  /** 叫到号后才有的诊室号 */
  room?: string;

  /** 排队阶段 */
  stage: QueueStage;

  /** 号码，例如 A031 */
  ticketNumber: string;

  /** 取号时排在前面的人数，用来算进度条；中途不变，否则进度会来回跳 */
  totalAhead: number;
}
