import type { PickerOption, TagColor } from '@skyroc/native-ui';

/** 财税任务状态。 */
export type FinanceTaskStatus = 'collecting' | 'completed' | 'incomplete' | 'pending';

/** 企业任务中的一项待收资料。 */
export interface FinanceTaskMaterial {
  /** 资料项唯一标识 */
  id: string;
  /** 资料名称 */
  name: string;
  /** 是否已经收到 */
  received: boolean;
}

/** 一条企业财税任务。 */
export interface FinanceTask {
  companyName: string;
  dueDate: string;
  id: string;
  materials: FinanceTaskMaterial[];
  month: string;
  owner: string;
  status: FinanceTaskStatus;
}

/** 新增任务表单值。选择器统一使用字符串数组。 */
export interface FinanceTaskFormValues {
  companyName: string;
  dueDate: string[];
  month: string[];
  owner: string;
  status: string[];
}

/** 状态展示信息。 */
export const TASK_STATUS_META: Record<FinanceTaskStatus, { color: TagColor; label: string }> = {
  collecting: { color: 'info', label: '待收集资料' },
  completed: { color: 'success', label: '已完成' },
  incomplete: { color: 'destructive', label: '资料不完整' },
  pending: { color: 'warning', label: '待处理' }
};

export const TASK_STATUS_OPTIONS: PickerOption[] = Object.entries(TASK_STATUS_META).map(([value, meta]) => ({
  label: meta.label,
  value
}));

/** 状态筛选器选项。 */
export const TASK_STATUS_FILTER_OPTIONS: PickerOption[] = [{ label: '全部状态', value: 'all' }, ...TASK_STATUS_OPTIONS];

const DEFAULT_MATERIAL_NAMES = ['银行流水', '工资表', '费用明细'] as const;

/** 每条任务各自持有资料项，避免不同企业共享同一个可变数组。 */
export function createDefaultMaterials(): FinanceTaskMaterial[] {
  return DEFAULT_MATERIAL_NAMES.map((name, index) => ({
    id: `material-default-${index + 1}`,
    name,
    received: false
  }));
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

/** Date 转成本地 YYYY-MM-DD，避免 toISOString 带来的时区偏移。 */
export function formatDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDateParts(parts: string[]) {
  return parts.length >= 3 ? `${parts[0]}-${parts[1]}-${parts[2]}` : '';
}

export function formatMonthParts(parts: string[]) {
  return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : '';
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);

  result.setDate(result.getDate() + amount);

  return result;
}

export function getDefaultFormValues(): FinanceTaskFormValues {
  const today = new Date();
  const dueDate = addDays(today, 7);

  return {
    companyName: '',
    dueDate: [String(dueDate.getFullYear()), pad(dueDate.getMonth() + 1), pad(dueDate.getDate())],
    month: [String(today.getFullYear()), pad(today.getMonth() + 1)],
    owner: '',
    status: ['collecting']
  };
}

/** 用相对日期构造演示数据，页面在任何时间打开都能稳定看到正常与逾期两种任务。 */
export function createInitialTasks(): FinanceTask[] {
  const today = new Date();
  const month = formatDate(today).slice(0, 7);

  return [
    {
      companyName: '青禾餐饮管理有限公司',
      dueDate: formatDate(addDays(today, -2)),
      id: 'task-1',
      materials: createDefaultMaterials().map((material, index) => ({ ...material, received: index === 0 })),
      month,
      owner: '周敏',
      status: 'incomplete'
    },
    {
      companyName: '澄海科技有限公司',
      dueDate: formatDate(addDays(today, 2)),
      id: 'task-2',
      materials: createDefaultMaterials(),
      month,
      owner: '陈宇',
      status: 'collecting'
    },
    {
      companyName: '云栖供应链有限公司',
      dueDate: formatDate(addDays(today, 4)),
      id: 'task-3',
      materials: createDefaultMaterials().map(material => ({ ...material, received: true })),
      month,
      owner: '林晓',
      status: 'pending'
    },
    {
      companyName: '星川文化传媒有限公司',
      dueDate: formatDate(addDays(today, -1)),
      id: 'task-4',
      materials: createDefaultMaterials().map(material => ({ ...material, received: true })),
      month,
      owner: '周敏',
      status: 'completed'
    },
    {
      companyName: '北辰智能设备有限公司',
      dueDate: formatDate(addDays(today, 8)),
      id: 'task-5',
      materials: createDefaultMaterials(),
      month,
      owner: '陈宇',
      status: 'pending'
    },
    {
      companyName: '知行教育咨询有限公司',
      dueDate: formatDate(addDays(today, -5)),
      id: 'task-6',
      materials: createDefaultMaterials().map((material, index) => ({ ...material, received: index < 2 })),
      month,
      owner: '林晓',
      status: 'collecting'
    }
  ];
}

/** 截止日期早于今天且未完成时才算逾期。 */
export function isTaskOverdue(task: FinanceTask) {
  if (task.status === 'completed') return false;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const [year, month, day] = task.dueDate.split('-').map(Number);
  const dueDate = new Date(year, month - 1, day);

  return dueDate < today;
}

export function isFinanceTaskStatus(value: string | undefined): value is FinanceTaskStatus {
  return Boolean(value && value in TASK_STATUS_META);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeMaterials(value: unknown): FinanceTaskMaterial[] | undefined {
  if (value === undefined) return createDefaultMaterials();
  if (!Array.isArray(value)) return undefined;

  const materials: FinanceTaskMaterial[] = [];

  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.received !== 'boolean'
    ) {
      return undefined;
    }

    materials.push({ id: item.id, name: item.name, received: item.received });
  }

  return materials;
}

/** 读取旧版持久化数据时补齐资料清单；数据结构不合法则让存储层回退到演示数据。 */
export function normalizeFinanceTasks(value: unknown): FinanceTask[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const tasks: FinanceTask[] = [];

  for (const item of value) {
    if (!isRecord(item)) return undefined;

    const { companyName, dueDate, id, materials, month, owner, status } = item;

    if (
      typeof companyName !== 'string' ||
      typeof dueDate !== 'string' ||
      typeof id !== 'string' ||
      typeof month !== 'string' ||
      typeof owner !== 'string' ||
      typeof status !== 'string' ||
      !isFinanceTaskStatus(status)
    ) {
      return undefined;
    }

    const normalizedMaterials = normalizeMaterials(materials);

    if (!normalizedMaterials) return undefined;

    tasks.push({ companyName, dueDate, id, materials: normalizedMaterials, month, owner, status });
  }

  return tasks;
}
