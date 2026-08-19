import { Button, DropdownMenu, Text } from '@skyroc/native-ui';
import type { DropdownMenuItem, DropdownMenuRef, DropdownMenuValue } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { View } from 'react-native';

const SORT_ITEM: DropdownMenuItem = {
  key: 'sort',
  options: [
    { text: '综合排序', value: 'default' },
    { text: '好评优先', value: 'rating' },
    { text: '销量优先', value: 'sales' }
  ],
  title: '排序'
};

const FILTER_ITEM: DropdownMenuItem = {
  key: 'filter',
  options: [
    { text: '全部商品', value: 'all' },
    { text: '新品上架', value: 'new' },
    { text: '活动商品', value: 'promo' }
  ],
  title: '筛选'
};

const DropdownMenuControlled = () => {
  const [values, setValues] = useState<(DropdownMenuValue | undefined)[]>(['rating', 'promo']);
  const [openIndex, setOpenIndex] = useState(-1);

  const menuRef = useRef<DropdownMenuRef>(null);

  const controlledTexts = values.map(value => value ?? '-').join(' / ');

  function handleReset() {
    setValues(['default', 'all']);
  }

  return (
    <View className="bg-muted">
      <Text className="mb-3 px-4 text-sm text-muted-foreground">
        当前值：{controlledTexts}
        {'\n'}
        展开中的索引：{openIndex}
      </Text>
      <DropdownMenu
        ref={menuRef}
        closeOnSelect={false}
        items={[SORT_ITEM, FILTER_ITEM]}
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
    </View>
  );
};

export { DropdownMenuControlled };
