import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, Checkbox, Input, Popup, Tag, Text, showSuccessToast } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView as RNKeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { withUniwind } from 'uniwind';

import type { FinanceTask } from './task-model';
import { TASK_STATUS_META, isTaskOverdue } from './task-model';

const Icon = withUniwind(MaterialCommunityIcons);
const KeyboardAwareScrollView = withUniwind(RNKeyboardAwareScrollView);

export interface TaskDetailPopupProps {
  /** 向当前任务追加资料项 */
  onAddMaterial: (taskId: string, materialName: string) => void;
  /** 打开当前任务的状态选择器 */
  onStatusPress: (task: FinanceTask) => void;
  /** 勾选或取消勾选资料项 */
  onUpdateMaterial: (taskId: string, materialId: string, received: boolean) => void;
  /** 更新详情弹层显隐 */
  onUpdateShow: (show: boolean) => void;
  /** 是否显示详情弹层 */
  show: boolean;
  /** 当前查看的企业任务 */
  task?: FinanceTask;
}

/** 企业任务详情与资料清单；所有写操作继续交给页面更新同一个持久化任务数组。 */
export const TaskDetailPopup = (props: TaskDetailPopupProps) => {
  const { onAddMaterial, onStatusPress, onUpdateMaterial, onUpdateShow, show, task } = props;

  const [materialName, setMaterialName] = useState('');

  const overdue = task ? isTaskOverdue(task) : false;
  const receivedCount = task?.materials.filter(material => material.received).length ?? 0;
  const statusMeta = task ? TASK_STATUS_META[task.status] : undefined;

  function handleAddMaterial() {
    const name = materialName.trim();

    if (!task || !name) return;

    onAddMaterial(task.id, name);
    setMaterialName('');
    showSuccessToast('资料项已添加');
  }

  function handleOpened() {
    setMaterialName('');
  }

  return (
    <Popup
      round
      safeAreaInsetBottom
      className="h-[88%]"
      position="bottom"
      show={show}
      onOpened={handleOpened}
      onUpdateShow={onUpdateShow}
    >
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <View className="w-14" />

        <Text
          size="lg"
          weight="semibold"
        >
          企业详情
        </Text>

        <Button
          className="w-14"
          size="sm"
          variant="ghost"
          onPress={() => onUpdateShow(false)}
        >
          完成
        </Button>
      </View>

      {task && statusMeta ? (
        <KeyboardAwareScrollView
          bottomOffset={24}
          keyboardShouldPersistTaps="handled"
          className="flex-1 bg-muted"
          contentContainerClassName="gap-4 px-4 py-4"
        >
          <View className="gap-3 rounded-2xl border border-border/60 bg-card p-4">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 gap-1">
                <Text
                  size="lg"
                  weight="bold"
                >
                  {task.companyName}
                </Text>

                <Text
                  color="muted"
                  size="xs"
                >
                  任务编号 {task.id}
                </Text>
              </View>

              {overdue ? (
                <Tag
                  color="destructive"
                  shape="pill"
                  variant="tonal"
                >
                  已逾期
                </Tag>
              ) : null}
            </View>

            <View className="gap-3 rounded-xl bg-muted/60 p-3">
              <View className="flex-row gap-3">
                <DetailField
                  icon="calendar-month-outline"
                  label="所属月份"
                  value={task.month}
                />
                <DetailField
                  icon="calendar-clock-outline"
                  label="截止日期"
                  value={task.dueDate}
                />
              </View>

              <View className="flex-row gap-3">
                <DetailField
                  icon="account-outline"
                  label="负责人"
                  value={task.owner}
                />
                <View className="flex-1 gap-1">
                  <Text
                    color="muted"
                    size="2xs"
                  >
                    当前状态
                  </Text>

                  <Button
                    className="self-start"
                    color={statusMeta.color}
                    size="sm"
                    variant="tonal"
                    onPress={() => onStatusPress(task)}
                  >
                    {statusMeta.label}
                  </Button>
                </View>
              </View>
            </View>
          </View>

          <View className="gap-3 rounded-2xl border border-border/60 bg-card p-4">
            <View className="flex-row items-end justify-between gap-3">
              <View className="gap-1">
                <Text
                  size="base"
                  weight="semibold"
                >
                  资料清单
                </Text>

                <Text
                  color="muted"
                  size="xs"
                >
                  勾选已经收到的企业资料
                </Text>
              </View>

              <Text
                color={receivedCount === task.materials.length ? 'success' : 'primary'}
                size="sm"
                weight="semibold"
              >
                {receivedCount}/{task.materials.length}
              </Text>
            </View>

            <View className="gap-2">
              {task.materials.map(material => (
                <View
                  key={material.id}
                  className="flex-row items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-3"
                >
                  <Checkbox
                    checked={material.received}
                    className="flex-1"
                    onCheckedChange={checked => onUpdateMaterial(task.id, material.id, checked)}
                  >
                    {material.name}
                  </Checkbox>

                  <Text
                    color={material.received ? 'success' : 'muted'}
                    size="2xs"
                    weight="medium"
                  >
                    {material.received ? '已收到' : '待接收'}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex-row items-center gap-2 border-t border-border/60 pt-3">
              <Input
                clearable
                className="flex-1"
                placeholder="添加其他资料，例如合同"
                returnKeyType="done"
                value={materialName}
                onChangeText={setMaterialName}
                onSubmitEditing={handleAddMaterial}
              />

              <Button
                disabled={!materialName.trim()}
                size="md"
                onPress={handleAddMaterial}
              >
                添加
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      ) : null}
    </Popup>
  );
};

interface DetailFieldProps {
  /** 字段图标 */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** 字段名称 */
  label: string;
  /** 字段值 */
  value: string;
}

const DetailField = (props: DetailFieldProps) => {
  const { icon, label, value } = props;

  return (
    <View className="flex-1 flex-row items-center gap-2">
      <Icon
        colorClassName="accent-muted-foreground"
        name={icon}
        size={17}
      />

      <View className="flex-1 gap-0.5">
        <Text
          color="muted"
          size="2xs"
        >
          {label}
        </Text>

        <Text
          numberOfLines={1}
          size="sm"
          weight="medium"
        >
          {value}
        </Text>
      </View>
    </View>
  );
};
