import AntDesign from '@expo/vector-icons/AntDesign';
import type { ActionSheetAction } from '@skyroc/native-ui';
import { ActionSheet, Button, Cell, Text, closeActionSheet, showActionSheet } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 基础示例的选项 */
const BASIC_ACTIONS: ActionSheetAction[] = [
  { name: '选项一', value: 'one' },
  { name: '选项二', value: 'two' },
  { name: '选项三', value: 'three' }
];

/** 状态示例的选项：禁用、加载、危险色各一 */
const STATUS_ACTIONS: ActionSheetAction[] = [
  { name: '正常选项', subname: '带描述信息', value: 'normal' },
  { disabled: true, name: '禁用选项', value: 'disabled' },
  { loading: true, name: '加载中选项', value: 'loading' },
  { color: '#ee0a24', name: '危险选项', value: 'danger' }
];

/** 按钮变体的选项，icon 只在 variant="button" 下渲染 */
const SHARE_ACTIONS: ActionSheetAction[] = [
  {
    icon: (
      <AntDesign
        name="wechat"
        size={18}
      />
    ),
    name: '微信',
    value: 'wechat'
  },
  {
    icon: (
      <AntDesign
        name="link"
        size={18}
      />
    ),
    name: '复制链接',
    value: 'link'
  },
  {
    icon: (
      <AntDesign
        name="star"
        size={18}
      />
    ),
    name: '收藏',
    value: 'star'
  }
];

const ActionSheetDemo = () => {
  const [basicShow, setBasicShow] = useState(false);
  const [statusShow, setStatusShow] = useState(false);
  const [shareShow, setShareShow] = useState(false);
  const [cityValue, setCityValue] = useState('');
  const [lastResult, setLastResult] = useState('—');

  async function handleImperative() {
    const result = await showActionSheet({
      actions: BASIC_ACTIONS,
      cancelText: '取消',
      description: '选中或取消后 Promise 都会结算，取消时得到 null',
      title: '命令式调用'
    });

    setLastResult(result ? `选中 ${result.action.value}（第 ${result.index} 项）` : '已取消');
  }

  function handleAutoClose() {
    showActionSheet({ actions: BASIC_ACTIONS, title: '两秒后自动关闭' });

    // 外部关闭同样按取消结算，上面那个 Promise 不会挂死
    setTimeout(closeActionSheet, 2000);
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-2 text-lg font-semibold">基础用法</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        点击选项后自动关闭，取消按钮与遮罩都能收起面板
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setBasicShow(true)}
        >
          打开面板
        </Button>

        <ActionSheet
          closeOnClickAction
          actions={BASIC_ACTIONS}
          cancelText="取消"
          show={basicShow}
          title="基础用法"
          onUpdateShow={setBasicShow}
        />
      </View>

      {/* 选项状态 */}
      <Text className="mb-2 text-lg font-semibold">选项状态</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        描述信息、禁用、加载中、自定义颜色
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setStatusShow(true)}
        >
          打开面板
        </Button>

        <ActionSheet
          actions={STATUS_ACTIONS}
          cancelText="取消"
          description="禁用与加载中的选项点不动"
          show={statusShow}
          title="选项状态"
          onUpdateShow={setStatusShow}
        />
      </View>

      {/* 按钮变体 */}
      <Text className="mb-2 text-lg font-semibold">按钮变体</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        variant="button" 渲染成卡片，只有这个变体会显示 icon
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setShareShow(true)}
        >
          分享到
        </Button>

        <ActionSheet
          closeOnClickAction
          actions={SHARE_ACTIONS}
          cancelText="取消"
          show={shareShow}
          title="分享到"
          variant="button"
          onUpdateShow={setShareShow}
        />
      </View>

      {/* 选中态与 render prop */}
      <Text className="mb-2 text-lg font-semibold">选中态与 render prop</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        children 拿到的是选中的 action 本身，展示什么由调用方决定
      </Text>
      <View className="mb-8">
        <ActionSheet
          closeOnClickAction
          actions={BASIC_ACTIONS}
          cancelText="取消"
          title="选择城市"
          value={cityValue}
          onChange={setCityValue}
        >
          {args => (
            <Cell
              showArrow
              title="城市"
              trailing={args.action?.name ?? '请选择'}
              onPress={args.toggle}
            />
          )}
        </ActionSheet>
      </View>

      {/* 命令式调用 */}
      <Text className="mb-2 text-lg font-semibold">命令式调用</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        上次结果：{lastResult}
      </Text>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={handleImperative}
        >
          showActionSheet
        </Button>

        <Button
          variant="outline"
          onPress={handleAutoClose}
        >
          两秒后自动关闭
        </Button>
      </View>
    </ScrollView>
  );
};

export { ActionSheetDemo };
