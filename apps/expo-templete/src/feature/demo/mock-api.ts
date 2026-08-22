import type { PageParams, PageResult } from '@/feature/list';

/** 模拟网络往返耗时 */
const NETWORK_DELAY = 500;

/** 订单状态 */
export type OrderStatus = 'completed' | 'pending' | 'refunding' | 'shipped';

/** 订单 */
export interface Order {
  /** 金额，单位分 */
  amount: number;

  /** 商品缩略图占位色，避免 demo 依赖外网图片 */
  coverColor: string;

  /** 下单时间 */
  createdAt: string;

  id: string;

  /** 商品件数 */
  itemCount: number;

  shopName: string;

  status: OrderStatus;

  title: string;
}

/** 订单查询参数 */
export interface OrderQuery {
  /** 演示用开关：置为 true 时请求必定抛错，用来看错误态和重试 */
  shouldFail?: boolean;

  /** `all` 表示不过滤 */
  status: 'all' | OrderStatus;
}

/** 消息类型 */
export type MessageType = 'comment' | 'like' | 'system';

/** 通知消息 */
export interface Message {
  content: string;

  createdAt: string;

  id: string;

  /** 是否已读；demo 里由 updateItem 在客户端改，真实项目应由接口落库 */
  read: boolean;

  sender: string;

  type: MessageType;
}

/** 联系人 */
export interface Contact {
  department: string;

  id: string;

  name: string;

  online: boolean;

  /** 职位 */
  title: string;
}

/** 联系人查询参数 */
export interface ContactQuery {
  /** 姓名 / 部门 / 职位 的模糊匹配关键词 */
  keyword?: string;
}

/** 操作日志的结果 */
export type ActivityResult = 'failed' | 'success';

/** 操作日志 */
export interface Activity {
  /** 动作描述 */
  action: string;

  createdAt: string;

  /** 补充说明 */
  detail: string;

  id: string;

  operator: string;

  result: ActivityResult;
}

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * 通用切片，字段名对齐 `PageResult`。
 *
 * 数据为空时 `pages` 是 0，`getNextPageParam` 拿到 `1 < 0` 为假，hasNextPage 直接是 false —— 空列表不会再多打一次请求。
 */
function paginate<TItem>(all: TItem[], params: PageParams): PageResult<TItem> {
  const start = (params.pageNum - 1) * params.pageSize;

  return {
    items: all.slice(start, start + params.pageSize),
    pageNum: params.pageNum,
    pages: Math.ceil(all.length / params.pageSize),
    total: all.length
  };
}

const COVER_COLORS = ['#fca5a5', '#fdba74', '#fcd34d', '#86efac', '#7dd3fc', '#c4b5fd', '#f9a8d4'];

const ORDER_TITLES = [
  '轻户外冲锋衣 三合一可拆卸内胆',
  '人体工学椅 网布透气 附腰托',
  '低因手冲挂耳咖啡 10 包装',
  '机械键盘 75 配列 客制化轴体',
  '纯棉水洗四件套 1.8m 床品',
  '空气炸锅 5.5L 可视窗',
  '骨传导蓝牙耳机 IPX8 防水',
  '桌面显示器支架 单屏气压式'
];

const SHOP_NAMES = ['山野旅行装备', '一间办公', '深烘咖啡实验室', '像素工坊', '棉花糖家居', '厨房好物研究所'];

const ORDER_STATUSES: OrderStatus[] = ['pending', 'shipped', 'completed'];

/** 43 条订单，故意不是每页条数的整数倍，好看清最后一页和「没有更多了」 */
const ORDERS: Order[] = Array.from({ length: 43 }, (_, index) => ({
  amount: 1990 + index * 1370,
  coverColor: COVER_COLORS[index % COVER_COLORS.length],
  createdAt: `2026-08-${String(22 - (index % 22)).padStart(2, '0')} 1${index % 10}:0${index % 6}`,
  id: `order-${index + 1}`,
  itemCount: (index % 3) + 1,
  shopName: SHOP_NAMES[index % SHOP_NAMES.length],
  // refunding 一条都不给，用来演示空态
  status: ORDER_STATUSES[index % ORDER_STATUSES.length],
  title: ORDER_TITLES[index % ORDER_TITLES.length]
}));

const MESSAGE_SENDERS = ['林开阳', '周清和', '陈斯年', '系统通知', '苏见月', '何知白'];

const MESSAGE_CONTENTS = [
  '在「列表组件重构」里回复了你：这个 footer 的三态终于统一了',
  '赞了你的评论「空态也要能下拉刷新」',
  '你提交的发布单 #2481 已通过审核，将于今晚 22:00 上线',
  '把你加入了协作者，现在你可以编辑这份文档',
  '提到了你：这里的分页逻辑要不要顺手换成 useInfiniteList',
  '你的周报已被主管查阅'
];

