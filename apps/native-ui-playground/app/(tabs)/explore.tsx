import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { Uniwind, useUniwind, withUniwind } from 'uniwind';

type ThemeOptionValue = 'dark' | 'light' | 'system';

interface ColorToken {
  /** 色块使用的完整 Uniwind 类名 */
  className: string;
  /** 语义色名称 */
  name: string;
  /** 语义用途 */
  usage: string;
}

interface ThemeOption {
  /** 主题按钮展示名称 */
  label: string;
  /** 传递给 Uniwind 的主题值 */
  value: ThemeOptionValue;
}

interface SpacingToken {
  /** 间距刻度对应的完整宽度类名 */
  className: string;
  /** 间距的实际像素值 */
  value: number;
}

interface RadiusToken {
  /** 圆角示例使用的完整类名 */
  className: string;
  /** 圆角规格名称 */
  label: string;
}

interface IconSizeToken {
  /** 图标尺寸的用途说明 */
  label: string;
  /** 图标尺寸 */
  value: number;
}

const COLOR_TOKENS: readonly ColorToken[] = [
  { className: 'size-9 rounded-xl bg-background border border-border', name: 'Background', usage: '页面背景' },
  { className: 'size-9 rounded-xl bg-foreground', name: 'Foreground', usage: '主要内容' },
  { className: 'size-9 rounded-xl bg-primary', name: 'Primary', usage: '品牌与主要操作' },
  { className: 'size-9 rounded-xl bg-secondary', name: 'Secondary', usage: '次级背景' },
  { className: 'size-9 rounded-xl bg-muted', name: 'Muted', usage: '弱化区域' },
  { className: 'size-9 rounded-xl bg-success', name: 'Success', usage: '成功状态' },
  { className: 'size-9 rounded-xl bg-warning', name: 'Warning', usage: '提醒与警告' },
  { className: 'size-9 rounded-xl bg-destructive', name: 'Destructive', usage: '错误与危险操作' },
  { className: 'size-9 rounded-xl bg-info', name: 'Info', usage: '信息提示' }
];

const THEME_OPTIONS: readonly ThemeOption[] = [
  { label: '跟随系统', value: 'system' },
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' }
];

const SPACING_TOKENS: readonly SpacingToken[] = [
  { className: 'h-2 w-1 rounded-full bg-primary', value: 4 },
  { className: 'h-2 w-2 rounded-full bg-primary', value: 8 },
  { className: 'h-2 w-3 rounded-full bg-primary', value: 12 },
  { className: 'h-2 w-4 rounded-full bg-primary', value: 16 },
  { className: 'h-2 w-6 rounded-full bg-primary', value: 24 },
  { className: 'h-2 w-8 rounded-full bg-primary', value: 32 }
];

const RADIUS_TOKENS: readonly RadiusToken[] = [
  { className: 'size-12 rounded-sm border border-primary/40 bg-primary/10', label: 'sm' },
  { className: 'size-12 rounded-lg border border-primary/40 bg-primary/10', label: 'lg' },
  { className: 'size-12 rounded-2xl border border-primary/40 bg-primary/10', label: '2xl' },
  { className: 'size-12 rounded-full border border-primary/40 bg-primary/10', label: 'full' }
];

const ICON_SIZE_TOKENS: readonly IconSizeToken[] = [
  { label: '紧凑', value: 16 },
  { label: '辅助', value: 20 },
  { label: '默认', value: 24 },
  { label: '强调', value: 32 }
];

const PLATFORM_LABEL = Platform.select({ android: 'Android', default: 'Web', ios: 'iOS' });
const FoundationIcon = withUniwind(MaterialIcons);

interface FoundationSectionProps {
  /** 区块展示内容 */
  children: ReactNode;
  /** 区块说明 */
  description: string;
  /** 区块标题 */
  title: string;
}

const FoundationSection = (props: FoundationSectionProps) => {
  const { children, description, title } = props;

  return (
    <View className="gap-4 rounded-2xl border border-border/60 bg-secondary/35 p-5">
      <View className="gap-1">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        <Text className="text-sm leading-5 text-muted-foreground">{description}</Text>
      </View>
      {children}
    </View>
  );
};

