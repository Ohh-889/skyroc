import AntDesign from '@expo/vector-icons/AntDesign';
import type { ShareSheetOption } from '@skyroc/native-ui';
import { Button, ShareSheet } from '@skyroc/native-ui';
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

/** 单行写法，onSelect 的 rowIndex 恒为 0 */
const OPTIONS: ShareSheetOption[] = [
  { icon: renderIcon('wechat'), name: '微信', value: 'wechat' },
  { icon: renderIcon('weibo'), name: '微博', value: 'weibo' },
  { icon: renderIcon('qq'), name: 'QQ', value: 'qq' },
  { icon: renderIcon('link'), name: '复制链接', value: 'link' }
];

const ShareSheetBasic = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        立即分享
      </Button>

      <ShareSheet
        closeOnSelect
        cancelText="取消"
        options={OPTIONS}
        show={show}
        title="立即分享给好友"
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ShareSheetBasic };
