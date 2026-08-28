import {
  Button,
  CellGroup,
  DatePicker,
  FieldGroup,
  FormItem,
  Input,
  Picker,
  Popup,
  Text,
  showSuccessToast,
  useForm
} from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView as RNKeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { withUniwind } from 'uniwind';

import type { FinanceTask, FinanceTaskFormValues } from './task-model';
import {
  TASK_STATUS_META,
  TASK_STATUS_OPTIONS,
  createDefaultMaterials,
  formatDateParts,
  formatMonthParts,
  getDefaultFormValues,
  isFinanceTaskStatus
} from './task-model';

const KeyboardAwareScrollView = withUniwind(RNKeyboardAwareScrollView);

const INITIAL_VALUES = getDefaultFormValues();

interface PickedValueProps {
  placeholder: string;
  value?: string;
}

const PickedValue = (props: PickedValueProps) => {
  const { placeholder, value } = props;

  return (
    <Text
      color={value ? 'foreground' : 'muted'}
      size="base"
    >
      {value || placeholder}
    </Text>
  );
};

export interface TaskFormPopupProps {
  onCreate: (task: FinanceTask) => void;
  onUpdateShow: (show: boolean) => void;
  show: boolean;
}

/** 新增任务弹层。表单值与任务列表仍由页面单向汇总，弹层只负责收集和校验。 */
export const TaskFormPopup = (props: TaskFormPopupProps) => {
  const { onCreate, onUpdateShow, show } = props;

  const [form] = useForm<FinanceTaskFormValues>();
  const [monthShow, setMonthShow] = useState(false);
  const [dueDateShow, setDueDateShow] = useState(false);
  const [statusShow, setStatusShow] = useState(false);

  function handleFinish(values: FinanceTaskFormValues) {
    const status = values.status[0];

    if (!isFinanceTaskStatus(status)) return;

    onCreate({
      companyName: values.companyName.trim(),
      dueDate: formatDateParts(values.dueDate),
      id: `task-${Date.now()}`,
      materials: createDefaultMaterials(),
      month: formatMonthParts(values.month),
      owner: values.owner.trim(),
      status
    });

    onUpdateShow(false);
    showSuccessToast('任务已新增');
  }

  function handleOpened() {
    form.resetFields();
  }

  return (
    <Popup
      coverScreen={false}
      round
      safeAreaInsetBottom
      className="h-[88%]"
      position="bottom"
      show={show}
      onOpened={handleOpened}
      onUpdateShow={onUpdateShow}
    >
      <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
        <Button
          color="muted"
          size="sm"
          variant="ghost"
          onPress={() => onUpdateShow(false)}
        >
          取消
        </Button>

        <Text
          size="lg"
          weight="semibold"
        >
          新增企业任务
        </Text>

        <Button
          size="sm"
          variant="ghost"
          onPress={() => form.submit()}
        >
          保存
        </Button>
      </View>

      <KeyboardAwareScrollView
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        className="flex-1 bg-muted"
        contentContainerClassName="gap-4 px-4 py-4"
      >
        <View className="gap-1 px-1">
          <Text
            size="base"
            weight="semibold"
          >
            任务信息
          </Text>

          <Text
            color="muted"
            size="xs"
          >
            填写后会立即加入列表，并同步刷新顶部统计。
          </Text>
        </View>

        <FieldGroup<FinanceTaskFormValues>
          form={form}
          gap={4}
          initialValues={INITIAL_VALUES}
          onFinish={handleFinish}
        >
          <CellGroup inset>
            <FormItem<FinanceTaskFormValues>
              required
              label="企业名称"
              labelAlign="top"
              name="companyName"
              rules={[
                { message: '请输入企业名称', required: true },
                { maxLength: 40, message: '企业名称最多 40 个字' }
              ]}
            >
              <Input
                clearable
                returnKeyType="next"
                variant="none"
                placeholder="例如：青禾餐饮管理有限公司"
              />
            </FormItem>

            <FormItem<FinanceTaskFormValues>
              required
              label="负责人"
              name="owner"
              rules={[
                { message: '请输入负责人', required: true },
                { maxLength: 20, message: '负责人最多 20 个字' }
              ]}
            >
              <Input
                clearable
                returnKeyType="done"
                variant="none"
                placeholder="请输入姓名"
              />
            </FormItem>

            <FormItem<FinanceTaskFormValues>
              required
              showArrow
              label="所属月份"
              name="month"
              trigger="onConfirm"
              onPress={() => setMonthShow(true)}
            >
              <DatePicker
                columnsType={['year', 'month']}
                show={monthShow}
                title="选择所属月份"
                onUpdateShow={setMonthShow}
              >
                {({ value }) => (
                  <PickedValue
                    placeholder="请选择"
                    value={formatMonthParts(value)}
                  />
                )}
              </DatePicker>
            </FormItem>

            <FormItem<FinanceTaskFormValues>
              required
              showArrow
              label="截止日期"
              name="dueDate"
              trigger="onConfirm"
              onPress={() => setDueDateShow(true)}
            >
              <DatePicker
                show={dueDateShow}
                title="选择截止日期"
                onUpdateShow={setDueDateShow}
              >
                {({ value }) => (
                  <PickedValue
                    placeholder="请选择"
                    value={formatDateParts(value)}
                  />
                )}
              </DatePicker>
            </FormItem>

            <FormItem<FinanceTaskFormValues>
              required
              showArrow
              label="当前状态"
              name="status"
              trigger="onConfirm"
              onPress={() => setStatusShow(true)}
            >
              <Picker
                columns={TASK_STATUS_OPTIONS}
                show={statusShow}
                title="选择任务状态"
                onUpdateShow={setStatusShow}
              >
                {({ value }) => (
                  <PickedValue
                    placeholder="请选择"
                    value={TASK_STATUS_META[value[0] as keyof typeof TASK_STATUS_META]?.label}
                  />
                )}
              </Picker>
            </FormItem>
          </CellGroup>
        </FieldGroup>
      </KeyboardAwareScrollView>
    </Popup>
  );
};
