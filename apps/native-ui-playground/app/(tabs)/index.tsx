import { Badge, Cell, CellGroup, Search, Text } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { COMPONENT_CATALOG, COMPONENT_COUNT } from '@/src/component-catalog';
import type { ComponentCatalogItem } from '@/src/component-catalog';

interface CatalogItemProps {
  /** 当前组件的名称、说明与示例路由 */
  item: ComponentCatalogItem;
}

const CatalogItem = (props: CatalogItemProps) => {
  const { item } = props;

  const router = useRouter();

  function handlePress() {
    router.push(item.href);
  }

  return (
    <Cell
      showArrow
      classNames={{
        root: 'bg-transparent py-2.5',
        subtitle: 'mt-0.5 text-xs',
        title: 'font-medium'
      }}
      subtitle={item.description}
      title={item.name}
      onPress={handlePress}
    />
  );
};

const HomeScreen = () => {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const visibleCatalog = COMPONENT_CATALOG.map(group => ({
    ...group,
    components: group.components.filter(item => {
      if (!normalizedQuery) return true;

      return `${item.name} ${item.description}`.toLowerCase().includes(normalizedQuery);
    })
  })).filter(group => group.components.length > 0);

  return (
    <View className="flex-1 bg-background pt-safe">
      <View className="gap-2 px-5 pb-4 pt-5">
        <View className="flex-row items-center gap-3">
          <Text className="text-2xl font-bold text-foreground">Native UI</Text>
          <Badge
            color="primary"
            content={COMPONENT_COUNT}
          />
        </View>
        <Text className="text-sm leading-5 text-muted-foreground">浏览组件能力并进入可交互示例</Text>
        <Search
          className="mt-3 p-0"
          classNames={{ input: 'border-0 bg-secondary/70' }}
          placeholder="搜索组件名称或用途"
          shape="round"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 pb-8 pt-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {visibleCatalog.map(group => (
          <CellGroup
            inset
            classNames={{
              divider: 'mx-4 bg-border/70',
              root: 'rounded-2xl border border-border/60 bg-secondary/35',
              title: 'px-5 pb-2 pt-3 text-xs font-semibold text-muted-foreground'
            }}
            key={group.title}
            title={group.title}
          >
            {group.components.map(item => (
              <CatalogItem
                item={item}
                key={item.name}
              />
            ))}
          </CellGroup>
        ))}

        {visibleCatalog.length === 0 ? (
          <View className="items-center gap-2 px-6 py-16">
            <Text className="text-base font-medium text-foreground">没有找到相关组件</Text>
            <Text className="text-sm text-muted-foreground">换一个名称或用途关键词试试</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