const FoundationsScreen = () => {
  const { hasAdaptiveThemes, theme } = useUniwind();

  const activeTheme = hasAdaptiveThemes ? 'system' : theme;

  return (
    <View className="flex-1 bg-background pt-safe">
      <View className="gap-2 px-5 pb-4 pt-5">
        <Text className="text-2xl font-bold text-foreground">基础能力</Text>
        <Text className="text-sm leading-5 text-muted-foreground">集中检查设计 Token、排版和跨端布局基线</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-4 pb-8 pt-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <FoundationSection
          description="切换主题，检查语义色在不同外观下是否仍保持一致含义。"
          title="主题与语义色"
        >
          <View className="flex-row rounded-xl bg-background p-1">
            {THEME_OPTIONS.map(option => {
              const selected = activeTheme === option.value;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className="min-h-11 flex-1 items-center justify-center rounded-lg data-[selected=true]:bg-primary active:opacity-80"
                  data-selected={selected}
                  key={option.value}
                  onPress={() => Uniwind.setTheme(option.value)}
                >
                  <Text
                    className={selected ? 'text-sm font-medium text-primary-foreground' : 'text-sm text-foreground'}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="gap-3">
            {COLOR_TOKENS.map(token => (
              <View
                className="flex-row items-center gap-3"
                key={token.name}
              >
                <View className={token.className} />
                <View className="flex-1 flex-row items-center justify-between gap-3">
                  <Text className="font-medium text-foreground">{token.name}</Text>
                  <Text className="text-sm text-muted-foreground">{token.usage}</Text>
                </View>
              </View>
            ))}
          </View>
        </FoundationSection>

        <FoundationSection
          description="同时观察字号、字重和行高，并保留可以直接用于开发的类名。"
          title="文字层级"
        >
          <View className="gap-4">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">Display</Text>
              <Text className="text-xs text-muted-foreground">text-3xl · bold</Text>
            </View>
            <View className="gap-1">
              <Text className="text-2xl font-semibold text-foreground">页面标题</Text>
              <Text className="text-xs text-muted-foreground">text-2xl · semibold</Text>
            </View>
            <View className="gap-1">
              <Text className="text-base leading-6 text-foreground">正文内容用于承载主要信息</Text>
              <Text className="text-xs text-muted-foreground">text-base · leading-6</Text>
            </View>
            <View className="gap-1">
              <Text className="text-sm leading-5 text-muted-foreground">辅助文字用于解释和补充</Text>
              <Text className="text-xs text-muted-foreground">text-sm · leading-5</Text>
            </View>
          </View>
        </FoundationSection>

        <FoundationSection
          description="统一使用 4 的倍数组织组件内边距和页面间距。"
          title="间距与尺寸"
        >
          <View className="gap-3">
            {SPACING_TOKENS.map(token => (
              <View
                className="flex-row items-center gap-3"
                key={token.value}
              >
                <Text className="w-8 text-xs font-medium text-muted-foreground">{token.value}</Text>
                <View className={token.className} />
                <View className="h-px flex-1 bg-border/70" />
              </View>
            ))}
          </View>
          <View className="flex-row items-center justify-between rounded-xl bg-background px-4 py-3">
            <View className="gap-0.5">
              <Text className="font-medium text-foreground">触控尺寸</Text>
              <Text className="text-xs text-muted-foreground">跨端操作区域建议保持 44–48</Text>
            </View>
            <View className="size-12 items-center justify-center rounded-xl bg-primary">
              <FoundationIcon
                colorClassName="accent-primary-foreground"
                name="touch-app"
                size={24}
              />
            </View>
          </View>
        </FoundationSection>

        <FoundationSection
          description="对比常用圆角、边框和表面层级，避免各组件自由发挥。"
          title="圆角与表面"
        >
          <View className="flex-row justify-between gap-2">
            {RADIUS_TOKENS.map(token => (
              <View
                className="items-center gap-2"
                key={token.label}
              >
                <View className={token.className} />
                <Text className="text-xs text-muted-foreground">{token.label}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1 gap-2 rounded-xl border border-border bg-background p-4">
              <Text className="font-medium text-foreground">Border</Text>
              <Text className="text-xs text-muted-foreground">普通内容层</Text>
            </View>
            <View className="flex-1 gap-2 rounded-xl bg-background p-4 shadow-md">
              <Text className="font-medium text-foreground">Elevated</Text>
              <Text className="text-xs text-muted-foreground">浮动内容层</Text>
            </View>
          </View>
        </FoundationSection>

        <FoundationSection
          description="图标优先使用统一尺寸和语义色，避免在组件内随意缩放。"
          title="图标基线"
        >
          <View className="flex-row items-end justify-between gap-2">
            {ICON_SIZE_TOKENS.map(token => (
              <View
                className="min-w-14 items-center gap-2"
                key={token.value}
              >
                <View className="size-12 items-center justify-center rounded-xl bg-background">
                  <FoundationIcon
                    colorClassName="accent-foreground"
                    name="favorite"
                    size={token.value}
                  />
                </View>
                <Text className="text-xs font-medium text-foreground">{token.value}</Text>
                <Text className="text-xs text-muted-foreground">{token.label}</Text>
              </View>
            ))}
          </View>
        </FoundationSection>

        <FoundationSection
          description="确认页面、导航和弹层在不同设备上都避开系统区域。"
          title="设备与安全区域"
        >
          <View className="gap-3 rounded-xl bg-background p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">当前平台</Text>
              <Text className="text-sm font-medium text-foreground">{PLATFORM_LABEL}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">页面顶部</Text>
              <Text className="text-sm font-medium text-foreground">pt-safe</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">底部 Tab</Text>
              <Text className="text-sm font-medium text-foreground">NativeTabs 自动 inset</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">内容尾部</Text>
              <Text className="text-sm font-medium text-foreground">pb-8</Text>
            </View>
          </View>
          <Text className="text-xs leading-5 text-muted-foreground">
            旋转设备或切换不同机型时，检查标题、滚动内容和底部操作是否进入刘海或系统手势区域。
          </Text>
        </FoundationSection>
      </ScrollView>
    </View>
  );
};

export default FoundationsScreen;
