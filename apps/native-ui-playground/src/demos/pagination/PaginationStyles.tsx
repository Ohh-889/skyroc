import { Pagination } from '@skyroc/native-ui';
import { View } from 'react-native';

/** ClassName 覆盖根容器，classNames 细粒度覆盖各 slot */
const PaginationStyles = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Pagination
        className="rounded-xl bg-secondary py-2"
        itemsPerPage={10}
        totalItems={95}
      />
      <Pagination
        showEdges
        classNames={{
          content: 'gap-2',
          desc: 'text-primary',
          ellipsis: 'rounded-full bg-primary-50',
          item: 'rounded-full bg-primary-50',
          itemText: 'text-primary',
          navButton: 'rounded-full bg-primary-50',
          root: 'rounded-xl border border-primary-200 py-2'
        }}
        defaultPage={5}
        itemsPerPage={10}
        siblingCount={0}
        totalItems={200}
      />
      <Pagination
        classNames={{ desc: 'text-base font-semibold text-primary', simple: 'rounded-lg bg-primary-50' }}
        defaultPage={3}
        itemsPerPage={10}
        mode="simple"
        totalItems={95}
      />
    </View>
  );
};

export { PaginationStyles };
