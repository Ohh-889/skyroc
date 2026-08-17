import { Button, Image, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

const RADIUSES = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const;

const FITS = ['cover', 'contain', 'fill', 'none'] as const;

/** 尺寸不同的远程图，用于观察 contentFit 的差异 */
const WIDE = 'https://picsum.photos/id/1015/600/300';

const SQUARE = 'https://picsum.photos/id/1025/400/400';

/** 必然 404 的地址，用于触发失败占位 */
const BROKEN = 'https://picsum.photos/this-path-does-not-exist.jpg';

/** 每次点击都换一张新图，用来验证换图时加载态会被重置 */
const GALLERY = [SQUARE, WIDE, 'https://picsum.photos/id/1035/400/400', BROKEN];

const ImageDemo = () => {
  const [index, setIndex] = useState(0);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法：尺寸给在 className 上，图片铺满容器 */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        <Image
          className="h-20 w-20"
          src={SQUARE}
        />
        <Image
          className="h-20 w-32"
          src={WIDE}
        />
      </View>

      {/* 圆角 */}
      <Text className="mb-4 text-lg font-semibold">Radius</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        {RADIUSES.map(radius => (
          <Image
            className="h-16 w-16"
            key={radius}
            radius={radius}
            src={SQUARE}
          />
        ))}
      </View>

      {/* 填充方式：走 expo-image 原生的 contentFit，不额外包一层变体 */}
      <Text className="mb-4 text-lg font-semibold">Content Fit</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        {FITS.map(fit => (
          <View
            className="items-center gap-1"
            key={fit}
          >
            <Image
              className="h-16 w-16"
              contentFit={fit}
              radius="md"
              src={WIDE}
            />
            <Text className="text-xs text-muted-foreground">{fit}</Text>
          </View>
        ))}
      </View>

      {/* 加载失败：默认渲染内置破损图标 */}
      <Text className="mb-4 text-lg font-semibold">Error</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        <Image
          className="h-20 w-20"
          radius="md"
          src={BROKEN}
        />
        <Image
          className="h-20 w-20"
          radius="md"
          src={undefined}
        />
        <Image
          showError={false}
          className="h-20 w-20"
          radius="md"
          src={BROKEN}
        />
      </View>

      {/* 自定义占位内容 */}
      <Text className="mb-4 text-lg font-semibold">Custom Slots</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        <Image
          className="h-20 w-20"
          errorSlot={<Text className="text-xs text-muted-foreground">加载失败</Text>}
          radius="md"
          src={BROKEN}
        />
        <Image
          className="h-20 w-20"
          loadingSlot={<ActivityIndicator size="large" />}
          radius="md"
          src={`${WIDE}?custom-loading`}
        />
      </View>

      {/* slot 类名覆盖 */}
      <Text className="mb-4 text-lg font-semibold">Slot ClassNames</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        <Image
          className="h-20 w-20"
          classNames={{ error: 'bg-destructive/10', indicator: 'accent-destructive' }}
          radius="md"
          src={BROKEN}
        />
        <Image
          className="h-20 w-20"
          classNames={{ image: 'opacity-40' }}
          radius="md"
          src={SQUARE}
        />
      </View>

      {/* 换图：src 变化时加载态重置，不会残留上一张的失败占位 */}
      <Text className="mb-4 text-lg font-semibold">Switch Source</Text>
      <View className="mb-8 items-start gap-3">
        <Image
          className="h-32 w-32"
          radius="lg"
          src={GALLERY[index]}
        />
        <Text className="text-xs text-muted-foreground">
          {index + 1} / {GALLERY.length}
          {GALLERY[index] === BROKEN ? '（这张是坏图）' : ''}
        </Text>
        <Button
          color="primary"
          variant="solid"
          onPress={() => setIndex(prev => (prev + 1) % GALLERY.length)}
        >
          下一张
        </Button>
      </View>

      {/* src 透传 expo-image 的完整 source 能力：多分辨率数组、带 headers 的鉴权图等 */}
      <Text className="mb-4 text-lg font-semibold">Rich Source</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-4">
        <Image
          className="h-20 w-20"
          radius="md"
          src={[
            { height: 200, uri: 'https://picsum.photos/id/1025/200/200', width: 200 },
            { height: 400, uri: SQUARE, width: 400 }
          ]}
        />
        <Image
          className="h-20 w-20"
          placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
          radius="md"
          src={`${WIDE}?blurhash`}
        />
      </View>
    </ScrollView>
  );
};

export { ImageDemo };
