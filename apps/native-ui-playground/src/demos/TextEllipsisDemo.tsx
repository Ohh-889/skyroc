import { Button, Text, TextEllipsis } from '@skyroc/native-ui';
import type { TextEllipsisRef } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

const LONG_TEXT =
  '在南方的冬天，屋檐下的水滴会沿着瓦片的边缘缓慢聚拢，最后落进院子里那口积满青苔的水缸，一整个下午都是这样重复的声音。他坐在门槛上看着，觉得时间被拉得很长，长到足以把一件小事想上很多遍。';

const SHORT_TEXT = '一行放得下的短文本。';

/** 用来验证「恰好占满一行」不该被判定为截断 */
const EXACT_TEXT = '恰好一行';

const EMOJI_TEXT =
  '🎉🎊✨🌟💫⭐️🌙☀️🌈🍀🌸🌺🌻🌼🌷💐🍎🍊🍋🍌🍉🍇🍓🫐🥝🍒🍑🥭🍍🥥 后面跟着一段普通文字，用来确认二分裁剪不会把表情截成半个字符。';

const ROWS_OPTIONS = [1, 2, 3];

const TextEllipsisDemo = () => {
  const [rows, setRows] = useState(2);
  const [content, setContent] = useState(LONG_TEXT);
  const [controlledExpanded, setControlledExpanded] = useState(false);

  const manualRef = useRef<TextEllipsisRef>(null);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        不给操作文本时不做裁剪，直接用原生尾部省略号
      </Text>
      <View className="mb-8 gap-3">
        <TextEllipsis content={LONG_TEXT} />
        <TextEllipsis
          content={LONG_TEXT}
          rows={3}
        />
      </View>

      {/* 展开与收起 */}
      <Text className="mb-4 text-lg font-semibold">展开与收起</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        省略号与操作文本内联在末行尾部，不会另起一行
      </Text>
      <View className="mb-8 gap-4">
        <TextEllipsis
          collapseText="收起"
          content={LONG_TEXT}
          expandText="展开"
        />
        <TextEllipsis
          collapseText=" 收起"
          content={LONG_TEXT}
          expandText=" 展开"
          rows={3}
        />
        {/* 不给 collapseText，展开后就没有收起入口 */}
        <TextEllipsis
          content={LONG_TEXT}
          expandText="更多"
        />
      </View>

      {/* 自定义省略号 */}
      <Text className="mb-4 text-lg font-semibold">自定义省略号</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        dots 只在有操作文本、需要内联渲染时生效
      </Text>
      <View className="mb-8 gap-3">
        <TextEllipsis
          collapseText="收起"
          content={LONG_TEXT}
          dots="…… "
          expandText="展开"
          rows={2}
        />
        <TextEllipsis
          collapseText=" 收起"
          content={LONG_TEXT}
          dots=" ——"
          expandText=" 展开"
          rows={2}
        />
      </View>

      {/* 不该出现操作入口的情况 */}
      <Text className="mb-4 text-lg font-semibold">不该出现操作入口</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        文本没有溢出时不显示「展开」，也不该多出省略号
      </Text>
      <View className="mb-8 gap-3">
        <TextEllipsis
          collapseText="收起"
          content={SHORT_TEXT}
          expandText="展开"
        />
        {/* 恰好占满一行：靠 lines.length >= rows 判断截断的实现会在这里误判 */}
        <TextEllipsis
          collapseText="收起"
          content={EXACT_TEXT}
          expandText="展开"
        />
      </View>

      {/* 动态行数 */}
      <Text className="mb-4 text-lg font-semibold">动态行数</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        改 rows 之后应重新测量并回到收起态
      </Text>
      <View className="mb-4">
        <TextEllipsis
          collapseText=" 收起"
          content={LONG_TEXT}
          expandText=" 展开"
          rows={rows}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {ROWS_OPTIONS.map(item => (
          <Button
            key={item}
            variant={item === rows ? 'solid' : 'tonal'}
            onPress={() => setRows(item)}
          >
            {`${item} 行`}
          </Button>
        ))}
      </View>

      {/* 动态内容 */}
      <Text className="mb-4 text-lg font-semibold">动态内容</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        长文本换成短文本后，「展开」与省略号都应该消失
      </Text>
      <View className="mb-4">
        <TextEllipsis
          collapseText=" 收起"
          content={content}
          expandText=" 展开"
          rows={2}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant={content === LONG_TEXT ? 'solid' : 'tonal'}
          onPress={() => setContent(LONG_TEXT)}
        >
          长文本
        </Button>
        <Button
          variant={content === SHORT_TEXT ? 'solid' : 'tonal'}
          onPress={() => setContent(SHORT_TEXT)}
        >
          短文本
        </Button>
      </View>

      {/* 受控用法 */}
      <Text className="mb-4 text-lg font-semibold">受控用法</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        expanded 受控时，点击文末操作与外部按钮结果一致
      </Text>
      <View className="mb-4">
        <TextEllipsis
          collapseText=" 收起"
          content={LONG_TEXT}
          expandText=" 展开"
          expanded={controlledExpanded}
          rows={2}
          onExpandedChange={setControlledExpanded}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setControlledExpanded(prev => !prev)}
        >
          {controlledExpanded ? '外部收起' : '外部展开'}
        </Button>
        <Text color="muted">expanded：{String(controlledExpanded)}</Text>
      </View>

      {/* 命令式控制 */}
      <Text className="mb-4 text-lg font-semibold">命令式控制</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        ref.toggle 传 true / false 指定状态，不传则取反
      </Text>
      <View className="mb-4">
        <TextEllipsis
          collapseText=" 收起"
          content={LONG_TEXT}
          expandText=" 展开"
          ref={manualRef}
          rows={2}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => manualRef.current?.toggle(true)}
        >
          展开
        </Button>
        <Button
          variant="tonal"
          onPress={() => manualRef.current?.toggle(false)}
        >
          收起
        </Button>
        <Button
          variant="outline"
          onPress={() => manualRef.current?.toggle()}
        >
          切换
        </Button>
      </View>

      {/* 自定义样式 */}
      <Text className="mb-4 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        className 覆盖根容器，classNames 细粒度覆盖各 slot
      </Text>
      <View className="mb-8 gap-4">
        <TextEllipsis
          className="rounded-lg bg-secondary p-3"
          collapseText=" 收起"
          content={LONG_TEXT}
          expandText=" 展开"
          rows={2}
        />
        <TextEllipsis
          classNames={{
            action: 'font-semibold text-warning',
            root: 'rounded-lg border border-border p-3',
            text: 'text-muted-foreground'
          }}
          collapseText=" 收起"
          content={LONG_TEXT}
          expandText=" 展开"
          rows={2}
        />
        {/* 字号变化会重新测量 */}
        <TextEllipsis
          collapseText=" 收起"
          content={LONG_TEXT}
          expandText=" 展开"
          rows={2}
          size="lg"
          weight="semibold"
        />
      </View>

      {/* 表情文本 */}
      <Text className="mb-4 text-lg font-semibold">表情文本</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        二分按码点切分，不该出现半个表情或方块字符
      </Text>
      <View className="mb-8">
        <TextEllipsis
          collapseText=" 收起"
          content={EMOJI_TEXT}
          expandText=" 展开"
          rows={2}
        />
      </View>
    </ScrollView>
  );
};

export { TextEllipsisDemo };
