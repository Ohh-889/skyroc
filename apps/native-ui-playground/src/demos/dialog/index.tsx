import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';
import { DialogBasic } from './DialogBasic';
import { DialogCloseMode } from './DialogCloseMode';
import { DialogDeclarative } from './DialogDeclarative';
import { DialogInput } from './DialogInput';
import { DialogStyles } from './DialogStyles';
import { DialogTheme } from './DialogTheme';

/** Dialog 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/dialog/DialogTheme" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const DialogDemo = () => {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-6 pb-20"
        showsVerticalScrollIndicator={false}
      >
        {/* 基础用法 */}
        <Text className="mb-4 px-6 text-lg font-semibold">基础用法</Text>
        <DialogBasic />

        {/* 输入与拦截 */}
        <Text className="mb-4 px-6 text-lg font-semibold">输入与拦截</Text>
        <DialogInput />

        {/* 主题 */}
        <Text className="mb-4 px-6 text-lg font-semibold">主题</Text>
        <DialogTheme />

        {/* 关闭方式 */}
        <Text className="mb-4 px-6 text-lg font-semibold">关闭方式</Text>
        <DialogCloseMode />

        {/* 自定义样式 */}
        <Text className="mb-4 px-6 text-lg font-semibold">自定义样式</Text>
        <DialogStyles />

        {/* 声明式 */}
        <Text className="mb-4 px-6 text-lg font-semibold">声明式用法</Text>
        <DialogDeclarative />
      </ScrollView>
    </View>
  );
};

export { DialogDemo };
