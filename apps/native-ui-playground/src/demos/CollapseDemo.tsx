import Feather from '@expo/vector-icons/Feather';
import { Button, Collapse, CollapseItem, Text } from '@skyroc/native-ui';
import type { CollapseItemRef, CollapseRef, CollapseValue } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

const CONTENT = '代码是写给人看的，只是顺便能被机器执行。折叠面板用来收纳这类长文本，展开时高度会做过渡动画。';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，避免写死 hex */
const Icon = withUniwind(Feather);

const CollapseDemo = () => {
  const [controlled, setControlled] = useState<CollapseValue>(['a']);
  const [accordion, setAccordion] = useState<CollapseValue>(null);

  const groupRef = useRef<CollapseRef>(null);
  const firstItemRef = useRef<CollapseItemRef>(null);

  function handleToggleAll() {
    groupRef.current?.toggleAll();
  }

  function handleExpandAll() {
    groupRef.current?.toggleAll({ expanded: true, skipDisabled: true });
  }

  function handleToggleFirst() {
    firstItemRef.current?.toggle();
  }

  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8">
        <Collapse defaultValue={0}>
          <CollapseItem title="面板一">{CONTENT}</CollapseItem>
          <CollapseItem title="面板二">{CONTENT}</CollapseItem>
          <CollapseItem
            disabled
            title="面板三（禁用）"
          >
            {CONTENT}
          </CollapseItem>
        </Collapse>
      </View>

      {/* Accordion */}
      <Text className="mb-4 text-lg font-semibold">Accordion</Text>
      <Text className="mb-2 text-sm text-muted-foreground">当前展开：{accordion ?? '无'}</Text>
      <View className="mb-8">
        <Collapse
          accordion
          value={accordion}
          onChange={setAccordion}
        >
          <CollapseItem
            name="one"
            title="只能展开一个"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem
            name="two"
            title="展开我会收起别人"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem
            name="three"
            title="再点一次全部收起"
          >
            {CONTENT}
          </CollapseItem>
        </Collapse>
      </View>

      {/* Controlled */}
      <Text className="mb-4 text-lg font-semibold">Controlled</Text>
      <Text className="mb-2 text-sm text-muted-foreground">
        当前展开：{Array.isArray(controlled) && controlled.length > 0 ? controlled.join('、') : '无'}
      </Text>
      <View className="mb-8">
        <Collapse
          value={controlled}
          onChange={setControlled}
        >
          <CollapseItem
            name="a"
            title="面板 A"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem
            name="b"
            title="面板 B"
          >
            {CONTENT}
          </CollapseItem>
        </Collapse>
      </View>

      {/* Ref */}
      <Text className="mb-4 text-lg font-semibold">Ref</Text>
      <View className="mb-4 flex-row gap-2">
        <Button
          color="primary"
          size="sm"
          variant="solid"
          onPress={handleToggleAll}
        >
          反转全部
        </Button>
        <Button
          color="primary"
          size="sm"
          variant="outline"
          onPress={handleExpandAll}
        >
          展开全部
        </Button>
        <Button
          color="primary"
          size="sm"
          variant="outline"
          onPress={handleToggleFirst}
        >
          切换首项
        </Button>
      </View>
      <View className="mb-8">
        <Collapse ref={groupRef}>
          <CollapseItem
            ref={firstItemRef}
            name="r1"
            title="面板一"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem
            name="r2"
            title="面板二"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem
            disabled
            name="r3"
            title="面板三（禁用，展开全部时跳过）"
          >
            {CONTENT}
          </CollapseItem>
        </Collapse>
      </View>

      {/* Size */}
      <Text className="mb-4 text-lg font-semibold">Size</Text>
      <View className="mb-8">
        <Collapse>
          <CollapseItem
            size="sm"
            title="Small"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem
            size="md"
            title="Medium"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem
            size="lg"
            title="Large"
          >
            {CONTENT}
          </CollapseItem>
        </Collapse>
      </View>

      {/* Customized */}
      <Text className="mb-4 text-lg font-semibold">Customized</Text>
      <View className="mb-8">
        <Collapse border={false}>
          <CollapseItem
            icon={
              <Icon
                colorClassName="accent-primary"
                name="wifi"
                size={18}
              />
            }
            label="连接到 skyroc-5G"
            title="无线局域网"
            value="已连接"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem
            classNames={{ contentText: 'text-primary' }}
            icon={
              <Icon
                colorClassName="accent-primary"
                name="bluetooth"
                size={18}
              />
            }
            title="自定义内容颜色"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem
            readonly
            title="只读（无箭头，不可展开）"
          >
            {CONTENT}
          </CollapseItem>
        </Collapse>
      </View>

      {/* Lazy render */}
      <Text className="mb-4 text-lg font-semibold">Lazy Render</Text>
      <View className="mb-8">
        <Collapse>
          <CollapseItem
            lazyRender={false}
            title="关闭懒渲染"
          >
            {CONTENT}
          </CollapseItem>
          <CollapseItem title="默认懒渲染">
            <View className="gap-2">
              <Text className="text-sm text-foreground">自定义节点内容</Text>
              <Text className="text-xs text-muted-foreground">{CONTENT}</Text>
            </View>
          </CollapseItem>
        </Collapse>
      </View>
    </ScrollView>
  );
};

export { CollapseDemo };
