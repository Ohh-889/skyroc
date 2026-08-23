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

  /** 时间，只到分钟；日期在 dayLabel 里 */
  createdAt: string;

  /** 所属日期分组，如「今天」 */
  dayLabel: string;

  id: string;

  /** 是否已读；demo 里由 updateItem 在客户端改，真实项目应由接口落库 */
  read: boolean;

  sender: string;

  /** 消息正文里被高亮的对象，比如帖子标题 */
  target?: string;

  type: MessageType;
}

/** 消息查询参数 */
export interface MessageQuery {
  /** `all` 表示不过滤 */
  type: 'all' | MessageType;
}

/** 联系人 */
export interface Contact {
  department: string;

  id: string;

  /**
   * 是否是所属部门的第一条。
   *
   * 由服务端在过滤、排序、分页之后算好下发 —— 客户端如果自己比对「上一条的部门」，跨页时拿不到上一页的最后一条，第二页的组头会漏掉。
   */
  isDepartmentStart: boolean;

  name: string;

  online: boolean;

  /** 分机号 */
  phone: string;

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

  /** 时间，只到分钟；日期在 dayLabel 里 */
  createdAt: string;

  /** 所属日期分组，如「08-22」 */
  dayLabel: string;

  /** 补充说明 */
  detail: string;

  id: string;

  /** 是否是当天的第一条，用来决定要不要画日期标题和时间轴的起点 */
  isDayStart: boolean;

  operator: string;

  /** 关联的单号 */
  refId: string;

  result: ActivityResult;
}

/** 通讯录概览，跟着「常用联系人」一起返回，头部区域用普通 useQuery 拿，不参与分页 */
export interface ContactOverview {
  /** 常用联系人，只取前几位 */
  frequent: Contact[];

  onlineCount: number;

  total: number;
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
  createdAt: `08-${String(22 - (index % 22)).padStart(2, '0')} 1${index % 10}:0${index % 6}`,
  id: `order-${index + 1}`,
  itemCount: (index % 3) + 1,
  shopName: SHOP_NAMES[index % SHOP_NAMES.length],
  // refunding 一条都不给，用来演示空态
  status: ORDER_STATUSES[index % ORDER_STATUSES.length],
  title: ORDER_TITLES[index % ORDER_TITLES.length]
}));

const MESSAGE_SENDERS = ['林开阳', '周清和', '陈斯年', '发布系统', '苏见月', '何知白'];

/** 每种消息类型对应的文案模板，`target` 会在正文里被高亮出来 */
const MESSAGE_TEMPLATES: { content: string; target?: string; type: MessageType }[] = [
  {
    content: '回复了你：这个 footer 的三态终于统一了，之前三处各写一遍太难维护',
    target: '列表组件重构',
    type: 'comment'
  },
  { content: '赞了你的评论「空态也要能下拉刷新」', type: 'like' },
  { content: '已通过审核，将于今晚 22:00 开始灰度', target: '发布单 #2481', type: 'system' },
  { content: '提到了你：这里的分页逻辑要不要顺手换成 useInfiniteList', target: '每周技术评审', type: 'comment' },
  { content: '赞了你提交的方案', target: 'RFC-018 列表统一', type: 'like' },
  { content: '你的周报已被主管查阅', type: 'system' }
];

