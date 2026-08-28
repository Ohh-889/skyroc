import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tag, Text } from '@skyroc/native-ui';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { FinanceTask } from './task-model';
import { TASK_STATUS_META, isTaskOverdue } from './task-model';

const Icon = withUniwind(MaterialCommunityIcons);

export interface FinanceTaskCardProps {
  /** 当前任务 */
  item: FinanceTask;
  /** 打开企业任务详情 */
  onDetailPress: (task: FinanceTask) => void;
  /** 打开状态选择器 */
  onStatusPress: (task: FinanceTask) => void;
}

/** 财税任务卡片；状态标签本身就是修改入口。 */
export const FinanceTaskCard = (props: FinanceTaskCardProps) => {
  const { item, onDetailPress, onStatusPress } = props;

  const overdue = isTaskOverdue(item);
  const receivedMaterialCount = item.materials.filter(material => material.received).length;
  const statusMeta = TASK_STATUS_META[item.status];

  return (
    <View
      className={`mb-3 overflow-hidden rounded-2xl border bg-card ${
        overdue ? 'border-destructive/40' : 'border-border/60'
      }`}
    >
      {overdue ? <View className="h-1 bg-destructive" /> : null}

      <View className="gap-3 p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text
              numberOfLines={2}
              size="base"
              weight="semibold"
            >
              {item.companyName}
            </Text>

            <Text
              color="muted"
              size="xs"
            >
              所属月份 {item.month}
            </Text>
          </View>

          {overdue ? (
            <Tag
              color="destructive"
              shape="pill"
              size="sm"
              variant="tonal"
            >
              已逾期
            </Tag>
          ) : null}
        </View>

        <View className="flex-row items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
          <View className="flex-1 flex-row items-center gap-2">
            <Icon
              colorClassName={overdue ? 'accent-destructive' : 'accent-muted-foreground'}
              name="calendar-clock-outline"
              size={16}
            />

            <View>
              <Text
                color="muted"
                size="2xs"
              >
                截止日期
              </Text>

              <Text
                color={overdue ? 'destructive' : 'foreground'}
                size="sm"
                weight="medium"
              >
                {item.dueDate}
              </Text>
            </View>
          </View>

          <View className="h-7 w-px bg-border" />

          <View className="flex-1 flex-row items-center gap-2">
            <Icon
              colorClassName="accent-muted-foreground"
              name="account-outline"
              size={16}
            />

            <View>
              <Text
                color="muted"
                size="2xs"
              >
                负责人
              </Text>

              <Text
                size="sm"
                weight="medium"
              >
                {item.owner}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <Text
            color="muted"
            size="xs"
          >
            当前状态
          </Text>

          <Pressable
            accessibilityLabel={`修改${item.companyName}的任务状态`}
            className="flex-row items-center gap-1 rounded-full active:opacity-60"
            onPress={() => onStatusPress(item)}
          >
            <Tag
              color={statusMeta.color}
              shape="pill"
              variant="tonal"
            >
              {statusMeta.label}
            </Tag>

            <Icon
              colorClassName="accent-muted-foreground"
              name="chevron-down"
              size={16}
            />
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between border-t border-border/60 pt-3">
          <View className="flex-row items-center gap-1.5">
            <Icon
              colorClassName="accent-muted-foreground"
              name="file-check-outline"
              size={16}
            />

            <Text
              color="muted"
              size="xs"
            >
              资料 {receivedMaterialCount}/{item.materials.length}
            </Text>
          </View>

          <Pressable
            accessibilityLabel={`查看${item.companyName}详情`}
            className="flex-row items-center gap-1 rounded-lg px-1 py-0.5 active:opacity-60"
            onPress={() => onDetailPress(item)}
          >
            <Text
              color="primary"
              size="xs"
              weight="semibold"
            >
              查看详情
            </Text>

            <Icon
              colorClassName="accent-primary"
              name="chevron-right"
              size={16}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
