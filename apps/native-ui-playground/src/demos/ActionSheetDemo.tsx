import type { ActionSheetAction } from '@skyroc/native-ui';
import { ActionSheet, Button, Cell, Divider, Text, closeActionSheet, showActionSheet } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const BASIC_ACTIONS: ActionSheetAction[] = [
  { name: '选项一', value: 'one' },
  { name: '选项二', value: 'two' },
  { name: '选项三', value: 'three' }
];

const STATUS_ACTIONS: ActionSheetAction[] = [
  { name: '正常选项', subname: 'subname 可补充操作说明', value: 'normal' },
  { disabled: true, name: '禁用选项', subname: 'disabled=true', value: 'disabled' },
  { loading: true, name: '加载中选项', value: 'loading' },
  { color: 'var(--destructive)', name: '危险操作', subname: '使用 destructive 语义色', value: 'danger' }
];

const BUTTON_ACTIONS: ActionSheetAction[] = [
  {
    icon: (
      <View className="size-8 items-center justify-center rounded-full bg-success/15">
        <Text className="font-semibold text-success">微</Text>
      </View>
    ),
    name: '微信',
    value: 'wechat'
  },
  {
    icon: (
      <View className="size-8 items-center justify-center rounded-full bg-primary/15">
        <Text className="font-semibold text-primary">链</Text>
      </View>
    ),
    name: '复制链接',
    value: 'link'
  },
  {
    icon: (
      <View className="size-8 items-center justify-center rounded-full bg-warning/15">
        <Text className="font-semibold text-warning">★</Text>
      </View>
    ),
    name: '收藏',
    value: 'star'
  }
];

