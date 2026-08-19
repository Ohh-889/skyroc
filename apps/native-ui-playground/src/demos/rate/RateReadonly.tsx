import { Rate, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const READONLY_SCORES = [3.7, 4.2, 2.5];

const RateReadonly = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {READONLY_SCORES.map(score => (
        <View
          key={score}
          className="flex-row items-center gap-3"
        >
          <Rate
            allowHalf
            readonly
            value={score}
          />
          <Text color="muted">{score} 分</Text>
        </View>
      ))}
    </View>
  );
};

export { RateReadonly };
