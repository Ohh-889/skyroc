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
      color="var(--foreground)"
      name={name}
      size={ICON_SIZE}
    />
  );
}

/** 二维数组，行与行之间自动画分割线 */
const OPTIONS: ShareSheetOption[][] = [
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

const ShareSheetMultiRow = () => {
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
        options={OPTIONS}
        show={show}
        title="分享到"
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ShareSheetMultiRow };
