import { TextEllipsis } from '@skyroc/native-ui';
import { View } from 'react-native';

const SHORT_TEXT = '一行放得下的短文本。';

const TextEllipsisNoOverflow = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <TextEllipsis
        collapseText="收起"
        content={SHORT_TEXT}
        expandText="展开"
      />
      <TextEllipsis
        collapseText="收起"
        content=""
        expandText="展开"
      />
    </View>
  );
};

export { TextEllipsisNoOverflow };
