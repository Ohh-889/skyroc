import { Cell, CellGroup, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';

import { THEME_MODES, useThemeMode } from '@/feature/theme';
import type { ThemeMode } from '@/feature/theme';
import { DemoHeader } from './modules/DemoHeader';

/**
 * 色板里的一项。
 *
 * className 一律写成**完整字面量**：uniwind 在构建期扫源码里的 className 字符串，
 * `` `bg-${name}` `` 这种拼出来的类名它扫不到，运行时就是没有样式。
 */
interface ColorToken {
  /** 色块本身的类名 */
  className: string;
  /** 叠在色块上的前景色类名，用来当场验证这一对配色的可读性 */
  foregroundClassName: string;
  /** 语义名 */
  name: string;
  /** 什么时候用它 */
  usage: string;
}

/** 一级文字样式 */
interface TypographyToken {
  /** 示例文字的类名 */
  className: string;
  /** 写进代码时的 props / 类名，直接抄 */
  hint: string;
  /** 示例文字 */
  sample: string;
}

/** 一档间距 */
interface SpacingToken {
  /** 色条类名，宽度即该档间距 */
  className: string;
  /** 实际像素值 */
  value: number;
}

/** 一档圆角 */
interface RadiusToken {
  /** 示例方块类名 */
  className: string;
  /** 圆角名 */
  label: string;
}

const MODE_LABELS: Record<ThemeMode, string> = {
  dark: '深色',
  light: '浅色',
  system: '跟随系统'
};

/** 品牌与状态色。每一项都配一个 `-foreground`，成对使用才能保证文字在色块上可读 */
const SEMANTIC_COLORS: readonly ColorToken[] = [
  {
    className: 'size-11 items-center justify-center rounded-xl bg-primary',
    foregroundClassName: 'text-xs text-primary-foreground',
    name: 'primary',
    usage: '品牌色与主操作'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl bg-secondary',
    foregroundClassName: 'text-xs text-secondary-foreground',
    name: 'secondary',
    usage: '次级按钮与标签'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl bg-accent',
    foregroundClassName: 'text-xs text-accent-foreground',
    name: 'accent',
    usage: '强调、选中态'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl bg-carbon',
    foregroundClassName: 'text-xs text-carbon-foreground',
    name: 'carbon',
    usage: '中性重色，反色气泡'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl bg-success',
    foregroundClassName: 'text-xs text-success-foreground',
    name: 'success',
    usage: '成功与已完成'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl bg-warning',
    foregroundClassName: 'text-xs text-warning-foreground',
    name: 'warning',
    usage: '提醒与待处理'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl bg-destructive',
    foregroundClassName: 'text-xs text-destructive-foreground',
    name: 'destructive',
    usage: '错误与不可逆操作'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl bg-info',
    foregroundClassName: 'text-xs text-info-foreground',
    name: 'info',
    usage: '中性提示'
  }
];

/** 表面色。它们决定层级关系，不带品牌含义 */
const SURFACE_COLORS: readonly ColorToken[] = [
  {
    className: 'size-11 items-center justify-center rounded-xl border border-border bg-background',
    foregroundClassName: 'text-xs text-foreground',
    name: 'background',
    usage: '页面底色'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl border border-border bg-card',
    foregroundClassName: 'text-xs text-card-foreground',
    name: 'card',
    usage: '卡片、列表分组'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl border border-border bg-popover',
    foregroundClassName: 'text-xs text-popover-foreground',
    name: 'popover',
    usage: '弹层、下拉、Sheet'
  },
  {
    className: 'size-11 items-center justify-center rounded-xl bg-muted',
    foregroundClassName: 'text-xs text-muted-foreground',
    name: 'muted',
    usage: '弱化区域与占位'
  }
];

const TYPOGRAPHY_TOKENS: readonly TypographyToken[] = [
  { className: 'text-3xl font-bold text-foreground', hint: 'size="3xl" · weight="bold"', sample: '大标题' },
  { className: 'text-xl font-semibold text-foreground', hint: 'size="xl" · weight="semibold"', sample: '页面标题' },
  { className: 'text-base text-foreground', hint: 'size="base"（默认）', sample: '正文承载主要信息' },
  { className: 'text-sm text-muted-foreground', hint: 'size="sm" · color="muted"', sample: '辅助说明与副标题' },
  { className: 'text-xs text-muted-foreground', hint: 'size="xs" · color="muted"', sample: '脚注、时间戳' }
];

const SPACING_TOKENS: readonly SpacingToken[] = [
  { className: 'h-2 w-1 rounded-full bg-primary', value: 4 },
  { className: 'h-2 w-2 rounded-full bg-primary', value: 8 },
  { className: 'h-2 w-3 rounded-full bg-primary', value: 12 },
  { className: 'h-2 w-4 rounded-full bg-primary', value: 16 },
  { className: 'h-2 w-6 rounded-full bg-primary', value: 24 },
  { className: 'h-2 w-8 rounded-full bg-primary', value: 32 }
];

/** sm / md / lg / xl 由插件按 `--radius` 算出来，改一个变量四档一起动 */
const RADIUS_TOKENS: readonly RadiusToken[] = [
  { className: 'size-12 rounded-sm border border-primary/40 bg-primary/10', label: 'sm' },
  { className: 'size-12 rounded-md border border-primary/40 bg-primary/10', label: 'md' },
  { className: 'size-12 rounded-lg border border-primary/40 bg-primary/10', label: 'lg' },
  { className: 'size-12 rounded-xl border border-primary/40 bg-primary/10', label: 'xl' },
  { className: 'size-12 rounded-full border border-primary/40 bg-primary/10', label: 'full' }
];

const PLATFORM_LABEL = Platform.select({ android: 'Android', default: Platform.OS, ios: 'iOS' });

/** 区块属性 */
interface SectionProps {
  /** 区块内容 */
  children: ReactNode;
  /** 一句话说明这一组 token 什么时候用 */
  description: string;
  /** 区块标题 */
  title: string;
}

const Section = (props: SectionProps) => {
  const { children, description, title } = props;

  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-4">
      <View className="gap-1">
        <Text
          size="lg"
          weight="semibold"
        >
          {title}
        </Text>

        <Text
          color="muted"
          size="sm"
        >
          {description}
        </Text>
      </View>

      {children}
    </View>
  );
};

