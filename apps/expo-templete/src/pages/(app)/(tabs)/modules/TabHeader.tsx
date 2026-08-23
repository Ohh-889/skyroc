import { Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { View } from 'react-native';

/** TabHeader 组件属性 */
export interface TabHeaderProps {
  /** 右侧操作区，放铃铛、「全部已读」这类按钮 */
  action?: ReactNode;

  /** 标题下的一行说明 */
  subtitle?: ReactNode;

  title: string;
}

/**
 * Tab 根页面的头部。
 *
 * 和二级页的 `NavBar` 不是一回事，所以没有复用：tab 根页永远没有返回箭头，标题左对齐、字号更大， 是 iOS large title 那一路的排版。硬套 NavBar 只会得到一个左边空一块的居中标题。
 *
 * 安全区自己吃（`pt-safe-offset-*`）——`(app)` 整组关掉了原生 header，没人替页面留出状态栏。
 */
export const TabHeader = (props: TabHeaderProps) => {
  const { action, subtitle, title } = props;

  return (
    <View className="flex-row items-center justify-between gap-3 px-4 pb-3 pt-safe-offset-2">
      <View className="flex-1 gap-0.5">
        <Text
          size="2xl"
          weight="bold"
        >
          {title}
        </Text>

        {subtitle}
      </View>

      {action}
    </View>
  );
};