const ActionSheetDemo = () => {
  const [basicShow, setBasicShow] = useState(false);
  const [basicResult, setBasicResult] = useState('尚未操作');
  const [basicClosedCount, setBasicClosedCount] = useState(0);
  const [statusShow, setStatusShow] = useState(false);
  const [buttonShow, setButtonShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [lockedShow, setLockedShow] = useState(false);
  const [customShow, setCustomShow] = useState(false);
  const [lastResult, setLastResult] = useState('尚未调用');

  function handleBasicSelect(action: ActionSheetAction, index: number) {
    setBasicResult(`选中 ${action.name}（索引 ${index}）`);
  }

  async function handleImperative() {
    const result = await showActionSheet({
      actions: BASIC_ACTIONS,
      cancelText: '取消',
      description: '选中返回 action 与 index，取消返回 null',
      title: '命令式调用'
    });

    setLastResult(result ? `选中 ${result.action.value}（索引 ${result.index}）` : '已取消');
  }

  function handleAutoClose() {
    showActionSheet({
      actions: BASIC_ACTIONS,
      description: '面板将在两秒后由 closeActionSheet 关闭',
      title: '外部关闭'
    });

    setTimeout(closeActionSheet, 2000);
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="actions 定义选项；defaultValue 设置初始选中项，选择或取消后自动关闭。"
        title="基础用法（actions / defaultValue）"
      >
        <View className="gap-3 p-4">
          <Button
            variant="tonal"
            onPress={() => setBasicShow(true)}
          >
            打开基础面板
          </Button>
          <Text className="text-sm text-muted-foreground">结果：{basicResult}</Text>
          <Text className="text-sm text-muted-foreground">已完成关闭动画：{basicClosedCount} 次</Text>
        </View>

        <ActionSheet
          closeOnClickAction
          actions={BASIC_ACTIONS}
          cancelText="取消"
          defaultValue="two"
          description="默认选中“选项二”"
          show={basicShow}
          title="请选择"
          onCancel={() => setBasicResult('已取消')}
          onClosed={() => setBasicClosedCount(count => count + 1)}
          onSelect={handleBasicSelect}
          onUpdateShow={setBasicShow}
        />
      </Section>

      <Section
        description="单个 action 支持 subname、disabled、loading 和 color。"
        title="选项状态（ActionSheetAction）"
      >
        <View className="p-4">
          <Button
            variant="tonal"
            onPress={() => setStatusShow(true)}
          >
            查看选项状态
          </Button>
        </View>

        <ActionSheet
          closeOnClickAction
          actions={STATUS_ACTIONS}
          cancelText="取消"
          description="禁用与加载中的选项不可点击"
          show={statusShow}
          title="选项状态"
          onUpdateShow={setStatusShow}
        />
      </Section>

      <Section
        description="variant=button 使用卡片式操作项，并渲染 action.icon。"
        title="按钮变体（variant / icon）"
      >
        <View className="p-4">
          <Button
            variant="tonal"
            onPress={() => setButtonShow(true)}
          >
            打开按钮面板
          </Button>
        </View>

        <ActionSheet
          closeOnClickAction
          actions={BUTTON_ACTIONS}
          cancelText="取消"
          show={buttonShow}
          title="分享到"
          variant="button"
          onUpdateShow={setButtonShow}
        />
      </Section>

      <Section
        description="value 与 onChange 控制选中值；children render prop 提供 action、value 和 toggle。"
        title="受控选择（value / children）"
      >
        <View className="p-4">
          <ActionSheet
            closeOnClickAction
            actions={BASIC_ACTIONS}
            cancelText="取消"
            title="选择城市"
            value={selectedValue}
            onChange={setSelectedValue}
          >
            {args => (
              <Cell
                showArrow
                classNames={{ root: 'rounded-xl border border-border' }}
                title="当前选项"
                trailing={args.action?.name ?? '请选择'}
                onPress={args.toggle}
              />
            )}
          </ActionSheet>
        </View>
      </Section>

      <Section
        description="关闭遮罩、下拉和顶部按钮后，面板只能通过选项或底部取消按钮退出。"
        title="关闭行为（closeable / closeOnBackdropPress）"
      >
        <View className="p-4">
          <Button
            variant="tonal"
            onPress={() => setLockedShow(true)}
          >
            打开受限面板
          </Button>
        </View>

        <ActionSheet
          closeOnClickAction
          actions={BASIC_ACTIONS}
          cancelText="关闭面板"
          closeOnBackdropPress={false}
          closeable={false}
          enablePanDownToClose={false}
          show={lockedShow}
          showHandle={false}
          title="受限关闭"
          onUpdateShow={setLockedShow}
        />
      </Section>

      <Section
        description="classNames 控制操作列表 slot，sheetClassNames 控制内部 Sheet。"
        title="样式覆盖（classNames / sheetClassNames）"
      >
        <View className="p-4">
          <Button
            variant="tonal"
            onPress={() => setCustomShow(true)}
          >
            打开自定义面板
          </Button>
        </View>

        <ActionSheet
          closeOnClickAction
          actions={BASIC_ACTIONS}
          cancelText="再想想"
          classNames={{
            actionName: 'font-medium',
            cancelName: 'text-primary',
            root: 'bg-primary/5'
          }}
          sheetClassNames={{ title: 'text-primary' }}
          show={customShow}
          title="自定义样式"
          onUpdateShow={setCustomShow}
        />
      </Section>

      <Section
        description="showActionSheet 返回选择结果；closeActionSheet 可从外部关闭当前面板。"
        title="命令式调用（showActionSheet）"
      >
        <View className="gap-3 p-4">
          <Text className="text-sm text-muted-foreground">上次结果：{lastResult}</Text>
          <View className="flex-row flex-wrap gap-3">
            <Button
              className="min-w-32 flex-1"
              variant="tonal"
              onPress={handleImperative}
            >
              等待选择结果
            </Button>
            <Button
              className="min-w-32 flex-1"
              variant="outline"
              onPress={handleAutoClose}
            >
              两秒后关闭
            </Button>
          </View>
        </View>
      </Section>
    </ScrollView>
  );
};

interface SectionProps {
  /** 当前特性的示例内容 */
  children: ReactNode;

  /** 当前示例所聚焦 API 的简短说明 */
  description: string;

  /** 当前特性标题 */
  title: string;
}

const Section = (props: SectionProps) => {
  const { children, description, title } = props;

  return (
    <View className="mb-6 overflow-hidden rounded-2xl border border-border bg-background">
      <View className="p-4">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted-foreground">{description}</Text>
      </View>
      <Divider />
      {children}
    </View>
  );
};

export { ActionSheetDemo };
