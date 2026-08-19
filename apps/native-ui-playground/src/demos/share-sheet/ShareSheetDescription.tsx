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

/** 选项名称下方再挂一行说明 */
const OPTIONS: ShareSheetOption[] = [
  { description: '分享给好友', icon: renderIcon('wechat'), name: '微信', value: 'wechat' },
  { description: '公开可见', icon: renderIcon('weibo'), name: '微博', value: 'weibo' },
  { description: '有效期 7 天', icon: renderIcon('link'), name: '复制链接', value: 'link' }
];

const ShareSheetDescription = () => {
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
        cancelText="取消"
        description="分享后对方可以直接查看"
        options={OPTIONS}
        show={show}
        title="分享单张海报"
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ShareSheetDescription };