const MESSAGES: Message[] = Array.from({ length: 28 }, (_, index) => {
  const template = MESSAGE_TEMPLATES[index % MESSAGE_TEMPLATES.length];

  function resolveDayLabel() {
    if (index < 8) return '今天';

    return index < 18 ? '昨天' : '更早';
  }

  return {
    content: template.content,
    createdAt: `${String(9 + (index % 12)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
    dayLabel: resolveDayLabel(),
    id: `message-${index + 1}`,
    read: index % 3 === 0,
    sender: template.type === 'system' ? '发布系统' : MESSAGE_SENDERS[index % MESSAGE_SENDERS.length],
    target: template.target,
    type: template.type
  };
});

/**
 * 服务端侧的已读状态。真实项目里这是数据库里的一列，这里用一个模块级 Set 顶替。
 *
 * 刻意不去改 `MESSAGES` 里的 `read`：列表和未读数是两个接口，必须读同一份事实来源， 否则「点了已读、角标不动」这类 bug 要等联调才暴露。
 */
const READ_IDS = new Set<string>();

/** 把服务端已读状态合进一条消息 */
function withReadState(message: Message): Message {
  return READ_IDS.has(message.id) ? { ...message, read: true } : message;
}

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

/** 每个部门连续放 5 个人，这样按顺序分页时同部门是挨着的，组头才有意义 */
const DEPARTMENT_SIZE = Math.ceil(CONTACT_NAMES.length / DEPARTMENTS.length);

const CONTACTS: Omit<Contact, 'isDepartmentStart'>[] = CONTACT_NAMES.map((name, index) => ({
  department: DEPARTMENTS[Math.min(Math.floor(index / DEPARTMENT_SIZE), DEPARTMENTS.length - 1)],
  id: `contact-${index + 1}`,
  name,
  online: index % 4 !== 0,
  phone: `81${String(200 + index).padStart(3, '0')}`,
  title: TITLES[index % TITLES.length]
}));

/** 过滤、排序都结束之后再打分组标记，否则被过滤掉组内第一条时组头会整个消失 */
function withDepartmentFlags(list: Omit<Contact, 'isDepartmentStart'>[]): Contact[] {
  return list.map((contact, index) => ({
    ...contact,
    isDepartmentStart: index === 0 || list[index - 1].department !== contact.department
  }));
}

const ACTIVITY_TEMPLATES: { action: string; detail: string }[] = [
  { action: '提交了发布单', detail: '版本 v2.14.0，涉及 12 个服务，灰度 5%' },
  { action: '回滚了灰度批次', detail: '批次 canary-03，错误率超过阈值触发自动回滚' },
  { action: '修改了限流阈值', detail: '订单查询接口 2000 QPS → 3500 QPS' },
  { action: '关闭了告警规则', detail: '规则「订单超时率 > 3%」已停用，预计恢复时间 08:00' },
  { action: '扩容了实例组', detail: 'order-api 4C8G × 6 → 4C8G × 10' },
  { action: '更新了配置项', detail: '开启新的列表分页开关 list.infinite.enabled' }
];

const ACTIVITY_OPERATORS = ['林开阳', '周清和', '自动化流水线', '陈斯年'];

/** 每天放 3 条，24 条正好铺满 8 天，日期分组和时间轴的连线都能看出来 */
const ACTIVITIES: Activity[] = Array.from({ length: 24 }, (_, index) => {
  const template = ACTIVITY_TEMPLATES[index % ACTIVITY_TEMPLATES.length];

  return {
    action: template.action,
    createdAt: `${String(20 - (index % 3) * 5).padStart(2, '0')}:${String((index * 13) % 60).padStart(2, '0')}`,
    dayLabel: `08-${String(22 - Math.floor(index / 3)).padStart(2, '0')}`,
    detail: template.detail,
    id: `activity-${index + 1}`,
    isDayStart: index % 3 === 0,
    operator: ACTIVITY_OPERATORS[index % ACTIVITY_OPERATORS.length],
    refId: `#${2481 - index}`,
    result: index % 7 === 3 ? 'failed' : 'success'
  };
});

/** 订单分页；`shouldFail` 为 true 时直接抛错，用来演示错误态 */
export async function fetchOrderList(params: OrderQuery & PageParams): Promise<PageResult<Order>> {
  await delay(NETWORK_DELAY);

  // 请求必须抛异常，把错误塞在返回值字段里的话 useInfiniteList 会一直认为请求成功
  if (params.shouldFail) throw new Error('网络开小差了');

  const matched = params.status === 'all' ? ORDERS : ORDERS.filter(order => order.status === params.status);

  return paginate(matched, params);
}

/** 消息分页，按类型过滤 */
export async function fetchMessageList(params: MessageQuery & PageParams): Promise<PageResult<Message>> {
  await delay(NETWORK_DELAY);

  const matched = params.type === 'all' ? MESSAGES : MESSAGES.filter(message => message.type === params.type);

  return paginate(matched.map(withReadState), params);
}

/** 联系人分页，按关键词模糊匹配姓名 / 部门 / 职位 */
export async function fetchContactList(params: ContactQuery & PageParams): Promise<PageResult<Contact>> {
  await delay(NETWORK_DELAY);

  const keyword = params.keyword?.trim();

  const matched = keyword
    ? CONTACTS.filter(contact => `${contact.name}${contact.department}${contact.title}`.includes(keyword))
    : CONTACTS;

  return paginate(withDepartmentFlags(matched), params);
}

/** 通讯录头部概览，不分页，用普通 useQuery 拿 */
export async function fetchContactOverview(): Promise<ContactOverview> {
  await delay(NETWORK_DELAY);

  const online = CONTACTS.filter(contact => contact.online);

  return {
    frequent: withDepartmentFlags(online.slice(0, 8)),
    onlineCount: online.length,
    total: CONTACTS.length
  };
}

/** 操作日志分页 */
export async function fetchActivityList(params: PageParams): Promise<PageResult<Activity>> {
  await delay(NETWORK_DELAY);

  return paginate(ACTIVITIES, params);
}

/** 标记已读。真实项目里是一个 POST，成功后由调用方 invalidate 相关 query */
export async function markMessagesRead(ids: string[]) {
  await delay(NETWORK_DELAY);

  ids.forEach(id => READ_IDS.add(id));
}

