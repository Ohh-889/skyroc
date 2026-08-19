import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';
import { FloatingButtonAxis } from './FloatingButtonAxis';
import { FloatingButtonBasic } from './FloatingButtonBasic';
import { FloatingButtonDisabled } from './FloatingButtonDisabled';
import { FloatingButtonMagnetic } from './FloatingButtonMagnetic';
import { FloatingButtonSize } from './FloatingButtonSize';
import { FloatingButtonVisible } from './FloatingButtonVisible';

/**
 * FloatingButton 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/floating-button/FloatingButtonMagnetic"
 * />）， 所以这里只负责串场，不要把示例代码写回本文件。
 */
const FloatingButtonDemo = () => {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-4 pb-24"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-2 px-4 text-lg font-semibold">坐标系约定</Text>
        <Text className="mb-6 px-4 text-sm text-muted-foreground">
          边界按窗口尺寸计算，渲染却是相对父容器的 absolute。所以下面全部套了一层 Portal—— PortalHost
          铺满屏幕且原点与屏幕重合，位置才对得上。 直接放在有 NavBar 的页面里，按钮会整体下移一个 NavBar 的高度。
        </Text>

        <Text className="mb-2 px-4 text-lg font-semibold">基础用法</Text>
        <FloatingButtonBasic />

        <Text className="mb-2 px-4 text-lg font-semibold">自由拖拽</Text>
        <FloatingButtonAxis />

        <Text className="mb-2 px-4 text-lg font-semibold">边缘吸附</Text>
        <FloatingButtonMagnetic />

        <Text className="mb-2 px-4 text-lg font-semibold">显隐切换</Text>
        <FloatingButtonVisible />

        <Text className="mb-2 px-4 text-lg font-semibold">禁用</Text>
        <FloatingButtonDisabled />

        <Text className="mb-2 px-4 text-lg font-semibold">自定义尺寸与内容</Text>
        <FloatingButtonSize />
      </ScrollView>
    </View>
  );
};

export { FloatingButtonDemo };
