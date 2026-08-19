import AntDesign from '@expo/vector-icons/AntDesign';
import type { ShareSheetOption } from '@skyroc/native-ui';
import { Button, Text, closeShareSheet, showShareSheet } from '@skyroc/native-ui';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { View } from 'react-native';

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

const SINGLE_ROW_OPTIONS: ShareSheetOption[] = [
  { icon: renderIcon('wechat'), name: '微信', value: 'wechat' },
  { icon: renderIcon('weibo'), name: '微博', value: 'weibo' },
  { icon: renderIcon('qq'), name: 'QQ', value: 'qq' },
  { icon: renderIcon('link'), name: '复制链接', value: 'link' }
];

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

const ShareSheetImperative = () => {
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
    showShareSheet({ options: SINGLE_ROW_OPTIONS, title: '两秒后自动关闭' });

    // 外部关闭同样按取消结算，上面那个 Promise 不会挂死
    setTimeout(closeShareSheet, 2000);
  }

  return (
    <View className="gap-3 bg-background p-4">
      <Text color="muted">上次结果：{lastResult}</Text>

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
    </View>
  );
};

export { ShareSheetImperative };
