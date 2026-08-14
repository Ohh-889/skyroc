import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Button, Radio, RadioCard, RadioGroup, RadioGroupCard, Text } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/ui-types';

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

const RadioDemo = () => {
  const [controlled, setControlled] = useState(false);
  const [groupValue, setGroupValue] = useState('apple');
  const [cardGroupValue, setCardGroupValue] = useState('wifi');

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8 gap-3">
        <Radio defaultChecked>Radio</Radio>
        <Radio>Unchecked</Radio>
      </View>

      {/* Color */}
      <Text className="mb-4 text-lg font-semibold">Color</Text>
      <View className="mb-8 gap-4">
        {COLORS.map(c => (
          <RadioGroup
            color={c as ThemeColor}
            defaultValue="a"
            direction="horizontal"
            key={c}
          >
            <Radio name="a">{c}</Radio>
            <Radio name="b">B</Radio>
          </RadioGroup>
        ))}
      </View>

      {/* Size */}
      <Text className="mb-4 text-lg font-semibold">Size</Text>
      <View className="mb-8 gap-3">
        {SIZES.map(s => (
          <Radio
            key={s}
            defaultChecked
            size={s}
          >
            {s}
          </Radio>
        ))}
      </View>

      {/* Shape */}
      <Text className="mb-4 text-lg font-semibold">Shape</Text>
      <View className="mb-8 gap-3">
        <Radio
          defaultChecked
          shape="round"
        >
          Round (default)
        </Radio>
        <Radio
          defaultChecked
          shape="square"
        >
          Square
        </Radio>
      </View>

      {/* Disabled */}
      <Text className="mb-4 text-lg font-semibold">Disabled</Text>
      <View className="mb-8 gap-3">
        <Radio disabled>Disabled</Radio>
        <Radio
          defaultChecked
          disabled
        >
          Disabled & Checked
        </Radio>
      </View>

      {/* Label Position */}
      <Text className="mb-4 text-lg font-semibold">Label Position</Text>
      <View className="mb-8 gap-3">
        <Radio labelPosition="right">Label on right</Radio>
        <Radio labelPosition="left">Label on left</Radio>
      </View>

      {/* Controlled */}
      <Text className="mb-4 text-lg font-semibold">Controlled</Text>
      <View className="mb-8 gap-3">
        <Radio
          checked={controlled}
          onCheckedChange={setControlled}
        >
          {controlled ? 'Checked' : 'Unchecked'}
        </Radio>
        <Button
          size="sm"
          onPress={() => setControlled(v => !v)}
        >
          Toggle
        </Button>
      </View>

      {/* RadioGroup */}
      <Text className="mb-4 text-lg font-semibold">Group</Text>
      <View className="mb-8 gap-3">
        <RadioGroup
          value={groupValue}
          onChange={setGroupValue}
        >
          {FRUIT_ITEMS.map(item => (
            <Radio
              key={item.value}
              name={item.value}
            >
              {item.label}
            </Radio>
          ))}
        </RadioGroup>
        <Text className="text-sm text-muted-foreground">Selected: {groupValue}</Text>
      </View>

      {/* Horizontal Group */}
      <Text className="mb-4 text-lg font-semibold">Horizontal Group</Text>
      <View className="mb-8">
        <RadioGroup
          defaultValue="a"
          direction="horizontal"
        >
          <Radio name="a">A</Radio>
          <Radio name="b">B</Radio>
          <Radio name="c">C</Radio>
          <Radio name="d">D</Radio>
        </RadioGroup>
      </View>

      {/* Square Shape Group */}
      <Text className="mb-4 text-lg font-semibold">Square Shape Group</Text>
      <View className="mb-8">
        <RadioGroup
          color="warning"
          defaultValue="x"
          shape="square"
        >
          <Radio name="x">X</Radio>
          <Radio name="y">Y</Radio>
          <Radio name="z">Z</Radio>
        </RadioGroup>
      </View>

      {/* Card */}
      <Text className="mb-4 text-lg font-semibold">Card</Text>
      <View className="mb-8 gap-3">
        <RadioCard
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
        <RadioCard
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
          radioPosition="right"
          shape="square"
        />
        <RadioCard
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

      {/* Card Group */}
      <Text className="mb-4 text-lg font-semibold">Card Group</Text>
      <View className="mb-8 gap-3">
        <RadioGroupCard
          color="info"
          items={CARD_ITEMS}
          radioPosition="right"
          value={cardGroupValue}
          onChange={setCardGroupValue}
        />
        <Text className="text-sm text-muted-foreground">Selected: {cardGroupValue}</Text>
      </View>
    </ScrollView>
  );
};

export { RadioDemo };
