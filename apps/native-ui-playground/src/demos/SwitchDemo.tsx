import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, Switch, Text } from '@skyroc/native-ui';
import type { ThemeColor, ThemeSize } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

const COLORS: ThemeColor[] = ['primary', 'success', 'warning', 'destructive', 'info', 'accent', 'carbon', 'secondary'];

const SIZES: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/** 与库内一致的取色方式：`accent-*` 工具类映射到矢量图标的 color 上 */
const ThumbIcon = withUniwind(Ionicons);

const SwitchDemo = () => {
  const [basic, setBasic] = useState(false);
  const [controlled, setControlled] = useState(true);
  const [pending, setPending] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /** 模拟一次异步落库：期间保持 loading，成功后再翻转 */
  function handlePendingChange(next: boolean) {
    setSubmitting(true);

    setTimeout(() => {
      setPending(next);
      setSubmitting(false);
    }, 1200);
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8 flex-row items-center gap-3">
        <Switch
          checked={basic}
          onCheckedChange={setBasic}
        />
        <Text color="muted">当前状态：{basic ? '开' : '关'}</Text>
      </View>

      {/* 非受控 */}
      <Text className="mb-4 text-lg font-semibold">非受控</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        只给 defaultChecked，状态由组件自己维护
      </Text>
      <View className="mb-8 flex-row items-center gap-3">
        <Switch defaultChecked />
        <Switch />
      </View>

      {/* 尺寸 */}
      <Text className="mb-4 text-lg font-semibold">尺寸</Text>
      <View className="mb-8 gap-3">
        {SIZES.map(size => (
          <View
            key={size}
            className="flex-row items-center gap-3"
          >
            <Switch
              defaultChecked
              size={size}
            />
            <Text color="muted">{size}</Text>
          </View>
        ))}
      </View>

      {/* 主题色 */}
      <Text className="mb-4 text-lg font-semibold">主题色</Text>
      <View className="mb-8 gap-3">
        {COLORS.map(color => (
          <View
            key={color}
            className="flex-row items-center gap-3"
          >
            <Switch
              defaultChecked
              color={color}
            />
            <Text color="muted">{color}</Text>
          </View>
        ))}
      </View>

      {/* 禁用 */}
      <Text className="mb-4 text-lg font-semibold">禁用</Text>
      <View className="mb-8 flex-row items-center gap-3">
        <Switch disabled />
        <Switch
          defaultChecked
          disabled
        />
      </View>

      {/* 加载中 */}
      <Text className="mb-4 text-lg font-semibold">加载中</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        loading 期间同样不可点击，指示器按滑块尺寸缩放
      </Text>
      <View className="mb-8 flex-row items-center gap-3">
        <Switch loading />
        <Switch
          defaultChecked
          loading
        />
        <Switch
          defaultChecked
          loading
          size="2xl"
        />
      </View>

      {/* 异步切换 */}
      <Text className="mb-4 text-lg font-semibold">异步切换</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        受控 + loading：请求成功后才翻转，失败可原样保持
      </Text>
      <View className="mb-8 flex-row items-center gap-3">
        <Switch
          checked={pending}
          loading={submitting}
          size="lg"
          onCheckedChange={handlePendingChange}
        />
        <Text color="muted">{submitting ? '保存中…' : `已保存：${pending ? '开' : '关'}`}</Text>
      </View>

      {/* 滑块内容 */}
      <Text className="mb-4 text-lg font-semibold">滑块内容</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        children 支持文本与节点，会渲染在滑块内部
      </Text>
      <View className="mb-8 flex-row items-center gap-3">
        <Switch
          defaultChecked
          size="2xl"
        >
          <ThumbIcon
            colorClassName="accent-primary"
            name="checkmark"
            size={14}
          />
        </Switch>
        <Switch size="2xl">
          <Text className="text-[10px] text-muted-foreground">off</Text>
        </Switch>
      </View>

      {/* 自定义样式 */}
      <Text className="mb-4 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        className 覆盖轨道容器，classNames 细粒度覆盖各 slot
      </Text>
      <View className="mb-8 flex-row items-center gap-3">
        <Switch
          className="bg-warning/30"
          defaultChecked={false}
        />
        <Switch
          classNames={{
            checkedOverlay: 'bg-info',
            thumb: 'bg-info-50'
          }}
          defaultChecked
        />
      </View>

      {/* 受控 */}
      <Text className="mb-4 text-lg font-semibold">受控</Text>
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Switch
            checked={controlled}
            color="success"
            onCheckedChange={setControlled}
          />
          <Text color="muted">{controlled ? '已开启' : '已关闭'}</Text>
        </View>
        <View className="flex-row gap-2">
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(true)}
          >
            开启
          </Button>
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(false)}
          >
            关闭
          </Button>
          <Button
            color="primary"
            variant="ghost"
            onPress={() => setControlled(!controlled)}
          >
            取反
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export { SwitchDemo };
