import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Avatar, AvatarGroup, Button, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/** 几张稳定可用的远程图，seed 固定保证每次刷新拿到同一张 */
const FACES = [
  'https://picsum.photos/seed/av1/100',
  'https://picsum.photos/seed/av2/100',
  'https://picsum.photos/seed/av3/100',
  'https://picsum.photos/seed/av4/100',
  'https://picsum.photos/seed/av5/100'
];

/** DNS 直接解析失败的地址，比 404 更快更稳地触发 fallback */
const BROKEN = 'https://invalid-url.test/broken.jpg';

/** 换头像用的序列，最后一张是坏图：用于验证「坏图之后再换好图」能恢复 */
const GALLERY = [FACES[0], BROKEN, FACES[2], FACES[3]];

const AvatarDemo = () => {
  const [index, setIndex] = useState(0);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        <Avatar src={FACES[0]} />
        <Avatar fallback="张" />
        <Avatar
          fallback={
            <MaterialIcons
              color="#71717a"
              name="person"
              size={22}
            />
          }
        />
        {/* 既无 src 也无 fallback，回落到 Image 内置的破损图标 */}
        <Avatar />
      </View>

      {/* 尺寸：fallback 文字字号跟着 size 走 */}
      <Text className="mb-4 text-lg font-semibold">Size</Text>
      <View className="mb-4 flex-row flex-wrap items-end gap-4">
        {SIZES.map(size => (
          <View
            className="items-center gap-1"
            key={size}
          >
            <Avatar
              size={size}
              src={FACES[1]}
            />
            <Text className="text-xs text-muted-foreground">{size}</Text>
          </View>
        ))}
      </View>
      {/* 双字母首字母缩写：看小尺寸下文字会不会撑破圆形 */}
      <View className="mb-8 flex-row flex-wrap items-end gap-4">
        {SIZES.map(size => (
          <Avatar
            fallback="AB"
            key={size}
            size={size}
          />
        ))}
      </View>

      {/* 加载失败与空 src 等价，都走 fallback */}
      <Text className="mb-4 text-lg font-semibold">Fallback</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        <Avatar
          fallback="坏"
          src={BROKEN}
        />
        <Avatar
          fallback="空"
          src={undefined}
        />
        <Avatar
          alt="王小明的头像"
          fallback="王"
          src={BROKEN}
        />
      </View>

      {/* slot 类名覆盖：字母头像换成品牌色 */}
      <Text className="mb-4 text-lg font-semibold">Slot ClassNames</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        <Avatar
          classNames={{ fallback: 'bg-primary', fallbackText: 'text-primary-foreground' }}
          fallback="A"
        />
        <Avatar
          classNames={{ fallback: 'bg-destructive', fallbackText: 'text-destructive-foreground' }}
          fallback="B"
        />
        <Avatar
          classNames={{ fallback: 'bg-success', fallbackText: 'text-success-foreground' }}
          fallback="C"
        />
        {/* className 合并到 root，可以直接改形状 */}
        <Avatar
          className="rounded-lg"
          classNames={{ image: 'rounded-lg' }}
          src={FACES[4]}
        />
      </View>

      {/* 换图：src 变化时失败态会被重置，坏图之后再换好图能恢复 */}
      <Text className="mb-4 text-lg font-semibold">Switch Source</Text>
      <View className="mb-8 items-start gap-3">
        <Avatar
          fallback="?"
          size="2xl"
          src={GALLERY[index]}
        />
        <Text className="text-xs text-muted-foreground">
          {index + 1} / {GALLERY.length}
          {GALLERY[index] === BROKEN ? '（这张是坏图，下一张应恢复正常）' : ''}
        </Text>
        <Button
          color="primary"
          variant="solid"
          onPress={() => setIndex(prev => (prev + 1) % GALLERY.length)}
        >
          下一张
        </Button>
      </View>

      {/* 头像组：叠压 + 描边分隔 */}
      <Text className="mb-4 text-lg font-semibold">Group</Text>
      <View className="mb-8 items-start gap-4">
        <AvatarGroup>
          {FACES.map(face => (
            <Avatar
              key={face}
              src={face}
            />
          ))}
        </AvatarGroup>

        {/* 组内统一 size，子项无需重复声明 */}
        {SIZES.map(size => (
          <AvatarGroup
            key={size}
            size={size}
          >
            {FACES.slice(0, 4).map(face => (
              <Avatar
                key={face}
                src={face}
              />
            ))}
          </AvatarGroup>
        ))}
      </View>

      {/* max：超出部分折叠成 +N */}
      <Text className="mb-4 text-lg font-semibold">Group Max</Text>
      <View className="mb-8 items-start gap-4">
        {[2, 3, 4].map(max => (
          <View
            className="flex-row items-center gap-3"
            key={max}
          >
            <AvatarGroup max={max}>
              {FACES.map(face => (
                <Avatar
                  key={face}
                  src={face}
                />
              ))}
            </AvatarGroup>
            <Text className="text-xs text-muted-foreground">max={max}</Text>
          </View>
        ))}

        {/* total：只渲染 3 个头像，但声明总人数 20，尾部显示 +17 */}
        <View className="flex-row items-center gap-3">
          <AvatarGroup total={20}>
            {FACES.slice(0, 3).map(face => (
              <Avatar
                key={face}
                src={face}
              />
            ))}
          </AvatarGroup>
          <Text className="text-xs text-muted-foreground">total={20}</Text>
        </View>
      </View>

      {/* 组内混排：字母头像、坏图、单独放大的子项 */}
      <Text className="mb-4 text-lg font-semibold">Group Mixed</Text>
      <View className="mb-8 items-start gap-4">
        <AvatarGroup max={4}>
          <Avatar src={FACES[0]} />
          <Avatar
            classNames={{ fallback: 'bg-primary', fallbackText: 'text-primary-foreground' }}
            fallback="张"
          />
          <Avatar
            fallback="坏"
            src={BROKEN}
          />
          <Avatar src={FACES[3]} />
          <Avatar src={FACES[4]} />
        </AvatarGroup>

        {/* 子项显式 size 会压过组内继承 */}
        <AvatarGroup size="sm">
          <Avatar src={FACES[0]} />
          <Avatar
            size="lg"
            src={FACES[1]}
          />
          <Avatar src={FACES[2]} />
        </AvatarGroup>

        {/* overflowProps 整体替换 +N 的内容与配色 */}
        <AvatarGroup
          max={3}
          overflowProps={{
            classNames: { fallback: 'bg-primary', fallbackText: 'text-primary-foreground' },
            fallback: (
              <MaterialIcons
                color="#fff"
                name="more-horiz"
                size={18}
              />
            )
          }}
        >
          {FACES.map(face => (
            <Avatar
              key={face}
              src={face}
            />
          ))}
        </AvatarGroup>
      </View>

      {/* 描边色跟随容器背景：放在非 background 底色上需要覆盖 ring */}
      <Text className="mb-4 text-lg font-semibold">Group On Colored Surface</Text>
      <View className="mb-8 gap-4 rounded-xl bg-muted p-4">
        <AvatarGroup max={4}>
          {FACES.map(face => (
            <Avatar
              key={face}
              src={face}
            />
          ))}
        </AvatarGroup>

        <AvatarGroup
          classNames={{ ring: 'border-muted' }}
          max={4}
        >
          {FACES.map(face => (
            <Avatar
              key={face}
              src={face}
            />
          ))}
        </AvatarGroup>
      </View>
    </ScrollView>
  );
};

export { AvatarDemo };
