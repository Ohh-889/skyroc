import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker, Search, Text } from '@skyroc/native-ui';
import type { PickerOption } from '@skyroc/native-ui';
import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { List } from '@/feature/list';

import { DemoHeader } from '../../modules/DemoHeader';
import { FinanceTaskCard } from './modules/FinanceTaskCard';
import type { FinanceTask, FinanceTaskStatus } from './modules/task-model';
import {
  TASK_STATUS_FILTER_OPTIONS,
  TASK_STATUS_META,
  TASK_STATUS_OPTIONS,
  isFinanceTaskStatus,
  isTaskOverdue
} from './modules/task-model';
import { financeTasksAtom } from './modules/task-store';
import { TaskDetailPopup } from './modules/TaskDetailPopup';
import { TaskFormPopup } from './modules/TaskFormPopup';

const Icon = withUniwind(MaterialCommunityIcons);

interface StatCardProps {
  /** 统计项的语义图标 */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** 统计项名称 */
  label: string;
  /** 统计项的语义色 */
  tone: 'destructive' | 'info' | 'primary' | 'warning';
  /** 当前统计值 */
  value: number;
}

const STAT_TONE_META = {
  destructive: { icon: 'accent-destructive', surface: 'bg-destructive/10' },
  info: { icon: 'accent-info', surface: 'bg-info/10' },
  primary: { icon: 'accent-primary', surface: 'bg-primary/10' },
  warning: { icon: 'accent-warning', surface: 'bg-warning/10' }
} as const;

