import Feather from '@expo/vector-icons/Feather';
import { Button, Checkbox, CheckboxCard, CheckboxGroup, CheckboxGroupCard, Text } from '@skyroc/native-ui';
import type { CheckedState, ThemeColor } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const COLORS = ['primary', 'destructive', 'success', 'warning', 'info', 'accent', 'carbon', 'secondary'];
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const FRUIT_ITEMS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Orange', value: 'orange' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' }
];

const CARD_ITEMS = [
  {
    description: 'Fast and reliable',
    icon: (
      <Feather
        color="#3b82f6"
        name="wifi"
        size={20}
      />
    ),
    label: 'Wi-Fi',
    value: 'wifi'
  },
  {
    description: 'Mobile data connection',
    icon: (
      <Feather
        color="#22c55e"
        name="smartphone"
        size={20}
      />
    ),
    label: 'Cellular',
    value: 'cellular'
  },
  {
    description: 'Direct device connection',
    icon: (
      <Feather
        color="#8b5cf6"
        name="bluetooth"
        size={20}
      />
    ),
    label: 'Bluetooth',
    value: 'bluetooth'
  }
];

const CheckboxDemo = () => {
  const [controlled, setControlled] = useState(false);
  const [groupValue, setGroupValue] = useState<string[]>(['apple']);
  const [maxValue, setMaxValue] = useState<string[]>([]);
  const [cardGroupValue, setCardGroupValue] = useState<string[]>(['wifi']);
  const [lastChanged, setLastChanged] = useState('-');

  // 全选 / 半选：父级选中态由子集数量推导
  const parentChecked: CheckedState =
    groupValue.length === 0 ? false : groupValue.length === FRUIT_ITEMS.length || 'indeterminate';

  function handleToggleAll(checked: boolean) {
    setGroupValue(checked ? FRUIT_ITEMS.map(item => item.value) : []);
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
        <Checkbox defaultChecked>Checkbox</Checkbox>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox checked="indeterminate">Indeterminate</Checkbox>
      </View>

      {/* Color */}
      <Text className="mb-4 text-lg font-semibold">Color</Text>
      <View className="mb-8 gap-4">
        {COLORS.map(c => (
          <CheckboxGroup
            color={c as ThemeColor}
            defaultValue={['a']}
            direction="horizontal"
            key={c}
          >
            <Checkbox name="a">{c}</Checkbox>
            <Checkbox name="b">B</Checkbox>
          </CheckboxGroup>
        ))}
      </View>

      {/* Size */}
      <Text className="mb-4 text-lg font-semibold">Size</Text>
      <View className="mb-8 gap-3">
        {SIZES.map(s => (
          <Checkbox
            key={s}
            defaultChecked
            size={s}
          >
            {s}
          </Checkbox>
        ))}
      </View>

      {/* Shape */}
      <Text className="mb-4 text-lg font-semibold">Shape</Text>
      <View className="mb-8 gap-3">
        <Checkbox
          defaultChecked
          shape="round"
        >
          Round (default)
        </Checkbox>
        <Checkbox
          defaultChecked
          shape="square"
        >
          Square
        </Checkbox>
      </View>

      {/* Custom icon size, 内部勾随之等比缩放 */}
      <Text className="mb-4 text-lg font-semibold">Icon Size</Text>
      <View className="mb-8 gap-3">
        <Checkbox
          defaultChecked
          iconSize={16}
        >
          16px
        </Checkbox>
        <Checkbox
          defaultChecked
          iconSize={28}
        >
          28px
        </Checkbox>
        <Checkbox
          defaultChecked
          iconSize={40}
        >
          40px
        </Checkbox>
      </View>

      {/* Disabled */}
      <Text className="mb-4 text-lg font-semibold">Disabled</Text>
      <View className="mb-8 gap-3">
        <Checkbox disabled>Disabled</Checkbox>
        <Checkbox
          defaultChecked
          disabled
        >
          Disabled & Checked
        </Checkbox>
      </View>

      {/* Label Position */}
      <Text className="mb-4 text-lg font-semibold">Label Position</Text>
      <View className="mb-8 gap-3">
        <Checkbox labelPosition="right">Label on right</Checkbox>
        <Checkbox labelPosition="left">Label on left</Checkbox>
        <Checkbox labelDisabled>Label not pressable (labelDisabled)</Checkbox>
      </View>

      {/* Multi-line label, 指示器贴首行 */}
      <Text className="mb-4 text-lg font-semibold">Multi-line Label</Text>
      <View className="mb-8 gap-3">
        <Checkbox defaultChecked>
          A fairly long label that wraps onto more than one line so the control stays aligned with the first line rather
          than the block center.
        </Checkbox>
        <Checkbox>{2024}</Checkbox>
      </View>

      {/* Controlled */}
      <Text className="mb-4 text-lg font-semibold">Controlled</Text>
      <View className="mb-8 gap-3">
        <Checkbox
          checked={controlled}
          onCheckedChange={setControlled}
        >
          {controlled ? 'Checked' : 'Unchecked'}
        </Checkbox>
        <Button
          size="sm"
          onPress={() => setControlled(v => !v)}
        >
          Toggle
        </Button>
      </View>

      {/* Group，子项 onCheckedChange 在分组内同样会触发 */}
      <Text className="mb-4 text-lg font-semibold">Group</Text>
      <View className="mb-8 gap-3">
        <Checkbox
          checked={parentChecked}
          onCheckedChange={handleToggleAll}
        >
          Check all
        </Checkbox>

        <CheckboxGroup
          className="pl-6"
          value={groupValue}
          onChange={setGroupValue}
        >
          {FRUIT_ITEMS.map(item => (
            <Checkbox
              key={item.value}
              name={item.value}
              onCheckedChange={checked => setLastChanged(`${item.label} → ${checked}`)}
            >
              {item.label}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <Text className="text-sm text-muted-foreground">Selected: {groupValue.join(', ') || 'none'}</Text>
        <Text className="text-sm text-muted-foreground">Last changed: {lastChanged}</Text>
      </View>

      {/* Max */}
      <Text className="mb-4 text-lg font-semibold">Max (2)</Text>
      <View className="mb-8 gap-3">
        <CheckboxGroup
          direction="horizontal"
          max={2}
          value={maxValue}
          onChange={setMaxValue}
        >
          {FRUIT_ITEMS.map(item => (
            <Checkbox
              key={item.value}
              name={item.value}
            >
              {item.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
        <Text className="text-sm text-muted-foreground">Selected: {maxValue.join(', ') || 'none'}</Text>
      </View>

      {/* Horizontal Group */}
      <Text className="mb-4 text-lg font-semibold">Horizontal Group</Text>
      <View className="mb-8">
        <CheckboxGroup
          defaultValue={['a']}
          direction="horizontal"
        >
          <Checkbox name="a">A</Checkbox>
          <Checkbox name="b">B</Checkbox>
          <Checkbox name="c">C</Checkbox>
          <Checkbox name="d">D</Checkbox>
        </CheckboxGroup>
      </View>

      {/* Square Shape Group */}
      <Text className="mb-4 text-lg font-semibold">Square Shape Group</Text>
      <View className="mb-8">
        <CheckboxGroup
          color="warning"
          defaultValue={['x']}
          shape="square"
        >
          <Checkbox name="x">X</Checkbox>
          <Checkbox name="y">Y</Checkbox>
          <Checkbox name="z">Z</Checkbox>
        </CheckboxGroup>
      </View>

      {/* Custom Icon */}
      <Text className="mb-4 text-lg font-semibold">Custom Icon</Text>
      <View className="mb-8 gap-3">
        <Checkbox
          defaultChecked
          shape="square"
          checkedIcon={
            <Feather
              color="#fff"
              name="star"
              size={12}
            />
          }
        >
          Custom checked icon
        </Checkbox>
        <Checkbox
          checked="indeterminate"
          shape="square"
          indeterminateIcon={
            <Feather
              color="#fff"
              name="more-horizontal"
              size={12}
            />
          }
        >
          Custom indeterminate icon
        </Checkbox>
      </View>

      {/* Card */}
      <Text className="mb-4 text-lg font-semibold">Card</Text>
      <View className="mb-8 gap-3">
        <CheckboxCard
          color="primary"
          defaultChecked
          description="Fast and reliable"
          icon={
            <Feather
              color="#3b82f6"
              name="wifi"
              size={20}
            />
          }
          label="Wi-Fi"
        />
        <CheckboxCard
          checkboxPosition="right"
          color="warning"
          description="Mobile data connection"
          icon={
            <Feather
              color="#22c55e"
              name="smartphone"
              size={20}
            />
          }
          label="Cellular"
          shape="square"
        />
        <CheckboxCard
          color="success"
          description="Direct device connection"
          disabled
          icon={
            <Feather
              color="#8b5cf6"
              name="bluetooth"
              size={20}
            />
          }
          label="Bluetooth"
        />
      </View>

      {/* CheckboxCard 直接放进 CheckboxGroup，与 Checkbox 共享同一份选中态 */}
      <Text className="mb-4 text-lg font-semibold">Card in Group</Text>
      <View className="mb-8 gap-3">
        <CheckboxGroup
          color="info"
          defaultValue={['wifi']}
          max={2}
        >
          {CARD_ITEMS.map(item => (
            <CheckboxCard
              key={item.value}
              description={item.description}
              icon={item.icon}
              label={item.label}
              name={item.value}
            />
          ))}
        </CheckboxGroup>
      </View>

      {/* Card Group */}
      <Text className="mb-4 text-lg font-semibold">Card Group</Text>
      <View className="mb-8 gap-3">
        <CheckboxGroupCard
          checkboxPosition="right"
          color="info"
          items={CARD_ITEMS}
          value={cardGroupValue}
          onChange={setCardGroupValue}
        />
        <Text className="text-sm text-muted-foreground">Selected: {cardGroupValue.join(', ') || 'none'}</Text>
      </View>
    </ScrollView>
  );
};

export { CheckboxDemo };
