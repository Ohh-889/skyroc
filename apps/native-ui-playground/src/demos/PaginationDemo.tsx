import Feather from '@expo/vector-icons/Feather';
import { Button, Divider, Pagination, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const SIBLING_COUNTS = [0, 1, 2];

/** 列表分页示例的数据源 */
const RECORDS = Array.from({ length: 23 }, (_, idx) => `第 ${idx + 1} 条数据`);

/** 列表分页示例每页条数 */
const PAGE_SIZE = 5;

const PrevIcon = () => (
  <Feather
    color="#94a3b8"
    name="chevron-left"
    size={18}
  />
);

const NextIcon = () => (
  <Feather
    color="#94a3b8"
    name="chevron-right"
    size={18}
  />
);

const PaginationDemo = () => {
  const [controlled, setControlled] = useState(3);
  const [total, setTotal] = useState(200);
  const [listPage, setListPage] = useState(1);

  const listSlice = RECORDS.slice((listPage - 1) * PAGE_SIZE, listPage * PAGE_SIZE);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        总页数由 totalItems / itemsPerPage 推出，默认显示当前页左右各 1 个兄弟页码
      </Text>
      <View className="mb-8">
        <Pagination
          itemsPerPage={10}
          totalItems={95}
        />
      </View>

      {/* 简单模式 */}
      <Text className="mb-4 text-lg font-semibold">简单模式</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        mode="simple" 只保留「当前页/总页数」，适合空间紧张的场景
      </Text>
      <View className="mb-8">
        <Pagination
          itemsPerPage={10}
          mode="simple"
          totalItems={95}
        />
      </View>

      {/* 固定首尾页 */}
      <Text className="mb-4 text-lg font-semibold">固定首尾页</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        showEdges 始终显示第一页与最后一页，中间用省略号折叠；折叠不足 2 页时不画省略号
      </Text>
      <View className="mb-4 gap-3">
        <Pagination
          showEdges
          defaultPage={1}
          itemsPerPage={10}
          totalItems={500}
        />
        <Pagination
          showEdges
          defaultPage={25}
          itemsPerPage={10}
          totalItems={500}
        />
        <Pagination
          showEdges
          defaultPage={50}
          itemsPerPage={10}
          totalItems={500}
        />
      </View>
      <Text
        className="mb-8"
        color="muted"
      >
        总页数塞得下时（这里只有 6 页）一个省略号都不出现
      </Text>
      <View className="mb-8">
        <Pagination
          showEdges
          defaultPage={3}
          itemsPerPage={10}
          totalItems={60}
        />
      </View>

      {/* 兄弟页码数量 */}
      <Text className="mb-4 text-lg font-semibold">兄弟页码数量</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        siblingCount 控制当前页左右各显示几个页码，0 表示只显示当前页
      </Text>
      <View className="mb-8 gap-3">
        {SIBLING_COUNTS.map(siblingCount => (
          <View
            key={siblingCount}
            className="gap-1"
          >
            <Text color="muted">siblingCount={siblingCount}</Text>
            <Pagination
              showEdges
              defaultPage={20}
              itemsPerPage={10}
              siblingCount={siblingCount}
              totalItems={500}
            />
          </View>
        ))}
      </View>

      {/* 自定义上下页 */}
      <Text className="mb-4 text-lg font-semibold">自定义上下页</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        prev / next 接受任意节点，传字符串会自动包裹 Text
      </Text>
      <View className="mb-8 gap-3">
        <Pagination
          itemsPerPage={10}
          next="下一页"
          prev="上一页"
          totalItems={95}
        />
        <Pagination
          itemsPerPage={10}
          next={<NextIcon />}
          prev={<PrevIcon />}
          totalItems={95}
        />
      </View>

      {/* 禁用 */}
      <Text className="mb-4 text-lg font-semibold">禁用</Text>
      <View className="mb-8">
        <Pagination
          disabled
          defaultPage={3}
          itemsPerPage={10}
          totalItems={95}
        />
      </View>

      {/* 受控 */}
      <Text className="mb-4 text-lg font-semibold">受控</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        page + onPageChange 由外部持有页码；父级不更新 page 时组件也不会自己走
      </Text>
      <View className="mb-8 gap-3">
        <Pagination
          showEdges
          itemsPerPage={10}
          page={controlled}
          totalItems={200}
          onPageChange={setControlled}
        />
        <Text color="muted">当前页：{controlled}</Text>
        <View className="flex-row gap-2">
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(1)}
          >
            回到首页
          </Button>
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(20)}
          >
            跳到末页
          </Button>
        </View>
      </View>

      {/* 数据量变化 */}
      <Text className="mb-4 text-lg font-semibold">数据量变化</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        改筛选条件让总数变小、当前页越界时，组件只把显示值夹回合法区间，不会擅自回写外部状态
      </Text>
      <View className="mb-8 gap-3">
        <Pagination
          showEdges
          itemsPerPage={10}
          page={controlled}
          totalItems={total}
          onPageChange={setControlled}
        />
        <Text color="muted">
          totalItems={total}，外部持有的 page={controlled}
        </Text>
        <View className="flex-row gap-2">
          <Button
            color="primary"
            variant="outline"
            onPress={() => setTotal(200)}
          >
            200 条
          </Button>
          <Button
            color="primary"
            variant="outline"
            onPress={() => setTotal(30)}
          >
            30 条
          </Button>
          <Button
            color="primary"
            variant="outline"
            onPress={() => setTotal(0)}
          >
            空数据
          </Button>
        </View>
      </View>

      {/* 配合列表 */}
      <Text className="mb-4 text-lg font-semibold">配合列表</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        每页 {PAGE_SIZE} 条，共 {RECORDS.length} 条，末页不足一页也照常显示
      </Text>
      <View className="mb-8 gap-3">
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

      {/* 自定义样式 */}
      <Text className="mb-4 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        className 覆盖根容器，classNames 细粒度覆盖各 slot
      </Text>
      <View className="mb-8 gap-3">
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
            item: 'rounded-full bg-primary-50',
            itemText: 'text-primary',
            navButton: 'rounded-full bg-primary-50'
          }}
          defaultPage={5}
          itemsPerPage={10}
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
    </ScrollView>
  );
};

export { PaginationDemo };