/** 全部标为已读。单独一个接口而不是把全量 id 传上去——客户端手里只有已加载的那几页 */
export async function markAllMessagesRead() {
  await delay(NETWORK_DELAY);

  MESSAGES.forEach(message => READ_IDS.add(message.id));
}

/**
 * 未读数。底部 tab 的角标读它。
 *
 * 单独一个接口，不从列表里数：列表是分页的，第一页数出来的只是「已加载部分的未读数」， 角标要的是全量。
 */
export async function fetchUnreadCount(): Promise<number> {
  await delay(NETWORK_DELAY);

  return MESSAGES.filter(message => !withReadState(message).read).length;
}

/** 首页统计项的语义 key。配色和图标由页面按 key 查表，别让接口下发 className */
export type HomeStatKey = 'done' | 'pending' | 'running';

/** 首页一格统计 */
export interface HomeStat {
  key: HomeStatKey;

  label: string;

  value: number;
}

/** 首页待办的紧急程度 */
export type HomeTodoLevel = 'high' | 'low' | 'normal';

/** 首页待办 */
export interface HomeTodo {
  /** 截止时间的人话描述，如「今天 18:00」 */
  deadline: string;

  id: string;

  level: HomeTodoLevel;

  owner: string;

  title: string;
}

/** 首页公告 */
export interface HomeNotice {
  content: string;

  publishedAt: string;

  title: string;
}

/**
 * 首页首屏数据。
 *
 * 一次请求把首屏要的东西全带回来，而不是让首页并发打四五个接口：首屏的每个接口都各有各的 loading 和失败态，拆得越碎，页面上要处理的状态组合越多，弱网下也越容易半屏空着。
 */
export interface HomeSummary {
  notice: HomeNotice;

  stats: HomeStat[];

  todos: HomeTodo[];

  /** 当前用户昵称，问候语里用 */
  userName: string;
}

const HOME_NOTICES: HomeNotice[] = [
  {
    content: '本周四 22:00 - 23:00 订单中心灰度发版，期间下单可能出现短暂排队，请提前周知客户。',
    publishedAt: '08-22 09:30',
    title: '发布窗口通知'
  },
  {
    content: '新的列表分页开关已全量，页面若仍有手写 pageNum 的地方，请统一换成 useInfiniteList。',
    publishedAt: '08-21 17:05',
    title: '组件库升级'
  }
];

const HOME_TODOS: HomeTodo[] = [
  { deadline: '今天 18:00', id: 'todo-1', level: 'high', owner: '周清和', title: '确认 v2.14.0 灰度批次的回滚预案' },
  { deadline: '今天 20:00', id: 'todo-2', level: 'normal', owner: '陈斯年', title: '补齐订单导出接口的字段说明' },
  { deadline: '明天 12:00', id: 'todo-3', level: 'normal', owner: '苏见月', title: '复核通讯录部门分组的排序规则' },
  { deadline: '本周内', id: 'todo-4', level: 'low', owner: '何知白', title: '把埋点文档同步到新的 wiki 空间' }
];

/** 每请求一次 +1，让下拉刷新肉眼可见地刷出新数字，否则刷完看不出到底有没有重拉 */
let homeFetchCount = 0;

/** 首页首屏数据 */
export async function fetchHomeSummary(): Promise<HomeSummary> {
  await delay(NETWORK_DELAY);

  homeFetchCount += 1;

  return {
    notice: HOME_NOTICES[homeFetchCount % HOME_NOTICES.length],
    stats: [
      { key: 'pending', label: '待处理', value: 6 + (homeFetchCount % 4) },
      { key: 'running', label: '进行中', value: 12 },
      { key: 'done', label: '本周完成', value: 38 + homeFetchCount }
    ],
    todos: HOME_TODOS,
    userName: '林开阳'
  };
}

/** 「我的」页统计项的语义 key */
export type ProfileStatKey = 'collection' | 'coupon' | 'footprint';

/** 「我的」页一格统计 */
export interface ProfileStat {
  key: ProfileStatKey;

  label: string;

  value: number;
}

/** 当前用户概览 */
export interface ProfileOverview {
  department: string;

  name: string;

  /** 已打码的手机号。脱敏在服务端做，明文不下发到客户端 */
  phone: string;

  stats: ProfileStat[];

  title: string;
}

/** 当前用户概览 */
export async function fetchProfile(): Promise<ProfileOverview> {
  await delay(NETWORK_DELAY);

  return {
    department: '基础架构',
    name: '林开阳',
    phone: '138****2049',
    stats: [
      { key: 'collection', label: '收藏', value: 24 },
      { key: 'footprint', label: '足迹', value: 186 },
      { key: 'coupon', label: '优惠券', value: 3 }
    ],
    title: '资深前端工程师'
  };
}
