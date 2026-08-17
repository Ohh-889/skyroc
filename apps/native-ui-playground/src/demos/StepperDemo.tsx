import { Button, Stepper, Text } from '@skyroc/native-ui';
import type { StepperSize, StepperStepType, StepperTheme } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const SIZES: StepperSize[] = ['sm', 'md', 'lg'];

const THEMES: StepperTheme[] = ['default', 'round'];

/** beforeChange 模拟异步校验的耗时 */
const GUARD_DELAY = 600;

/** 异步校验放行的上限 */
const GUARD_MAX = 5;

const StepperDemo = () => {
  const [basic, setBasic] = useState(3);
  const [ranged, setRanged] = useState(4);
  const [decimal, setDecimal] = useState(0.1);
  const [tip, setTip] = useState('等待操作');
  const [guarded, setGuarded] = useState(3);
  const [guardPending, setGuardPending] = useState(false);
  const [controlled, setControlled] = useState(2);

  function handleOverlimit(type: StepperStepType) {
    setTip(type === 'minus' ? 'onOverlimit：已到最小值' : 'onOverlimit：已到最大值');
  }

  function handleMinus() {
    setTip('onMinus：减少一步');
  }

  function handlePlus() {
    setTip('onPlus：增加一步');
  }

  async function handleBeforeChange(next: number) {
    setGuardPending(true);

    await new Promise(resolve => {
      setTimeout(resolve, GUARD_DELAY);
    });

    setGuardPending(false);

    return next <= GUARD_MAX;
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8 gap-2">
        <Stepper
          value={basic}
          onChange={setBasic}
        />
        <Text color="muted">当前值：{basic}</Text>
      </View>

      {/* 尺寸 */}
      <Text className="mb-4 text-lg font-semibold">尺寸</Text>
      <View className="mb-8 gap-3">
        {SIZES.map(size => (
          <View
            key={size}
            className="flex-row items-center gap-3"
          >
            <Stepper
              defaultValue={2}
              size={size}
            />
            <Text color="muted">{size}</Text>
          </View>
        ))}
      </View>

      {/* 主题 */}
      <Text className="mb-4 text-lg font-semibold">主题</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        default 是连体式，round 是两枚圆钮 + 无底色输入框
      </Text>
      <View className="mb-8 gap-3">
        {THEMES.map(theme => (
          <View
            key={theme}
            className="flex-row items-center gap-3"
          >
            <Stepper
              defaultValue={2}
              theme={theme}
            />
            <Text color="muted">{theme}</Text>
          </View>
        ))}
      </View>

      {/* 步长与范围 */}
      <Text className="mb-4 text-lg font-semibold">步长与范围</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        min 2 / max 10 / step 2，超出范围的输入失焦后被夹回边界
      </Text>
      <View className="mb-8 gap-2">
        <Stepper
          max={10}
          min={2}
          step={2}
          value={ranged}
          onChange={setRanged}
        />
        <Text color="muted">当前值：{ranged}</Text>
      </View>

      {/* 小数与整数 */}
      <Text className="mb-4 text-lg font-semibold">小数与整数</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        step 0.1 不设 decimalLength，连加也不会出现 0.30000000000000004 这类浮点尾数
      </Text>
      <View className="mb-4 gap-2">
        <Stepper
          max={3}
          min={0}
          step={0.1}
          value={decimal}
          onChange={setDecimal}
        />
        <Text color="muted">当前值：{String(decimal)}</Text>
      </View>
      <Text
        className="mb-2"
        color="muted"
      >
        decimalLength 固定小数位，0 表示归整到个位（输入 3.7 失焦后变 4）
      </Text>
      <View className="mb-4 flex-row items-center gap-3">
        <Stepper
          decimalLength={2}
          defaultValue={1.5}
          max={10}
          min={0}
          step={0.25}
        />
        <Stepper
          decimalLength={0}
          defaultValue={3}
          max={100}
          min={0}
        />
      </View>
      <Text
        className="mb-2"
        color="muted"
      >
        integer 只允许整数，输入 4.6 失焦后取整为 5，键盘也切成纯数字
      </Text>
      <View className="mb-8">
        <Stepper
          integer
          defaultValue={3}
          max={10}
          min={0}
        />
      </View>

      {/* 事件 */}
      <Text className="mb-4 text-lg font-semibold">事件</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        已在边界仍点击时只发 onOverlimit，不会再发 onMinus / onPlus
      </Text>
      <View className="mb-8 gap-2">
        <Stepper
          max={3}
          min={1}
          onMinus={handleMinus}
          onOverlimit={handleOverlimit}
          onPlus={handlePlus}
        />
        <Text color="muted">{tip}</Text>
      </View>

      {/* 禁用 */}
      <Text className="mb-4 text-lg font-semibold">禁用</Text>
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Stepper
            disabled
            defaultValue={2}
          />
          <Text color="muted">disabled</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            disableInput
            defaultValue={2}
          />
          <Text color="muted">disableInput</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            disableMinus
            defaultValue={2}
          />
          <Text color="muted">disableMinus</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            disablePlus
            defaultValue={2}
          />
          <Text color="muted">disablePlus</Text>
        </View>
      </View>

      {/* 按需显示 */}
      <Text className="mb-4 text-lg font-semibold">按需显示</Text>
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={2}
            showInput={false}
          />
          <Text color="muted">showInput=false</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={2}
            showMinus={false}
          />
          <Text color="muted">showMinus=false</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={2}
            showPlus={false}
          />
          <Text color="muted">showPlus=false</Text>
        </View>
      </View>

      {/* 长按连续触发 */}
      <Text className="mb-4 text-lg font-semibold">长按连续触发</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        按住 600ms 后每 150ms 触发一次，到边界自动停；长按结束时不会多跳一步
      </Text>
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={10}
            max={999}
          />
          <Text color="muted">默认开启</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={10}
            longPress={false}
            max={999}
          />
          <Text color="muted">longPress=false</Text>
        </View>
      </View>

      {/* 异步拦截 */}
      <Text className="mb-4 text-lg font-semibold">异步拦截</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        beforeChange 异步校验 {GUARD_DELAY}ms，超过 {GUARD_MAX} 一律拒绝；校验期间长按不会连跳
      </Text>
      <View className="mb-8 gap-2">
        <Stepper
          beforeChange={handleBeforeChange}
          max={10}
          min={0}
          value={guarded}
          onChange={setGuarded}
        />
        <Text color="muted">
          {guardPending ? '校验中…' : `当前值：${guarded}`}
        </Text>
      </View>

      {/* 空值与自动修正 */}
      <Text className="mb-4 text-lg font-semibold">空值与自动修正</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        allowEmpty 允许清空后保留空串；autoFixed=false 时失焦保留原始输入，既不修正也不提交
      </Text>
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Stepper
            allowEmpty
            defaultValue={2}
            min={0}
          />
          <Text color="muted">allowEmpty</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            autoFixed={false}
            defaultValue={2}
            max={9}
            min={1}
          />
          <Text color="muted">autoFixed=false</Text>
        </View>
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
        <Stepper
          className="self-start rounded-lg bg-secondary p-2"
          defaultValue={2}
        />
        <Stepper
          classNames={{
            input: 'bg-transparent text-primary',
            minus: 'rounded-full bg-primary-100',
            minusIcon: 'text-primary',
            plus: 'rounded-full bg-primary',
            plusIcon: 'text-primary-foreground',
            root: 'gap-2'
          }}
          defaultValue={2}
        />
      </View>

      {/* 受控 */}
      <Text className="mb-4 text-lg font-semibold">受控</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        外部改值后输入框同步刷新；父级不更新 value 时界面也不会自己走
      </Text>
      <View className="mb-8 gap-3">
        <Stepper
          max={20}
          min={0}
          value={controlled}
          onChange={setControlled}
        />
        <View className="flex-row gap-2">
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(Math.max(0, controlled - 5))}
          >
            -5
          </Button>
          <Button
            color="primary"
            variant="outline"
            onPress={() => setControlled(Math.min(20, controlled + 5))}
          >
            +5
          </Button>
          <Button
            color="primary"
            variant="ghost"
            onPress={() => setControlled(0)}
          >
            重置
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export { StepperDemo };