const StatCard = (props: StatCardProps) => {
  const { icon, label, tone, value } = props;
  const toneMeta = STAT_TONE_META[tone];

  return (
    <View className="flex-1 flex-row items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
      <View className={`size-10 items-center justify-center rounded-xl ${toneMeta.surface}`}>
        <Icon
          colorClassName={toneMeta.icon}
          name={icon}
          size={19}
        />
      </View>

      <View className="flex-1">
        <Text
          size="xl"
          weight="bold"
        >
          {value}
        </Text>

        <Text
          color="muted"
          numberOfLines={1}
          size="2xs"
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

interface TaskOverviewProps {
  /** 当前筛选结果中的企业数量 */
  companyCount: number;
  /** 当前筛选结果中资料不完整的任务数量 */
  incompleteCount: number;
  /** 打开新增任务表单 */
  onCreate: () => void;
  /** 当前筛选结果中已逾期的任务数量 */
  overdueCount: number;
  /** 当前筛选结果中待处理的任务数量 */
  pendingCount: number;
}

const TaskOverview = (props: TaskOverviewProps) => {
  const { companyCount, incompleteCount, onCreate, overdueCount, pendingCount } = props;

  return (
    <View className="gap-3 pb-2 pt-3">
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-1 gap-0.5">
          <Text
            size="lg"
            weight="semibold"
          >
            本月任务概览
          </Text>

          <Text
            color="muted"
            size="xs"
          >
            列表、统计和表单共用一份任务数据
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className="flex-row items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 active:opacity-70"
          onPress={onCreate}
        >
          <Icon
            colorClassName="accent-primary-foreground"
            name="plus"
            size={16}
          />

          <Text
            className="text-primary-foreground"
            size="sm"
            weight="semibold"
          >
            新增任务
          </Text>
        </Pressable>
      </View>

      <View className="gap-2">
        <View className="flex-row gap-2">
          <StatCard
            icon="domain"
            label="企业总数"
            tone="primary"
            value={companyCount}
          />

          <StatCard
            icon="clipboard-text-clock-outline"
            label="待处理任务"
            tone="warning"
            value={pendingCount}
          />
        </View>

        <View className="flex-row gap-2">
          <StatCard
            icon="file-alert-outline"
            label="资料不完整"
            tone="info"
            value={incompleteCount}
          />

          <StatCard
            icon="calendar-alert"
            label="已逾期任务"
            tone="destructive"
            value={overdueCount}
          />
        </View>
      </View>

      <View className="mt-1 flex-row items-center gap-2">
        <Text
          color="muted"
          size="xs"
          weight="semibold"
        >
          企业任务
        </Text>

        <View className="h-px flex-1 bg-border/60" />

        <Text
          color="muted"
          size="2xs"
        >
          点击状态标签即可修改
        </Text>
      </View>
    </View>
  );
};

interface TaskFiltersProps {
  /** 当前企业名称搜索词 */
  keyword: string;
  /** 更新企业名称搜索词 */
  onKeywordChange: (value: string) => void;
  /** 打开负责人筛选器 */
  onOwnerPress: () => void;
  /** 打开状态筛选器 */
  onStatusPress: () => void;
  /** 当前负责人筛选值 */
  ownerFilter: string;
  /** 当前状态筛选值 */
  statusFilter: 'all' | FinanceTaskStatus;
}

const TaskFilters = (props: TaskFiltersProps) => {
  const { keyword, onKeywordChange, onOwnerPress, onStatusPress, ownerFilter, statusFilter } = props;

  const ownerLabel = ownerFilter === 'all' ? '全部负责人' : ownerFilter;
  const statusLabel = statusFilter === 'all' ? '全部状态' : TASK_STATUS_META[statusFilter].label;

  return (
    <View className="gap-2">
      <Search
        clearable
        placeholder="搜索企业名称"
        value={keyword}
        onChangeText={onKeywordChange}
        onClear={() => onKeywordChange('')}
      />

      <View className="flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          className={`flex-1 flex-row items-center justify-between rounded-xl border px-3 py-2.5 active:opacity-70 ${
            statusFilter === 'all' ? 'border-border bg-card' : 'border-primary/40 bg-primary/10'
          }`}
          onPress={onStatusPress}
        >
          <View className="flex-1 flex-row items-center gap-2">
            <Icon
              colorClassName={statusFilter === 'all' ? 'accent-muted-foreground' : 'accent-primary'}
              name="filter-variant"
              size={16}
            />

            <Text
              color={statusFilter === 'all' ? 'muted' : 'primary'}
              numberOfLines={1}
              size="xs"
              weight="medium"
            >
              {statusLabel}
            </Text>
          </View>

          <Icon
            colorClassName="accent-muted-foreground"
            name="chevron-down"
            size={15}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          className={`flex-1 flex-row items-center justify-between rounded-xl border px-3 py-2.5 active:opacity-70 ${
            ownerFilter === 'all' ? 'border-border bg-card' : 'border-primary/40 bg-primary/10'
          }`}
          onPress={onOwnerPress}
        >
          <View className="flex-1 flex-row items-center gap-2">
            <Icon
              colorClassName={ownerFilter === 'all' ? 'accent-muted-foreground' : 'accent-primary'}
              name="account-filter-outline"
              size={16}
            />

            <Text
              color={ownerFilter === 'all' ? 'muted' : 'primary'}
              numberOfLines={1}
              size="xs"
              weight="medium"
            >
              {ownerLabel}
            </Text>
          </View>

          <Icon
            colorClassName="accent-muted-foreground"
            name="chevron-down"
            size={15}
          />
        </Pressable>
      </View>
    </View>
  );
};

/** 企业财税任务管理：受控 List、筛选详情、资料清单与 MMKV 持久化共用一份任务数据。 */
const FinanceTasksScreen = () => {
  const [createShow, setCreateShow] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string>();
  const [editingTaskId, setEditingTaskId] = useState<string>();
  const [keyword, setKeyword] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [ownerFilterShow, setOwnerFilterShow] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | FinanceTaskStatus>('all');
  const [statusFilterShow, setStatusFilterShow] = useState(false);

  const [tasks, setTasks] = useAtom(financeTasksAtom);

  const detailTask = tasks.find(task => task.id === detailTaskId);
  const editingTask = tasks.find(task => task.id === editingTaskId);
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();
  const ownerOptions = useMemo<PickerOption[]>(
    () => [
      { label: '全部负责人', value: 'all' },
      ...Array.from(new Set(tasks.map(task => task.owner)))
        .sort((left, right) => left.localeCompare(right, 'zh-CN'))
        .map(owner => ({ label: owner, value: owner }))
    ],
    [tasks]
  );
  const filteredTasks = useMemo(
    () =>
      tasks.filter(task => {
        const matchesKeyword = !normalizedKeyword || task.companyName.toLocaleLowerCase().includes(normalizedKeyword);
        const matchesOwner = ownerFilter === 'all' || task.owner === ownerFilter;
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

        return matchesKeyword && matchesOwner && matchesStatus;
      }),
    [normalizedKeyword, ownerFilter, statusFilter, tasks]
  );

  const stats = useMemo(
    () => ({
      companyCount: new Set(filteredTasks.map(task => task.companyName)).size,
      incompleteCount: filteredTasks.filter(task => task.status === 'incomplete').length,
      overdueCount: filteredTasks.filter(isTaskOverdue).length,
      pendingCount: filteredTasks.filter(task => task.status === 'pending').length
    }),
    [filteredTasks]
  );

  function handleCreate(task: FinanceTask) {
    setTasks(current => [task, ...current]);
  }

  function handleAddMaterial(taskId: string, materialName: string) {
    setTasks(current =>
      current.map(task =>
        task.id === taskId
          ? {
              ...task,
              materials: [...task.materials, { id: `material-${Date.now()}`, name: materialName, received: false }]
            }
          : task
      )
    );
  }

  function handleOwnerFilterConfirm(values: string[]) {
    const owner = values[0];

    if (!owner || !ownerOptions.some(option => option.value === owner)) return;

    setOwnerFilter(owner);
  }

  function handleStatusConfirm(values: string[]) {
    const status = values[0];

    if (!editingTaskId || !isFinanceTaskStatus(status)) return;

    setTasks(current => current.map(task => (task.id === editingTaskId ? { ...task, status } : task)));
    setEditingTaskId(undefined);
  }

  function handleStatusFilterConfirm(values: string[]) {
    const status = values[0];

    if (status === 'all') {
      setStatusFilter('all');
      return;
    }

    if (isFinanceTaskStatus(status)) setStatusFilter(status);
  }

  function handleUpdateMaterial(taskId: string, materialId: string, received: boolean) {
    setTasks(current =>
      current.map(task =>
        task.id === taskId
          ? {
              ...task,
              materials: task.materials.map(material =>
                material.id === materialId ? { ...material, received } : material
              )
            }
          : task
      )
    );
  }

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title="企业财税任务" />

      <List<FinanceTask>
        data={filteredTasks}
        emptyText={
          normalizedKeyword || ownerFilter !== 'all' || statusFilter !== 'all'
            ? '没有符合当前搜索和筛选条件的企业任务'
            : '还没有企业任务，先新增一条吧'
        }
        keyField="id"
        keyboardShouldPersistTaps="handled"
        classNames={{ content: 'px-4 pb-safe-offset-8' }}
        ListHeaderComponent={
          <View className="gap-2 pb-2">
            <TaskOverview
              {...stats}
              onCreate={() => setCreateShow(true)}
            />

            <TaskFilters
              keyword={keyword}
              ownerFilter={ownerFilter}
              statusFilter={statusFilter}
              onKeywordChange={setKeyword}
              onOwnerPress={() => setOwnerFilterShow(true)}
              onStatusPress={() => setStatusFilterShow(true)}
            />
          </View>
        }
        renderFooter={() => null}
        renderItem={({ item }) => (
          <FinanceTaskCard
            item={item}
            onDetailPress={task => setDetailTaskId(task.id)}
            onStatusPress={task => setEditingTaskId(task.id)}
          />
        )}
      />

      <TaskFormPopup
        show={createShow}
        onCreate={handleCreate}
        onUpdateShow={setCreateShow}
      />

      <TaskDetailPopup
        show={Boolean(detailTask)}
        task={detailTask}
        onAddMaterial={handleAddMaterial}
        onStatusPress={task => {
          setDetailTaskId(undefined);
          setEditingTaskId(task.id);
        }}
        onUpdateMaterial={handleUpdateMaterial}
        onUpdateShow={show => {
          if (!show) setDetailTaskId(undefined);
        }}
      />

      <Picker
        columns={TASK_STATUS_OPTIONS}
        show={Boolean(editingTask)}
        title={editingTask ? `修改「${editingTask.companyName}」状态` : '修改任务状态'}
        value={editingTask ? [editingTask.status] : []}
        onConfirm={handleStatusConfirm}
        onUpdateShow={show => {
          if (!show) setEditingTaskId(undefined);
        }}
      />

      <Picker
        columns={TASK_STATUS_FILTER_OPTIONS}
        show={statusFilterShow}
        title="按状态筛选"
        value={[statusFilter]}
        onConfirm={handleStatusFilterConfirm}
        onUpdateShow={setStatusFilterShow}
      />

      <Picker
        columns={ownerOptions}
        show={ownerFilterShow}
        title="按负责人筛选"
        value={[ownerFilter]}
        onConfirm={handleOwnerFilterConfirm}
        onUpdateShow={setOwnerFilterShow}
      />
    </View>
  );
};

export default FinanceTasksScreen;
