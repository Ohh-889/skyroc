import { Text } from '@skyroc/native-ui';
import { ScrollView } from 'react-native';
import { SwipeCellBasic } from './SwipeCellBasic';
import { SwipeCellBeforeClose } from './SwipeCellBeforeClose';
import { SwipeCellDisabled } from './SwipeCellDisabled';
import { SwipeCellEvents } from './SwipeCellEvents';
import { SwipeCellImperative } from './SwipeCellImperative';
import { SwipeCellWidth } from './SwipeCellWidth';

/**
 * SwipeCell 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/swipe-cell/SwipeCellBeforeClose" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const SwipeCellDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-3 mt-4 px-4 text-lg font-semibold">基础用法</Text>
      <SwipeCellBasic />

      {/* Before Close */}
      <Text className="mb-1 mt-6 px-4 text-lg font-semibold">关闭拦截</Text>
      <Text className="mb-3 px-4 text-sm text-muted-foreground">
        滑动收起、点击内容区、下方「关闭」按钮三条路径都会先弹确认。选「取消」时操作区一直停在展开位不动，不是先关掉再弹回来；选「确定」后才开始收起动画。
        展开动作不受拦截。
      </Text>
      <SwipeCellBeforeClose />

      {/* Custom Width */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">自定义宽度</Text>
      <SwipeCellWidth />

      {/* Disabled */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">禁用滑动</Text>
      <SwipeCellDisabled />

      {/* Programmatic Control */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">编程式控制</Text>
      <SwipeCellImperative />

      {/* Events */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">事件监听</Text>
      <SwipeCellEvents />
    </ScrollView>
  );
};

export { SwipeCellDemo };