const MESSAGE_TYPES: MessageType[] = ['comment', 'like', 'system'];

const MESSAGES: Message[] = Array.from({ length: 28 }, (_, index) => ({
  content: MESSAGE_CONTENTS[index % MESSAGE_CONTENTS.length],
  createdAt: `${index < 6 ? '今天' : '昨天'} ${String(9 + (index % 12)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
  id: `message-${index + 1}`,
  read: index % 3 === 0,
  sender: MESSAGE_SENDERS[index % MESSAGE_SENDERS.length],
  type: MESSAGE_TYPES[index % MESSAGE_TYPES.length]
}));

const CONTACT_NAMES = [
  '安其然',
  '白露',
  '曹与之',
  '邓寻',
  '费思南',
  '顾朝辞',
  '韩既明',
  '江照野',
  '柯不遇',
  '李知渺',
  '穆青山',
  '倪未晞',
  '欧阳霁',
  '裴清野',
  '钱屿川',
  '任盈舟',
  '沈砚书',
  '汤见微',
  '万山河',
  '席时予',
  '燕南飞',
  '张岁安'
];

const DEPARTMENTS = ['基础架构', '增长技术', '设计中心', '数据平台', '客户成功'];

const TITLES = ['前端工程师', '资深前端工程师', '技术专家', '产品设计师', '数据分析师', '解决方案顾问'];

const CONTACTS: Contact[] = CONTACT_NAMES.map((name, index) => ({
  department: DEPARTMENTS[index % DEPARTMENTS.length],
  id: `contact-${index + 1}`,
  name,
  online: index % 4 !== 0,
  title: TITLES[index % TITLES.length]
}));

const ACTIVITY_ACTIONS = [
  '提交了发布单',
  '回滚了灰度批次',
  '修改了限流阈值',
  '关闭了告警规则',
  '扩容了实例组',
  '更新了配置项'
];

const ACTIVITY_DETAILS = [
  '版本 v2.14.0，涉及 12 个服务',
  '批次 canary-03，影响 5% 流量',
  '从 2000 QPS 调整为 3500 QPS',
  '规则「订单超时率 > 3%」已停用',
  '4C8G × 6 → 4C8G × 10',
  '开启了新的列表分页开关'
];

const ACTIVITY_OPERATORS = ['林开阳', '周清和', '自动化流水线', '陈斯年'];

const ACTIVITIES: Activity[] = Array.from({ length: 24 }, (_, index) => ({
  action: ACTIVITY_ACTIONS[index % ACTIVITY_ACTIONS.length],
  createdAt: `08-${String(22 - (index % 20)).padStart(2, '0')} ${String(8 + (index % 12)).padStart(2, '0')}:${String((index * 13) % 60).padStart(2, '0')}`,
  detail: ACTIVITY_DETAILS[index % ACTIVITY_DETAILS.length],
  id: `activity-${index + 1}`,
  operator: ACTIVITY_OPERATORS[index % ACTIVITY_OPERATORS.length],
  result: index % 7 === 3 ? 'failed' : 'success'
}));

/** 订单分页；`shouldFail` 为 true 时直接抛错，用来演示错误态 */
export async function fetchOrderList(params: OrderQuery & PageParams): Promise<PageResult<Order>> {
  await delay(NETWORK_DELAY);

  // 请求必须抛异常，把错误塞在返回值字段里的话 useInfiniteList 会一直认为请求成功
  if (params.shouldFail) throw new Error('网络开小差了');

  const matched = params.status === 'all' ? ORDERS : ORDERS.filter(order => order.status === params.status);

  return paginate(matched, params);
}

/** 消息分页 */
export async function fetchMessageList(params: PageParams): Promise<PageResult<Message>> {
  await delay(NETWORK_DELAY);

  return paginate(MESSAGES, params);
}

/** 联系人分页，按关键词模糊匹配姓名 / 部门 / 职位 */
export async function fetchContactList(params: ContactQuery & PageParams): Promise<PageResult<Contact>> {
  await delay(NETWORK_DELAY);

  const keyword = params.keyword?.trim();

  const matched = keyword
    ? CONTACTS.filter(contact => `${contact.name}${contact.department}${contact.title}`.includes(keyword))
    : CONTACTS;

  return paginate(matched, params);
}

/** 操作日志分页 */
export async function fetchActivityList(params: PageParams): Promise<PageResult<Activity>> {
  await delay(NETWORK_DELAY);

  return paginate(ACTIVITIES, params);
}
