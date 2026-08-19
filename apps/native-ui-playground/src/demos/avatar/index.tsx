import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { AvatarBasic } from './AvatarBasic';
import { AvatarDynamicSource } from './AvatarDynamicSource';
import { AvatarFallback } from './AvatarFallback';
import { AvatarGroupBasic } from './AvatarGroupBasic';
import { AvatarGroupMax } from './AvatarGroupMax';
import { AvatarGroupOverflow } from './AvatarGroupOverflow';
import { AvatarGroupRing } from './AvatarGroupRing';
import { AvatarGroupSize } from './AvatarGroupSize';
import { AvatarImageProps } from './AvatarImageProps';
import { AvatarSize } from './AvatarSize';
import { AvatarStyles } from './AvatarStyles';

/** Avatar 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/avatar/AvatarSize" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const AvatarDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="src 展示图片；未提供图片时可使用 fallback。"
        title="基础用法（src / fallback）"
      >
        <AvatarBasic />
      </Section>

      <Section
        description="size 提供 xs 到 2xl 六档尺寸，fallback 字号同步变化。"
        title="尺寸（size）"
      >
        <AvatarSize />
      </Section>

      <Section
        description="空 src 与加载失败都会进入 fallback；不传 fallback 时使用 Image 的默认失败占位。"
        title="降级内容（fallback）"
      >
        <AvatarFallback />
      </Section>

      <Section
        description="imageProps 透传给内部 Image，可控制过渡、加载提示等图片行为。"
        title="底层图片属性（imageProps）"
      >
        <AvatarImageProps />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 可控制 fallback、文字和图片 slot。"
        title="样式覆盖（className / classNames）"
      >
        <AvatarStyles />
      </Section>

      <Section
        description="src 更新时会重置图片状态，坏图之后切回正常图片可恢复显示。"
        title="动态换图（src）"
      >
        <AvatarDynamicSource />
      </Section>

      <Section
        description="AvatarGroup 将头像横向叠放，并为相邻头像添加分隔描边。"
        title="头像组（AvatarGroup）"
      >
        <AvatarGroupBasic />
      </Section>

      <Section
        description="组级 size 会下发给子头像；子项显式 size 的优先级更高。"
        title="组尺寸（size）"
      >
        <AvatarGroupSize />
      </Section>

      <Section
        description="max 折叠超出项；max=0 展示全部；total 可声明未渲染的真实总人数。"
        title="数量折叠（max / total）"
      >
        <AvatarGroupMax />
      </Section>

      <Section
        description="overflowProps 可整体替换 +N 头像的内容和样式。"
        title="自定义溢出（overflowProps）"
      >
        <AvatarGroupOverflow />
      </Section>

      <Section
        description="头像组放在其他底色上时，用 classNames.ring 匹配所在容器。"
        title="非默认背景（classNames.ring）"
      >
        <AvatarGroupRing />
      </Section>
    </ScrollView>
  );
};

export { AvatarDemo };
