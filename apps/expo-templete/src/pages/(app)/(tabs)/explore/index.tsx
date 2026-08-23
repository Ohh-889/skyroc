import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CellGroup, Search, Text } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { withUniwind } from 'uniwind';

import { TabHeader } from '../modules/TabHeader';
import { DEMO_ENTRY_GROUPS } from './modules/entries';
import { EntryCell } from './modules/EntryCell';

const Icon = withUniwind(MaterialCommunityIcons);

/** ScrollViewMarker 是原生视图，不吃 className，只能给 style */
const FILL = { flex: 1 } as const;

/**
 * 「发现」tab：模板的能力目录。
 *
 * 过滤是纯客户端的，所以不套防抖——`useDebouncedValue` 是给「每次输入都要打接口」的场景用的， 本地 filter 加防抖只会让输入手感变迟钝。真要按关键词查后端，参照 `/demo/contacts`。
 */
const ExploreScreen = () => {
  const router = useRouter();

  const [keyword, setKeyword] = useState('');

  const groups = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();

    if (!trimmed) return DEMO_ENTRY_GROUPS;

    return DEMO_ENTRY_GROUPS.map(group => ({
      ...group,
      // API 那一行也参与匹配：想找「useInfiniteList 的例子在哪一页」时，按 API 名搜比按标题搜快
      entries: group.entries.filter(entry =>
        `${entry.title}${entry.subtitle}${entry.api}`.toLowerCase().includes(trimmed)
      )
    })).filter(group => group.entries.length > 0);
  }, [keyword]);

  return (
    <View className="flex-1 bg-background">
      <TabHeader
        title="发现"
        subtitle={
          <Text
            color="muted"
            size="sm"
          >
            模板自带的组件与原生能力，都能在这里点开真机验证
          </Text>
        }
      />

      <View className="px-2 pb-2">
        <Search
          clearable
          shape="round"
          placeholder="搜页面名，或者直接搜 API"
          value={keyword}
          onChangeText={setKeyword}
        />
      </View>

      <ScrollViewMarker style={FILL}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 pb-6 pt-1"
          contentInsetAdjustmentBehavior="automatic"
        >
          {groups.length === 0 ? (
            <View className="items-center gap-3 px-4 py-16">
              <Icon
                colorClassName="accent-muted-foreground"
                name="magnify-close"
                size={40}
              />

              <Text
                color="muted"
                size="sm"
              >
                没有匹配「{keyword.trim()}」的演示页
              </Text>
            </View>
          ) : (
            groups.map(group => (
              <CellGroup
                inset
                key={group.title}
                title={group.title}
              >
                {group.entries.map(entry => (
                  <EntryCell
                    entry={entry}
                    key={entry.title}
                    onPress={() => router.push(entry.href)}
                  />
                ))}
              </CellGroup>
            ))
          )}
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
};

export default ExploreScreen;