/** 色板行，语义色和表面色共用 */
const ColorRow = (props: { token: ColorToken }) => {
  const { token } = props;

  return (
    <View className="flex-row items-center gap-3">
      <View className={token.className}>
        <Text className={token.foregroundClassName}>Aa</Text>
      </View>

      <View className="flex-1 flex-row items-center justify-between gap-3">
        <Text weight="medium">{token.name}</Text>

        <Text
          color="muted"
          size="sm"
        >
          {token.usage}
        </Text>
      </View>
    </View>
  );
};

/**
 * 主题与设计 Token 自检页。
 *
 * 页面里所有示例都用真 token 而不是写死的色值，所以切一次主题就能把整套语义色在明暗两套下过一遍——
 * 某个颜色换了外观就丢了含义、某对前景背景在暗色下糊成一片，在这一页会当场露馅。
 */
const ThemeDemoScreen = () => {
  const { mode, resolvedTheme, setMode } = useThemeMode();

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title="主题与 Token" />

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-4 px-4 py-5"
      >
        <View className="gap-2">
          <Text
            size="xl"
            weight="semibold"
          >
            亮 / 暗 / 跟随系统三态
          </Text>

          <Text
            color="muted"
            size="sm"
          >
            选择存在 SecureStore 里，冷启动第一帧就生效（见 feature/theme）。切换会一路传到 uniwind
            的 className、导航主题和状态栏——它们最终都读同一个 Appearance。
          </Text>
        </View>

        <View className="flex-row gap-1 rounded-xl bg-muted p-1">
          {THEME_MODES.map(item => {
            const selected = mode === item;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className="min-h-11 flex-1 items-center justify-center rounded-lg active:opacity-80 data-[selected=true]:bg-primary"
                data-selected={selected}
                key={item}
                onPress={() => setMode(item)}
              >
                <Text className={selected ? 'text-sm text-primary-foreground' : 'text-sm text-foreground'}>
                  {MODE_LABELS[item]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <CellGroup inset>
          <Cell
            title="当前偏好"
            trailing={MODE_LABELS[mode]}
          />

          <Cell
            title="实际生效"
            trailing={resolvedTheme === 'dark' ? '深色' : '浅色'}
          />

          <Cell
            title="运行平台"
            trailing={PLATFORM_LABEL}
          />
        </CellGroup>

        <Section
          description="每个语义色都配一个 -foreground，成对用才能保证色块上的文字在明暗两套下都读得清。别按色相取名（gray500），换主题时含义会失真。"
          title="语义色"
        >
          <View className="gap-3">
            {SEMANTIC_COLORS.map(token => (
              <ColorRow
                key={token.name}
                token={token}
              />
            ))}
          </View>
        </Section>

        <Section
          description="表面色只表达层级：页面底色、卡片、弹层、弱化区。层级靠它们区分，不要用透明度叠出来。"
          title="表面与层级"
        >
          <View className="gap-3">
            {SURFACE_COLORS.map(token => (
              <ColorRow
                key={token.name}
                token={token}
              />
            ))}
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 gap-1 rounded-xl border border-border bg-background p-3">
              <Text
                size="sm"
                weight="medium"
              >
                border
              </Text>

              <Text
                color="muted"
                size="xs"
              >
                描边分隔
              </Text>
            </View>

            <View className="flex-1 gap-1 rounded-xl bg-background p-3 shadow-md">
              <Text
                size="sm"
                weight="medium"
              >
                shadow-md
              </Text>

              <Text
                color="muted"
                size="xs"
              >
                浮起一层
              </Text>
            </View>
          </View>
        </Section>

        <Section
          description="五档就够用。字号和字重成套出现，页面里不要再自定义中间档。"
          title="文字层级"
        >
          <View className="gap-4">
            {TYPOGRAPHY_TOKENS.map(token => (
              <View
                className="gap-1"
                key={token.hint}
              >
                <Text className={token.className}>{token.sample}</Text>

                <Text
                  color="muted"
                  size="xs"
                >
                  {token.hint}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section
          description="一律 4 的倍数：gap-1 是 4，gap-4 是 16。相邻元素之间只用 gap，别再叠 margin。"
          title="间距"
        >
          <View className="gap-3">
            {SPACING_TOKENS.map(token => (
              <View
                className="flex-row items-center gap-3"
                key={token.value}
              >
                <Text
                  className="w-8"
                  color="muted"
                  size="xs"
                  weight="medium"
                >
                  {token.value}
                </Text>

                <View className={token.className} />

                <View className="h-px flex-1 bg-border" />
              </View>
            ))}
          </View>

          <View className="flex-row items-center justify-between rounded-xl bg-muted px-4 py-3">
            <View className="gap-0.5">
              <Text
                size="sm"
                weight="medium"
              >
                触控尺寸
              </Text>

              <Text
                color="muted"
                size="xs"
              >
                可点区域不小于 44，上面的模式切换就是 min-h-11
              </Text>
            </View>

            <View className="size-11 rounded-xl bg-primary" />
          </View>
        </Section>

        <Section
          description="四档圆角由插件按 --radius 算出来，改一个变量整套跟着走，所以别在页面里写 borderRadius 数值。"
          title="圆角"
        >
          <View className="flex-row justify-between gap-2">
            {RADIUS_TOKENS.map(token => (
              <View
                className="items-center gap-2"
                key={token.label}
              >
                <View className={token.className} />

                <Text
                  color="muted"
                  size="xs"
                >
                  {token.label}
                </Text>
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
};

export default ThemeDemoScreen;
