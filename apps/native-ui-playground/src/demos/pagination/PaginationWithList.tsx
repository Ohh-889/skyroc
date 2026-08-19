import { Divider, Pagination, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 列表分页示例的数据源 */
const RECORDS = Array.from({ length: 23 }, (_, idx) => `第 ${idx + 1} 条数据`);

/** 列表分页示例每页条数 */
const PAGE_SIZE = 5;

const PaginationWithList = () => {
  const [listPage, setListPage] = useState(1);

  const listSlice = RECORDS.slice((listPage - 1) * PAGE_SIZE, listPage * PAGE_SIZE);

  return (
    <View className="gap-3 bg-background p-4">
      <View className="gap-2 rounded-xl bg-secondary p-4">
        {listSlice.map((record, index) => (
          <View key={record}>
            {index > 0 ? <Divider className="mb-2" /> : null}
            <Text>{record}</Text>
          </View>
        ))}
      </View>
      <Pagination
        itemsPerPage={PAGE_SIZE}
        page={listPage}
        totalItems={RECORDS.length}
        onPageChange={setListPage}
      />
    </View>
  );
};

export { PaginationWithList };
