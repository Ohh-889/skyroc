import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';
import { ToastCustom } from './ToastCustom';
import { ToastDeclarative } from './ToastDeclarative';
import { ToastInteraction } from './ToastInteraction';
import { ToastLifecycle } from './ToastLifecycle';
import { ToastPositions } from './ToastPositions';
import { ToastTypes } from './ToastTypes';

/** Toast 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const ToastDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="py-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 类型 */}
      <Text className="mb-4 px-6 text-lg font-semibold">类型</Text>
      <View className="mb-4">
        <ToastTypes />
      </View>

      {/* 位置 */}
      <Text className="mb-4 px-6 text-lg font-semibold">位置</Text>
      <View className="mb-4">
        <ToastPositions />
      </View>

      {/* 交互 */}
      <Text className="mb-4 px-6 text-lg font-semibold">交互</Text>
      <View className="mb-4">
        <ToastInteraction />
      </View>

      {/* 生命周期 */}
      <Text className="mb-4 px-6 text-lg font-semibold">生命周期</Text>
      <View className="mb-4">
        <ToastLifecycle />
      </View>

      {/* 自定义 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义图标与样式</Text>
      <View className="mb-4">
        <ToastCustom />
      </View>

      {/* 声明式 */}
      <Text className="mb-4 px-6 text-lg font-semibold">声明式用法</Text>
      <View className="mb-4">
        <ToastDeclarative />
      </View>
    </ScrollView>
  );
};

export { ToastDemo };
