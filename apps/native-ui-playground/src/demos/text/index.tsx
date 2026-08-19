import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';
import { TextBasic } from './TextBasic';
import { TextColor } from './TextColor';
import { TextCombination } from './TextCombination';
import { TextNativeProps } from './TextNativeProps';
import { TextSize } from './TextSize';
import { TextStyles } from './TextStyles';
import { TextWeight } from './TextWeight';

/** Text 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const TextDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8">
        <TextBasic />
      </View>

      {/* 字号 */}
      <Text className="mb-4 text-lg font-semibold">字号</Text>
      <Text className="mb-3 text-sm text-muted-foreground">从 4xs 到 4xl 共十二档字号</Text>
      <View className="mb-8">
        <TextSize />
      </View>

      {/* 字重 */}
      <Text className="mb-4 text-lg font-semibold">字重</Text>
      <View className="mb-8">
        <TextWeight />
      </View>

      {/* 语义色 */}
      <Text className="mb-4 text-lg font-semibold">语义色</Text>
      <Text className="mb-3 text-sm text-muted-foreground">颜色随当前主题自动切换</Text>
      <View className="mb-8">
        <TextColor />
      </View>

      {/* 组合变体 */}
      <Text className="mb-4 text-lg font-semibold">组合变体</Text>
      <Text className="mb-3 text-sm text-muted-foreground">size、weight 与 color 可以组合使用</Text>
      <View className="mb-8">
        <TextCombination />
      </View>

      {/* className 覆盖 */}
      <Text className="mb-4 text-lg font-semibold">自定义样式</Text>
      <Text className="mb-3 text-sm text-muted-foreground">className 的优先级高于变体属性</Text>
      <View className="mb-8">
        <TextStyles />
      </View>

      {/* React Native Text 属性 */}
      <Text className="mb-4 text-lg font-semibold">原生文字属性</Text>
      <Text className="mb-3 text-sm text-muted-foreground">支持 numberOfLines 等 React Native Text 属性</Text>
      <View className="mb-8">
        <TextNativeProps />
      </View>
    </ScrollView>
  );
};

export { TextDemo };
