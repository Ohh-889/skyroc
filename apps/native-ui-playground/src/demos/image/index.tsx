import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { ImageBasic } from './ImageBasic';
import { ImageContentFit } from './ImageContentFit';
import { ImageCustomSlots } from './ImageCustomSlots';
import { ImageError } from './ImageError';
import { ImageRadius } from './ImageRadius';
import { ImageRichSource } from './ImageRichSource';
import { ImageSlotClassNames } from './ImageSlotClassNames';
import { ImageSwitchSource } from './ImageSwitchSource';

/** Image 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/image/ImageRadius" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const ImageDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="尺寸给在 className 上，图片铺满容器。"
        title="基础用法（src）"
      >
        <ImageBasic />
      </Section>

      <Section
        description="radius 提供 none 到 full 六档圆角。"
        title="圆角（radius）"
      >
        <ImageRadius />
      </Section>

      <Section
        description="走 expo-image 原生的 contentFit，不额外包一层变体。"
        title="填充方式（contentFit）"
      >
        <ImageContentFit />
      </Section>

      <Section
        description="加载失败默认渲染内置破损图标，showError={false} 可关闭。"
        title="失败占位（showError）"
      >
        <ImageError />
      </Section>

      <Section
        description="errorSlot 和 loadingSlot 可整体替换失败与加载中的内容。"
        title="自定义占位（errorSlot / loadingSlot）"
      >
        <ImageCustomSlots />
      </Section>

      <Section
        description="classNames 按 slot 覆盖错误容器、指示器和图片本身。"
        title="插槽样式（classNames）"
      >
        <ImageSlotClassNames />
      </Section>

      <Section
        description="src 变化时加载态重置，不会残留上一张的失败占位。"
        title="动态换图（src）"
      >
        <ImageSwitchSource />
      </Section>

      <Section
        description="src 透传 expo-image 的完整 source 能力：多分辨率数组、blurhash 占位等。"
        title="完整图源（src / placeholder）"
      >
        <ImageRichSource />
      </Section>
    </ScrollView>
  );
};

export { ImageDemo };
