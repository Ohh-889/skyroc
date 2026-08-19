import { Avatar, AvatarGroup, Button, Divider, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/** 固定 seed，避免每次刷新拿到不同的示例图片 */
const FACES = [
  'https://picsum.photos/seed/av1/100',
  'https://picsum.photos/seed/av2/100',
  'https://picsum.photos/seed/av3/100',
  'https://picsum.photos/seed/av4/100',
  'https://picsum.photos/seed/av5/100'
];

/** DNS 解析失败的地址，用于稳定触发 fallback */
const BROKEN = 'https://invalid-url.test/broken.jpg';

/** 包含正常图片与坏图，用于验证 src 变化后失败状态能够恢复 */
const GALLERY = [FACES[0], BROKEN, FACES[2], FACES[3]];

const AvatarDemo = () => {
  const [index, setIndex] = useState(0);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="src 展示图片；未提供图片时可使用 fallback。"
        title="基础用法（src / fallback）"
      >
        <View className="flex-row flex-wrap items-center gap-4 p-4">
          <Avatar
            alt="示例用户头像"
            src={FACES[0]}
          />
          <Avatar fallback="张" />
          <Avatar fallback={7} />
          <Avatar fallback={<Text className="text-xs font-semibold text-primary">VIP</Text>} />
        </View>
      </Section>

      <Section
        description="size 提供 xs 到 2xl 六档尺寸，fallback 字号同步变化。"
        title="尺寸（size）"
      >
        <View className="flex-row flex-wrap items-end gap-4 p-4">
          {SIZES.map(size => (
            <View
              className="items-center gap-1.5"
              key={size}
            >
              <Avatar
                fallback="AB"
                size={size}
              />
              <Text className="text-xs text-muted-foreground">{size}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section
        description="空 src 与加载失败都会进入 fallback；不传 fallback 时使用 Image 的默认失败占位。"
        title="降级内容（fallback）"
      >
        <View className="flex-row flex-wrap items-center gap-4 p-4">
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
          <Avatar />
        </View>
      </Section>

      <Section
        description="imageProps 透传给内部 Image，可控制过渡、加载提示等图片行为。"
        title="底层图片属性（imageProps）"
      >
        <View className="flex-row flex-wrap items-end gap-5 p-4">
          <View className="items-center gap-2">
            <Avatar
              imageProps={{ transition: 300 }}
              size="xl"
              src={FACES[1]}
            />
            <Text className="text-xs text-muted-foreground">transition=300</Text>
          </View>
          <View className="items-center gap-2">
            <Avatar
              imageProps={{ showLoading: true, transition: 500 }}
              size="xl"
              src={`${FACES[2]}?loading`}
            />
            <Text className="text-xs text-muted-foreground">showLoading</Text>
          </View>
        </View>
      </Section>

      <Section
        description="className 覆盖根容器，classNames 可控制 fallback、文字和图片 slot。"
        title="样式覆盖（className / classNames）"
      >
        <View className="flex-row flex-wrap items-center gap-4 p-4">
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
          <Avatar
            className="rounded-lg"
            classNames={{ image: 'rounded-lg' }}
            src={FACES[4]}
          />
        </View>
      </Section>

      <Section
        description="src 更新时会重置图片状态，坏图之后切回正常图片可恢复显示。"
        title="动态换图（src）"
      >
        <View className="items-start gap-3 p-4">
          <Avatar
            fallback="?"
            size="2xl"
            src={GALLERY[index]}
          />
          <Text className="text-sm text-muted-foreground">
            当前图片：{index + 1} / {GALLERY.length}
            {GALLERY[index] === BROKEN ? '（坏图，下一张应恢复）' : ''}
          </Text>
          <Button
            variant="outline"
            onPress={() => setIndex(previous => (previous + 1) % GALLERY.length)}
          >
            切换图片
          </Button>
        </View>
      </Section>

      <Section
        description="AvatarGroup 将头像横向叠放，并为相邻头像添加分隔描边。"
        title="头像组（AvatarGroup）"
      >
        <View className="items-start gap-5 p-4">
          <AvatarGroup>
            {FACES.map(face => (
              <Avatar
                key={face}
                src={face}
              />
            ))}
          </AvatarGroup>
          <AvatarGroup>
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
          </AvatarGroup>
        </View>
      </Section>

      <Section
        description="组级 size 会下发给子头像；子项显式 size 的优先级更高。"
        title="组尺寸（size）"
      >
        <View className="items-start gap-4 p-4">
          {(['sm', 'md', 'lg'] as const).map(size => (
            <View
              className="flex-row items-center gap-3"
              key={size}
            >
              <AvatarGroup size={size}>
                {FACES.slice(0, 4).map(face => (
                  <Avatar
                    key={face}
                    src={face}
                  />
                ))}
              </AvatarGroup>
              <Text className="text-xs text-muted-foreground">size={size}</Text>
            </View>
          ))}
          <View className="flex-row items-center gap-3">
            <AvatarGroup size="sm">
              <Avatar src={FACES[0]} />
              <Avatar
                size="lg"
                src={FACES[1]}
              />
              <Avatar src={FACES[2]} />
            </AvatarGroup>
            <Text className="text-xs text-muted-foreground">子项覆盖为 lg</Text>
          </View>
        </View>
      </Section>

      <Section
        description="max 折叠超出项；max=0 展示全部；total 可声明未渲染的真实总人数。"
        title="数量折叠（max / total）"
      >
        <View className="items-start gap-4 p-4">
          <View className="flex-row items-center gap-3">
            <AvatarGroup max={2}>
              {FACES.map(face => (
                <Avatar
                  key={face}
                  src={face}
                />
              ))}
            </AvatarGroup>
            <Text className="text-xs text-muted-foreground">max=2</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <AvatarGroup max={0}>
              {FACES.slice(0, 4).map(face => (
                <Avatar
                  key={face}
                  src={face}
                />
              ))}
            </AvatarGroup>
            <Text className="text-xs text-muted-foreground">max=0（全部）</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <AvatarGroup total={20}>
              {FACES.slice(0, 3).map(face => (
                <Avatar
                  key={face}
                  src={face}
                />
              ))}
            </AvatarGroup>
            <Text className="text-xs text-muted-foreground">total=20（+17）</Text>
          </View>
        </View>
      </Section>

      <Section
        description="overflowProps 可整体替换 +N 头像的内容和样式。"
        title="自定义溢出（overflowProps）"
      >
        <View className="items-start p-4">
          <AvatarGroup
            max={3}
            overflowProps={{
              classNames: { fallback: 'bg-primary', fallbackText: 'text-primary-foreground' },
              fallback: <Text className="font-bold">•••</Text>
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
      </Section>

      <Section
        description="头像组放在其他底色上时，用 classNames.ring 匹配所在容器。"
        title="非默认背景（classNames.ring）"
      >
        <View className="gap-4 bg-muted p-4">
          <View className="flex-row items-center gap-3">
            <AvatarGroup max={4}>
              {FACES.map(face => (
                <Avatar
                  key={face}
                  src={face}
                />
              ))}
            </AvatarGroup>
            <Text className="text-xs text-muted-foreground">默认 ring</Text>
          </View>
          <View className="flex-row items-center gap-3">
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
            <Text className="text-xs text-muted-foreground">border-muted</Text>
          </View>
        </View>
      </Section>
    </ScrollView>
  );
};

interface SectionProps {
  /** 当前特性的示例内容 */
  children: ReactNode;

  /** 当前示例所聚焦 API 的简短说明 */
  description: string;

  /** 当前特性标题 */
  title: string;
}

const Section = (props: SectionProps) => {
  const { children, description, title } = props;

  return (
    <View className="mb-6 overflow-hidden rounded-2xl border border-border bg-background">
      <View className="p-4">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted-foreground">{description}</Text>
      </View>
      <Divider />
      {children}
    </View>
  );
};

export { AvatarDemo };
