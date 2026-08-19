import { Button, DropdownMenu, Text } from '@skyroc/native-ui';
import type { DropdownMenuItem, DropdownMenuRef } from '@skyroc/native-ui';
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

const DropdownMenuImperative = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  const menuRef = useRef<DropdownMenuRef>(null);

  function handleOpen() {
    menuRef.current?.open(1);
  }

  function handleClose() {
    menuRef.current?.close();
  }

  return (
    <View className="bg-background pb-4">
      <Text className="mb-3 px-4 text-sm text-muted-foreground">展开索引：{openIndex}</Text>
      <View className="mb-3 flex-row gap-3 px-4">
        <Button
          size="sm"
          onPress={handleOpen}
        >
          展开筛选
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={handleClose}
        >
          收起
        </Button>
      </View>
      <DropdownMenu
        ref={menuRef}
        items={[SORT_ITEM, FILTER_ITEM]}
        onOpenChange={setOpenIndex}
      />
    </View>
  );
};

export { DropdownMenuImperative };
