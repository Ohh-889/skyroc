import Feather from '@expo/vector-icons/Feather';
import { Search, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，避免写死 hex */
const Icon = withUniwind(Feather);

const SIZES = ['sm', 'md', 'lg'] as const;
const SHAPES = ['square', 'round'] as const;

const SearchDemo = () => {
  const [controlled, setControlled] = useState('');
  const [submitted, setSubmitted] = useState('-');
  const [uncontrolledSubmitted, setUncontrolledSubmitted] = useState('-');
  const [cancelCount, setCancelCount] = useState(0);

  function handleSearch(value: string) {
    setSubmitted(value || '(空)');
  }

  function handleUncontrolledSearch(value: string) {
    setUncontrolledSubmitted(value || '(空)');
  }

  function handleCancel() {
    setCancelCount(prev => prev + 1);
  }

  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="py-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-2 px-6 text-lg font-semibold">Basic</Text>
      <Search placeholder="搜索商品" />

      {/* Shape，square 的圆角跟随 size，round 恒为胶囊 */}
      <Text className="mb-2 mt-8 px-6 text-lg font-semibold">Shape</Text>
      {SHAPES.map(shape => (
        <Search
          key={shape}
          placeholder={shape}
          shape={shape}
        />
      ))}

      {/* Size，外层留白与图标尺寸一起跟随 */}
      <Text className="mb-2 mt-8 px-6 text-lg font-semibold">Size</Text>
      {SIZES.map(size => (
        <Search
          key={size}
          placeholder={size}
          size={size}
        />
      ))}

      {/* Label + Action，action 可传文本也可传节点 */}
      <Text className="mb-2 mt-8 px-6 text-lg font-semibold">Label & Action</Text>
      <Search
        showAction
        label="城市"
        placeholder="搜索地点"
        onCancel={handleCancel}
      />
      <Search
        showAction
        action={
          <Icon
            colorClassName="accent-primary"
            name="sliders"
            size={18}
          />
        }
        placeholder="action 传图标节点"
        shape="round"
        onCancel={handleCancel}
      />
      <Text className="mt-2 px-6 text-sm text-muted-foreground">onCancel 触发次数：{cancelCount}</Text>

      {/* 受控：值由调用方持有 */}
      <Text className="mb-2 mt-8 px-6 text-lg font-semibold">受控</Text>
      <Search
        placeholder="输入后按键盘搜索键"
        value={controlled}
        onChangeText={setControlled}
        onSearch={handleSearch}
      />
      <Text className="mt-2 px-6 text-sm text-muted-foreground">当前值：{controlled || '(空)'}</Text>
      <Text className="px-6 text-sm text-muted-foreground">onSearch 收到：{submitted}</Text>

      {/* 非受控：值由 Input 内部托管，onSearch 取的是提交事件里的文本，同样拿得到 */}
      <Text className="mb-2 mt-8 px-6 text-lg font-semibold">非受控</Text>
      <Search
        defaultValue="非受控默认值"
        placeholder="改一改再按搜索键"
        onSearch={handleUncontrolledSearch}
      />
      <Text className="mt-2 px-6 text-sm text-muted-foreground">onSearch 收到：{uncontrolledSubmitted}</Text>

      {/* 自定义左侧内容与 slot 类名 */}
      <Text className="mb-2 mt-8 px-6 text-lg font-semibold">自定义</Text>
      <Search
        leading={
          <Icon
            colorClassName="accent-primary"
            name="map-pin"
            size={16}
          />
        }
        placeholder="替换默认放大镜"
      />
      <Search
        showAction
        classNames={{ actionText: 'text-destructive', label: 'text-primary font-semibold' }}
        label="标签"
        placeholder="classNames 覆盖 label / actionText"
        onCancel={handleCancel}
      />

      {/* Disabled */}
      <Text className="mb-2 mt-8 px-6 text-lg font-semibold">Disabled</Text>
      <Search
        disabled
        defaultValue="不可编辑"
      />

      <View className="h-6" />
    </ScrollView>
  );
};

export { SearchDemo };
