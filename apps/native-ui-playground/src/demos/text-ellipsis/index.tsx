import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';
import { TextEllipsisBasic } from './TextEllipsisBasic';
import { TextEllipsisContent } from './TextEllipsisContent';
import { TextEllipsisControlled } from './TextEllipsisControlled';
import { TextEllipsisDots } from './TextEllipsisDots';
import { TextEllipsisEmoji } from './TextEllipsisEmoji';
import { TextEllipsisExpand } from './TextEllipsisExpand';
import { TextEllipsisImperative } from './TextEllipsisImperative';
import { TextEllipsisNoOverflow } from './TextEllipsisNoOverflow';
import { TextEllipsisRows } from './TextEllipsisRows';
import { TextEllipsisStyles } from './TextEllipsisStyles';

/** TextEllipsis 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const TextEllipsisDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="py-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 px-6 text-lg font-semibold">基础用法</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        不给操作文本时不做裁剪，直接用原生尾部省略号
      </Text>
      <View className="mb-4">
        <TextEllipsisBasic />
      </View>

      {/* 展开与收起 */}
      <Text className="mb-4 px-6 text-lg font-semibold">展开与收起</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        省略号与操作文本内联在末行尾部，不会另起一行
      </Text>
      <View className="mb-4">
        <TextEllipsisExpand />
      </View>

      {/* 自定义省略号 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义省略号</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        dots 只在有操作文本、需要内联渲染时生效
      </Text>
      <View className="mb-4">
        <TextEllipsisDots />
      </View>

      {/* 不该出现操作入口的情况 */}
      <Text className="mb-4 px-6 text-lg font-semibold">不该出现操作入口</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        文本没有溢出时不显示「展开」，也不该多出省略号
      </Text>
      <View className="mb-4">
        <TextEllipsisNoOverflow />
      </View>

      {/* 动态行数 */}
      <Text className="mb-4 px-6 text-lg font-semibold">动态行数</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        改 rows 之后应重新测量并回到收起态
      </Text>
      <View className="mb-4">
        <TextEllipsisRows />
      </View>

      {/* 动态内容 */}
      <Text className="mb-4 px-6 text-lg font-semibold">动态内容</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        长文本换成短文本后，「展开」与省略号都应该消失
      </Text>
      <View className="mb-4">
        <TextEllipsisContent />
      </View>

      {/* 受控用法 */}
      <Text className="mb-4 px-6 text-lg font-semibold">受控用法</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        expanded 受控时，点击文末操作与外部按钮结果一致
      </Text>
      <View className="mb-4">
        <TextEllipsisControlled />
      </View>

      {/* 命令式控制 */}
      <Text className="mb-4 px-6 text-lg font-semibold">命令式控制</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        ref.toggle 传 true / false 指定状态，不传则取反
      </Text>
      <View className="mb-4">
        <TextEllipsisImperative />
      </View>

      {/* 自定义样式 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        className 覆盖根容器，classNames 细粒度覆盖各 slot
      </Text>
      <View className="mb-4">
        <TextEllipsisStyles />
      </View>

      {/* 表情文本 */}
      <Text className="mb-4 px-6 text-lg font-semibold">表情文本</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        二分按码点切分，不该出现半个表情或方块字符
      </Text>
      <View className="mb-4">
        <TextEllipsisEmoji />
      </View>
    </ScrollView>
  );
};

export { TextEllipsisDemo };
