import { TextEllipsis } from '@skyroc/native-ui';
import { View } from 'react-native';

const SHORT_TEXT = '一行放得下的短文本。';

/** 用来验证「恰好占满一行」不该被判定为截断 */
const EXACT_TEXT = '恰好一行';

const TextEllipsisNoOverflow = () => {
  return (
    <View className="gap-3 bg-background px-6 py-4">
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
  );
};

export { TextEllipsisNoOverflow };
