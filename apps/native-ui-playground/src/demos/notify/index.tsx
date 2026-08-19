import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';
import { NotifyCustom } from './NotifyCustom';
import { NotifyDeclarative } from './NotifyDeclarative';
import { NotifyInteraction } from './NotifyInteraction';
import { NotifyLifecycle } from './NotifyLifecycle';
import { NotifyPositions } from './NotifyPositions';
import { NotifyTypes } from './NotifyTypes';

/** Notify 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const NotifyDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="py-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 类型 */}
      <Text className="mb-4 px-6 text-lg font-semibold">类型</Text>
      <View className="mb-4">
        <NotifyTypes />
      </View>

      {/* 位置 */}
      <Text className="mb-4 px-6 text-lg font-semibold">位置</Text>
      <View className="mb-4">
        <NotifyPositions />
      </View>

      {/* 交互 */}
      <Text className="mb-4 px-6 text-lg font-semibold">交互</Text>
      <View className="mb-4">
        <NotifyInteraction />
      </View>

      {/* 生命周期 */}
      <Text className="mb-4 px-6 text-lg font-semibold">生命周期</Text>
      <View className="mb-4">
        <NotifyLifecycle />
      </View>

      {/* 自定义 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义样式与内容</Text>
      <View className="mb-4">
        <NotifyCustom />
      </View>

      {/* 声明式 */}
      <Text className="mb-4 px-6 text-lg font-semibold">声明式用法</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        内联使用不贴边、也不补安全区，就是页面里的一条普通色块
      </Text>
      <View className="mb-4">
        <NotifyDeclarative />
      </View>
    </ScrollView>
  );
};

export { NotifyDemo };
