import { Button, DropdownMenu, Text } from '@skyroc/native-ui';
import type { DropdownMenuItem, DropdownMenuRef, DropdownMenuValue } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

const SORT_ITEM: DropdownMenuItem = {
  key: 'sort',
  options: [
    { text: '综合排序', value: 'default' },
    { text: '好评优先', value: 'rating' },
    { text: '销量优先', value: 'sales' }
  ]
};

const FILTER_ITEM: DropdownMenuItem = {
  key: 'filter',
  options: [
    { text: '全部商品', value: 'all' },
    { text: '新品上架', value: 'new' },
    { text: '活动商品', value: 'promo' }
  ]
};

const DISABLED_ITEM: DropdownMenuItem = {
  key: 'status',
  options: [
    { text: '默认', value: 'default' },
    { disabled: true, text: '已下架', value: 'offline' },
    { text: '热门', value: 'hot' }
  ]
};

/** 整列禁用：标题点不开 */
const LOCKED_ITEM: DropdownMenuItem = {
  disabled: true,
  key: 'locked',
  options: [{ text: '暂不可选', value: 'none' }],
  title: '暂不可选'
};

/** 用来演示面板超高后内部滚动的长列表 */
const CITY_ITEM: DropdownMenuItem = {
  key: 'city',
  options: Array.from({ length: 30 }, (_, index) => ({
    text: `城市 ${index + 1}`,
    value: `city-${index + 1}`
  })),
  title: '城市'
};

const DropdownMenuDemo = () => {
  const [values, setValues] = useState<(DropdownMenuValue | undefined)[]>(['rating', 'promo']);
  const [openIndex, setOpenIndex] = useState(-1);

  const menuRef = useRef<DropdownMenuRef>(null);

  const controlledTexts = values.map(value => value ?? '-').join(' / ');

  function handleReset() {
    setValues(['default', 'all']);
  }

  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-3 mt-4 px-4 text-lg font-semibold">基础用法</Text>
      <Text className="mb-3 px-4 text-sm text-muted-foreground">
        标题默认显示当前选中项；展开时点另一个标题会直接换内容，遮罩不会闪一下。
      </Text>
      <DropdownMenu items={[SORT_ITEM, FILTER_ITEM]} />

      {/* Custom Title */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">自定义标题</Text>
      <DropdownMenu
        items={[
          { ...SORT_ITEM, title: '排序' },
          { ...FILTER_ITEM, title: '筛选' }
        ]}
      />

      {/* Disabled */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">禁用选项 / 禁用整列</Text>
      <DropdownMenu items={[DISABLED_ITEM, LOCKED_ITEM]} />

      {/* Scrollable Panel */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">长列表</Text>
      <Text className="mb-3 px-4 text-sm text-muted-foreground">
        选项超过面板最大高度（默认屏幕的 80%）后面板内部滚动，可用 maxHeight 收紧。
      </Text>
      <DropdownMenu
        items={[CITY_ITEM, FILTER_ITEM]}
        maxHeight={240}
      />

      {/* Controlled + Ref */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">受控用法与命令式控制</Text>
      <Text className="mb-3 px-4 text-sm text-muted-foreground">
        当前值：{controlledTexts}
        {'\n'}
        展开中的索引：{openIndex}
      </Text>
      <DropdownMenu
        ref={menuRef}
        closeOnSelect={false}
        items={[
          { ...SORT_ITEM, title: '排序' },
          { ...FILTER_ITEM, title: '筛选' }
        ]}
        values={values}
        onOpenChange={setOpenIndex}
        onValuesChange={setValues}
      />
      <View className="mt-3 flex-row flex-wrap gap-3 px-4">
        <Button
          color="primary"
          size="sm"
          variant="solid"
          onPress={() => menuRef.current?.open(1)}
        >
          展开筛选
        </Button>
        <Button
          color="primary"
          size="sm"
          variant="outline"
          onPress={() => menuRef.current?.close()}
        >
          收起
        </Button>
        <Button
          color="primary"
          size="sm"
          variant="outline"
          onPress={handleReset}
        >
          重置
        </Button>
      </View>

      {/* No Overlay */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">无遮罩</Text>
      <DropdownMenu
        items={[SORT_ITEM, FILTER_ITEM]}
        overlay={false}
      />

      {/* Direction Up */}
      <Text className="mb-3 mt-6 px-4 text-lg font-semibold">向上展开</Text>
      <View className="mt-40">
        <DropdownMenu
          direction="up"
          items={[SORT_ITEM, FILTER_ITEM]}
        />
      </View>
    </ScrollView>
  );
};

export { DropdownMenuDemo };
