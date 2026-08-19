import { Divider, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { DropdownMenuBasic } from './DropdownMenuBasic';
import { DropdownMenuControlled } from './DropdownMenuControlled';
import { DropdownMenuDirection } from './DropdownMenuDirection';
import { DropdownMenuDisabled } from './DropdownMenuDisabled';
import { DropdownMenuImperative } from './DropdownMenuImperative';
import { DropdownMenuMotion } from './DropdownMenuMotion';
import { DropdownMenuNoOverlay } from './DropdownMenuNoOverlay';
import { DropdownMenuScrollable } from './DropdownMenuScrollable';
import { DropdownMenuSelectBehavior } from './DropdownMenuSelectBehavior';
import { DropdownMenuStyles } from './DropdownMenuStyles';
import { DropdownMenuTitle } from './DropdownMenuTitle';

interface DropdownMenuSectionProps {
  /** 当前特性的示例内容 */
  children: ReactNode;

  /** 当前示例所聚焦 API 的简短说明 */
  description: string;

  /** 当前段落的堆叠层级，保证展开面板覆盖后续段落 */
  layerClassName: string;

  /** 当前特性标题 */
  title: string;
}

/** DropdownMenu 面板需要越过示例边界，因此段落容器不能裁剪溢出内容 */
const DropdownMenuSection = (props: DropdownMenuSectionProps) => {
  const { children, description, layerClassName, title } = props;

  return (
    <View className={`${layerClassName} relative mb-6 rounded-2xl border border-border bg-background`}>
      <View className="p-4">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted-foreground">{description}</Text>
      </View>
      <Divider />
      {children}
    </View>
  );
};

/**
 * DropdownMenu 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/dropdown-menu/DropdownMenuDisabled" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const DropdownMenuDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <DropdownMenuSection
        description="direction 默认为 down；设置为 up 后面板和箭头都改为向上展开。"
        layerClassName="z-[110]"
        title="展开方向（direction）"
      >
        <DropdownMenuDirection />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="items 定义菜单列与选项；defaultValues 设置各列初始值，未提供时回退到第一项。"
        layerClassName="z-[100]"
        title="基础用法（items / defaultValues）"
      >
        <DropdownMenuBasic />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="item.title 固定标题文本；省略时标题跟随当前选中项。"
        layerClassName="z-[90]"
        title="自定义标题（title）"
      >
        <DropdownMenuTitle />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="item.disabled 禁用整列，option.disabled 只禁用单个选项。"
        layerClassName="z-[80]"
        title="禁用状态（disabled）"
      >
        <DropdownMenuDisabled />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="maxHeight 限制面板高度，内容超出后在面板内部滚动。"
        layerClassName="z-[70]"
        title="滚动高度（maxHeight）"
      >
        <DropdownMenuScrollable />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="overlay 控制背景遮罩，showDivider 控制相邻选项之间的分隔线。"
        layerClassName="z-[60]"
        title="面板外观（overlay / showDivider）"
      >
        <DropdownMenuNoOverlay />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="closeOnSelect=false 让选择后保持展开；onSelect 返回列索引和完整选项。"
        layerClassName="z-[50]"
        title="选择行为（closeOnSelect / onSelect）"
      >
        <DropdownMenuSelectBehavior />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="values 与 onValuesChange 组成受控模式，外部状态是选中值的唯一来源。"
        layerClassName="z-[40]"
        title="受控模式（values / onValuesChange）"
      >
        <DropdownMenuControlled />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="ref.open 和 ref.close 从外部控制面板；onOpenChange 返回当前展开索引或 -1。"
        layerClassName="z-[30]"
        title="命令式控制（ref / onOpenChange）"
      >
        <DropdownMenuImperative />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="duration 设置展开动画时长；haptic=false 关闭标题和选项的轻触反馈。"
        layerClassName="z-[20]"
        title="动画与触感（duration / haptic）"
      >
        <DropdownMenuMotion />
      </DropdownMenuSection>

      <DropdownMenuSection
        description="className 覆盖根容器；classNames 可覆盖标题栏、选项、遮罩、图标等公开槽位。"
        layerClassName="z-10"
        title="样式覆盖（className / classNames）"
      >
        <DropdownMenuStyles />
      </DropdownMenuSection>
    </ScrollView>
  );
};

export { DropdownMenuDemo };
