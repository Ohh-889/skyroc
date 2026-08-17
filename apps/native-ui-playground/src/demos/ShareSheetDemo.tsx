import AntDesign from '@expo/vector-icons/AntDesign';
import type { ShareSheetOption } from '@skyroc/native-ui';
import { Button, ShareSheet, Text, closeShareSheet, showShareSheet } from '@skyroc/native-ui';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 选项图标统一走 AntDesign，尺寸与 optionIcon 槽的 size-12 对齐 */
const ICON_SIZE = 22;

function renderIcon(name: ComponentProps<typeof AntDesign>['name']) {
  return (
    <AntDesign
      name={name}
      size={ICON_SIZE}
    />
  );
}

/** 基础示例：单行写法，onSelect 的 rowIndex 恒为 0 */
const BASIC_OPTIONS: ShareSheetOption[] = [
  { icon: renderIcon('wechat'), name: '微信', value: 'wechat' },
  { icon: renderIcon('weibo'), name: '微博', value: 'weibo' },
  { icon: renderIcon('qq'), name: 'QQ', value: 'qq' },
  { icon: renderIcon('link'), name: '复制链接', value: 'link' }
];

/** 多行示例：二维数组，行与行之间自动画分割线 */
const MULTI_ROW_OPTIONS: ShareSheetOption[][] = [
  [
    { icon: renderIcon('wechat'), name: '微信', value: 'wechat' },
    { icon: renderIcon('weibo'), name: '微博', value: 'weibo' },
    { icon: renderIcon('qq'), name: 'QQ', value: 'qq' },
    { icon: renderIcon('mail'), name: '邮件', value: 'mail' }
  ],
  [
    { icon: renderIcon('link'), name: '复制链接', value: 'link' },
    { icon: renderIcon('qrcode'), name: '二维码', value: 'qrcode' },
    { icon: renderIcon('star'), name: '收藏', value: 'star' },
    { icon: renderIcon('printer'), name: '打印', value: 'print' }
  ]
];

/** 描述信息示例 */
const DESCRIBED_OPTIONS: ShareSheetOption[] = [
  { description: '分享给好友', icon: renderIcon('wechat'), name: '微信', value: 'wechat' },
  { description: '公开可见', icon: renderIcon('weibo'), name: '微博', value: 'weibo' },
  { description: '有效期 7 天', icon: renderIcon('link'), name: '复制链接', value: 'link' }
];

const ShareSheetDemo = () => {
  const [basicShow, setBasicShow] = useState(false);
  const [multiRowShow, setMultiRowShow] = useState(false);
  const [describedShow, setDescribedShow] = useState(false);
  const [customShow, setCustomShow] = useState(false);
  const [lastResult, setLastResult] = useState('—');

  async function handleImperative() {
    const result = await showShareSheet({
      cancelText: '取消',
      description: '选中或取消后 Promise 都会结算，取消时得到 null',
      options: MULTI_ROW_OPTIONS,
      title: '命令式调用'
    });

    setLastResult(result ? `选中 ${result.option.value}（第 ${result.rowIndex} 行第 ${result.index} 项）` : '已取消');
  }

  function handleAutoClose() {
    showShareSheet({ options: BASIC_OPTIONS, title: '两秒后自动关闭' });

    // 外部关闭同样按取消结算，上面那个 Promise 不会挂死
    setTimeout(closeShareSheet, 2000);
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
        一维数组即单行，选项超出宽度可以横向滚动
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setBasicShow(true)}
        >
          立即分享
        </Button>

        <ShareSheet
          closeOnSelect
          cancelText="取消"
          options={BASIC_OPTIONS}
          show={basicShow}
          title="立即分享给好友"
          onUpdateShow={setBasicShow}
        />
      </View>

      {/* 多行展示 */}
      <Text className="mb-2 text-lg font-semibold">多行展示</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        二维数组按行渲染，onSelect 会带上行下标
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setMultiRowShow(true)}
        >
          打开面板
        </Button>

        <ShareSheet
          closeOnSelect
          cancelText="取消"
          options={MULTI_ROW_OPTIONS}
          show={multiRowShow}
          title="分享到"
          onUpdateShow={setMultiRowShow}
        />
      </View>

      {/* 描述信息 */}
      <Text className="mb-2 text-lg font-semibold">描述信息</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        选项名称下方可以再挂一行说明
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setDescribedShow(true)}
        >
          打开面板
        </Button>

        <ShareSheet
          closeOnSelect
          cancelText="取消"
          description="分享后对方可以直接查看"
          options={DESCRIBED_OPTIONS}
          show={describedShow}
          title="分享单张海报"
          onUpdateShow={setDescribedShow}
        />
      </View>

      {/* 自定义样式 */}
      <Text className="mb-2 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        classNames 覆盖各 slot，sheetClassNames 覆盖内部 Sheet
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setCustomShow(true)}
        >
          打开面板
        </Button>

        <ShareSheet
          closeOnSelect
          cancelText="再想想"
          classNames={{
            cancelName: 'text-primary',
            optionIcon: 'bg-primary/10',
            optionName: 'font-medium text-primary'
          }}
          options={BASIC_OPTIONS}
          sheetClassNames={{ title: 'text-primary' }}
          show={customShow}
          title="自定义样式"
          onUpdateShow={setCustomShow}
        />
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
          showShareSheet
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

export { ShareSheetDemo };
