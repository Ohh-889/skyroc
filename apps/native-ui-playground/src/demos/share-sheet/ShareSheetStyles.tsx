import AntDesign from '@expo/vector-icons/AntDesign';
import type { ShareSheetOption } from '@skyroc/native-ui';
import { Button, ShareSheet, Text } from '@skyroc/native-ui';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { View } from 'react-native';

/** 选项图标统一走 AntDesign，尺寸与 optionIcon 槽的 size-12 对齐 */
const ICON_SIZE = 22;

function renderIcon(name: ComponentProps<typeof AntDesign>['name']) {
  return (
    <AntDesign
      color="var(--foreground)"
      name={name}
      size={ICON_SIZE}
    />
  );
}

const OPTIONS: ShareSheetOption[] = [
  {
    className: 'rounded-xl bg-primary/5 py-2',
    description: <Text className="text-xs text-success">常用</Text>,
    icon: renderIcon('wechat'),
    name: <Text className="mt-2 text-xs font-semibold text-primary">微信</Text>,
    value: 'wechat'
  },
  { icon: renderIcon('weibo'), name: '微博', value: 'weibo' },
  { icon: renderIcon('qq'), name: 'QQ', value: 'qq' },
  { icon: renderIcon('link'), name: '复制链接', value: 'link' }
];

const ShareSheetStyles = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        打开面板
      </Button>

      <ShareSheet
        closeOnSelect
        cancelText="再想想"
        className="bg-primary/5"
        classNames={{
          cancelName: 'text-primary',
          optionIcon: 'bg-primary/10',
          optionName: 'font-medium text-primary'
        }}
        options={OPTIONS}
        sheetClassName="border border-primary/20"
        sheetClassNames={{ title: 'text-primary' }}
        show={show}
        title="自定义样式"
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ShareSheetStyles };
