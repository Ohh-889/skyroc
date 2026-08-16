import { Button, PasswordInput, Text } from '@skyroc/native-ui';
import type { PasswordInputRef } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

const SIZES = ['sm', 'md', 'lg'] as const;

/** 校验段落里认为正确的密码，用来演示 errorInfo 由输入派生而不是另存一份 state */
const CORRECT_PASSWORD = '123456';

const PasswordInputDemo = () => {
  const [basic, setBasic] = useState('');
  const [completed, setCompleted] = useState('-');
  const [verify, setVerify] = useState('');
  const [plain, setPlain] = useState('');

  const inputRef = useRef<PasswordInputRef>(null);

  const verifyError = verify.length === CORRECT_PASSWORD.length && verify !== CORRECT_PASSWORD ? '密码错误' : '';

  function handleComplete(value: string) {
    setCompleted(value);
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic：默认 6 位、掩码、数字键盘 */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8 gap-3">
        <PasswordInput
          value={basic}
          onChangeText={setBasic}
          onComplete={handleComplete}
        />
        <Text className="text-sm text-muted-foreground">当前值：{basic || '（空）'}</Text>
        <Text className="text-sm text-muted-foreground">最近一次 onComplete：{completed}</Text>
      </View>

      {/* Variant：merged 靠外框描边 + 内部左边框分隔，separated 每格独立描边并由 gutter 拉开间距 */}
      <Text className="mb-4 text-lg font-semibold">Variant</Text>
      <View className="mb-8 gap-3">
        <PasswordInput defaultValue="12" />
        <Text className="text-sm text-muted-foreground">merged（默认），gutter 不生效</Text>
        <PasswordInput
          defaultValue="12"
          variant="separated"
        />
        <Text className="text-sm text-muted-foreground">separated，默认 gutter=12</Text>
        <PasswordInput
          defaultValue="12"
          gutter={4}
          variant="separated"
        />
        <Text className="text-sm text-muted-foreground">separated + gutter=4</Text>
      </View>

      {/* Size 同时驱动格子高度、掩码圆点尺寸与明文字号 */}
      <Text className="mb-4 text-lg font-semibold">Size</Text>
      <View className="mb-8 gap-3">
        {SIZES.map(s => (
          <PasswordInput
            defaultValue="1234"
            key={s}
            size={s}
          />
        ))}
        <Text className="text-sm text-muted-foreground">圆点大小随 size 变化，不只是格子变高</Text>
      </View>

      {/* Length */}
      <Text className="mb-4 text-lg font-semibold">Length</Text>
      <View className="mb-8 gap-3">
        <PasswordInput
          length={4}
          variant="separated"
        />
        <PasswordInput length={8} />
      </View>

      {/* Mask：关掉掩码直接显示字符 */}
      <Text className="mb-4 text-lg font-semibold">Mask</Text>
      <View className="mb-8 gap-3">
        <PasswordInput
          mask={false}
          value={plain}
          onChangeText={setPlain}
        />
        <Text className="text-sm text-muted-foreground">mask=false 时显示明文，字号跟随 size</Text>
      </View>

      {/* errorInfo 由当前值派生，不额外存一份 state；有 errorInfo 时 info 不显示，边框同时转红 */}
      <Text className="mb-4 text-lg font-semibold">Info / Error</Text>
      <View className="mb-8 gap-3">
        <PasswordInput
          errorInfo={verifyError}
          info={`输入 ${CORRECT_PASSWORD} 之外的 6 位数字会报错`}
          value={verify}
          onChangeText={setVerify}
        />
        <PasswordInput
          errorInfo="separated 下每个格子都转红"
          defaultValue="123"
          variant="separated"
        />
      </View>

      {/* ref 暴露 focus / blur，用于验证码页面进入即弹键盘一类场景 */}
      <Text className="mb-4 text-lg font-semibold">命令式 focus / blur</Text>
      <View className="mb-8 gap-3">
        <PasswordInput
          ref={inputRef}
          variant="separated"
        />
        <View className="flex-row gap-3">
          <Button
            size="sm"
            onPress={() => inputRef.current?.focus()}
          >
            聚焦
          </Button>
          <Button
            size="sm"
            variant="outline"
            onPress={() => inputRef.current?.blur()}
          >
            失焦
          </Button>
        </View>
        <Text className="text-sm text-muted-foreground">输满 6 位后组件也会自动失焦</Text>
      </View>

      {/* className 落在 root，classNames 逐槽覆盖 */}
      <Text className="mb-4 text-lg font-semibold">样式覆盖</Text>
      <View className="mb-8 gap-3">
        <PasswordInput
          classNames={{ security: 'border-success rounded-none' }}
          defaultValue="12"
        />
        <PasswordInput
          classNames={{ cell: 'bg-secondary', dot: 'bg-primary' }}
          defaultValue="123"
        />
        <PasswordInput
          classNames={{ symbol: 'text-primary font-semibold' }}
          defaultValue="12"
          mask={false}
          variant="separated"
        />
      </View>

      {/* 组件默认数字键盘 + 不自动大写，两者都排在 rest 之前，可以被逐项覆盖 */}
      <Text className="mb-4 text-lg font-semibold">原生属性透传</Text>
      <View className="mb-8 gap-3">
        <PasswordInput
          autoCapitalize="characters"
          keyboardType="default"
          mask={false}
          variant="separated"
        />
        <Text className="text-sm text-muted-foreground">覆盖默认值后可输入字母并自动大写</Text>
      </View>
    </ScrollView>
  );
};

export { PasswordInputDemo };
