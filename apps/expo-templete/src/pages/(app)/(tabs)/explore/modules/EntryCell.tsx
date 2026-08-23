import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Cell, Text } from '@skyroc/native-ui';
import { View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { DemoEntry } from './entries';

const Icon = withUniwind(MaterialCommunityIcons);

/** EntryCell 组件属性 */
export interface EntryCellProps {
  entry: DemoEntry;

  onPress: () => void;
}

/** 能力目录里的一行 */
export const EntryCell = (props: EntryCellProps) => {
  const { entry, onPress } = props;

  return (
    <Cell
      showArrow
      onPress={onPress}
      title={entry.title}
      leading={
        <View className="size-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon
            colorClassName="accent-primary"
            name={entry.icon}
            size={20}
          />
        </View>
      }
      subtitle={
        <View className="gap-1">
          <Text
            color="muted"
            size="sm"
          >
            {entry.subtitle}
          </Text>

          <Text
            color="muted"
            size="xs"
          >
            {entry.api}
          </Text>
        </View>
      }
    />
  );
};
