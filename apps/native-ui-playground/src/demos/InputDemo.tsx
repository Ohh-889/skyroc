import Feather from '@expo/vector-icons/Feather';
import { Button, Input, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const VARIANTS = ['outline', 'filled', 'underline', 'none'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

/** 各 demo 段落共用的图标，避免每处重复写颜色与尺寸 */
const SearchIcon = (
  <Feather
    color="#94a3b8"
    name="search"
    size={18}
  />
);

const InputDemo = () => {
  const [controlled, setControlled] = useState('');
  const [clearControlled, setClearControlled] = useState('填了值，点右侧清除');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [lastCleared, setLastCleared] = useState('-');

  const emailError = controlled.length > 0 && !controlled.includes('@');

  function handleClear() {
    setLastCleared('clearable 触发了 onClear');
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8 gap-3">
        <Input placeholder="请输入" />
        <Input defaultValue="非受控默认值" />
      </View>

      {/* Variant */}
      <Text className="mb-4 text-lg font-semibold">Variant</Text>
      <View className="mb-8 gap-3">
        {VARIANTS.map(v => (
          <Input
            key={v}
            placeholder={v}
            variant={v}
          />
        ))}
      </View>

      {/* Size */}
      <Text className="mb-4 text-lg font-semibold">Size</Text>
      <View className="mb-8 gap-3">
        {SIZES.map(s => (
          <Input
            key={s}
            placeholder={s}
            size={s}
          />
        ))}
      </View>

      {/* error 在未聚焦时同样是红框：边框色走 compoundVariants，不会被 variant 的边框覆盖 */}
      <Text className="mb-4 text-lg font-semibold">Error</Text>
      <View className="mb-8 gap-3">
        {VARIANTS.map(v => (
          <Input
            error
            key={v}
            placeholder={`${v} + error`}
            variant={v}
          />
        ))}
        <Text className="text-sm text-muted-foreground">聚焦后仍保持红色，错误态优先级高于聚焦色</Text>
      </View>

      {/* Disabled，功能按钮在 disabled 下也不响应点击 */}
      <Text className="mb-4 text-lg font-semibold">Disabled</Text>
      <View className="mb-8 gap-3">
        <Input
          disabled
          placeholder="disabled"
        />
        <Input
          clearable
          disabled
          defaultValue="disabled 时不显示清除按钮"
        />
        <Input
          disabled
          defaultValue="密码按钮点不动"
          type="password"
        />
      </View>

      {/* Clearable：受控与非受控都能真正清空 */}
      <Text className="mb-4 text-lg font-semibold">Clearable</Text>
      <View className="mb-8 gap-3">
        <Input
          clearable
          defaultValue="非受控，组件自己清空"
          onClear={handleClear}
        />
        <Input
          clearable
          placeholder="受控"
          value={clearControlled}
          onChangeText={setClearControlled}
        />
        <Text className="text-sm text-muted-foreground">受控值：{clearControlled || '（空）'}</Text>
        <Text className="text-sm text-muted-foreground">{lastCleared}</Text>
      </View>

      {/* Password */}
      <Text className="mb-4 text-lg font-semibold">Password</Text>
      <View className="mb-8 gap-3">
        <Input
          placeholder="非受控可见性"
          type="password"
        />
        <Input
          clearable
          defaultValue="clearable + password"
          type="password"
        />
        <Input
          passwordVisible={passwordVisible}
          placeholder="受控可见性"
          type="password"
          onPasswordVisibleChange={setPasswordVisible}
        />
        <Button
          size="sm"
          onPress={() => setPasswordVisible(v => !v)}
        >
          {passwordVisible ? '隐藏密码' : '显示密码'}
        </Button>
      </View>

      {/* Leading / Trailing，trailing 与密码按钮共存且排在其后 */}
      <Text className="mb-4 text-lg font-semibold">Leading / Trailing</Text>
      <View className="mb-8 gap-3">
        <Input
          leading={SearchIcon}
          placeholder="搜索"
        />
        <Input
          placeholder="带单位"
          trailing={<Text className="text-muted-foreground">元</Text>}
        />
        <Input
          leading={SearchIcon}
          placeholder="password + trailing 同时存在"
          trailing={<Text className="text-muted-foreground">GO</Text>}
          type="password"
        />
      </View>

      {/* Controlled */}
      <Text className="mb-4 text-lg font-semibold">Controlled</Text>
      <View className="mb-8 gap-3">
        <Input
          clearable
          error={emailError}
          placeholder="输入邮箱"
          value={controlled}
          onChangeText={setControlled}
        />
        <Text className="text-sm text-muted-foreground">当前值：{controlled || '（空）'}</Text>
        {emailError ? <Text className="text-sm text-destructive">邮箱必须包含 @</Text> : null}
      </View>

      {/* none 变体不再强制右对齐，需要靠右时由调用方传 textAlign */}
      <Text className="mb-4 text-lg font-semibold">Cell 内联（variant=none）</Text>
      <View className="mb-8 gap-3">
        <View className="flex-row items-center rounded-lg border border-input px-3">
          <Text className="w-20">昵称</Text>
          <Input
            className="flex-1"
            placeholder="请输入昵称"
            variant="none"
          />
        </View>
        <View className="flex-row items-center rounded-lg border border-input px-3">
          <Text className="w-20">手机号</Text>
          <Input
            className="flex-1"
            keyboardType="number-pad"
            placeholder="请输入手机号"
            textAlign="right"
            variant="none"
          />
        </View>
      </View>

      {/* className 落在 root，classNames 逐槽覆盖 */}
      <Text className="mb-4 text-lg font-semibold">样式覆盖</Text>
      <View className="mb-8 gap-3">
        <Input
          className="border-success bg-success/10"
          placeholder="className 覆盖 root"
        />
        <Input
          classNames={{ control: 'text-primary font-semibold' }}
          defaultValue="classNames.control 覆盖输入区"
        />
        <Input
          clearable
          classNames={{ action: 'opacity-40' }}
          defaultValue="classNames.action 覆盖功能按钮"
        />
      </View>

      {/* 透传给底层 TextInput 的原生属性 */}
      <Text className="mb-4 text-lg font-semibold">原生属性透传</Text>
      <View className="mb-8 gap-3">
        <Input
          keyboardType="email-address"
          placeholder="email-address 键盘"
        />
        <Input
          maxLength={6}
          placeholder="maxLength=6"
        />
        <Input
          multiline
          className="h-24 items-start py-2"
          placeholder="multiline"
        />
      </View>
    </ScrollView>
  );
};

export { InputDemo };
