import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text } from '@skyroc/native-ui';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

type PatternIconName = ComponentProps<typeof MaterialIcons>['name'];

interface PatternEntry {
  /** 用于概括场景覆盖的组件能力 */
  components: readonly string[];
  /** 当前场景的任务目标 */
  description: string;
  /** 代表当前场景的图标名称 */
  icon: PatternIconName;
  /** 现阶段用于验证该场景的组件示例 */
  href: Href;
  /** 场景展示序号 */
  index: string;
  /** 场景名称 */
  title: string;
}

const PATTERN_ENTRIES: readonly PatternEntry[] = [
  {
    components: ['Input', 'PasswordInput', 'Checkbox', 'Button', 'Toast'],
    description: '完成一次包含输入校验、协议确认与结果反馈的登录任务',
    href: '/components/password-input',
    icon: 'verified-user',
    index: '01',
    title: '登录与安全输入'
  },
  {
    components: ['Form', 'Field', 'Picker', 'Radio', 'Image', 'Dialog'],
    description: '编辑个人资料，并检查选择、上传与提交确认流程',
    href: '/components/form',
    icon: 'edit-note',
    index: '02',
    title: '资料编辑与提交'
  },
  {
    components: ['Search', 'DropdownMenu', 'Tag', 'Slider', 'DatePicker'],
    description: '组合关键词和筛选条件，快速定位目标内容',
    href: '/components/search',
    icon: 'manage-search',
    index: '03',
    title: '搜索与条件筛选'
  },
  {
    components: ['Cell', 'Checkbox', 'SwipeCell', 'Pagination', 'Notify'],
    description: '完成选择、滑动快捷操作和批量处理反馈',
    href: '/components/swipe-cell',
    icon: 'playlist-add-check',
    index: '04',
    title: '列表批量管理'
  },
  {
    components: ['ActionSheet', 'Sheet', 'Popup', 'Dialog', 'Toast'],
    description: '验证多个弹层之间的层级、确认与收尾反馈',
    href: '/components/action-sheet',
    icon: 'layers',
    index: '05',
    title: '弹层操作流程'
  },
  {
    components: ['NavBar', 'Tabs', 'Collapse', 'AnchorNav', 'BackTop'],
    description: '在长页面中完成切换、展开、定位与返回顶部',
    href: '/components/anchor-nav',
    icon: 'article',
    index: '06',
    title: '长内容阅读'
  }
];

const PatternIcon = withUniwind(MaterialIcons);

interface PatternCardProps {
  /** 当前组合场景入口 */
  item: PatternEntry;
}

const PatternCard = (props: PatternCardProps) => {
  const { item } = props;

  const router = useRouter();

  function handlePress() {
    router.push(item.href);
  }

  return (
    <Pressable
      accessibilityHint={`打开${item.title}相关组件示例`}
      accessibilityRole="button"
      className="gap-4 rounded-2xl border border-border/60 bg-secondary/35 p-4 active:scale-[0.99] active:opacity-80"
      onPress={handlePress}
    >
      <View className="flex-row items-start gap-3">
        <View className="size-11 items-center justify-center rounded-xl bg-primary/10">
          <PatternIcon
            colorClassName="accent-primary"
            name={item.icon}
            size={23}
          />
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-base font-semibold text-foreground">{item.title}</Text>
            <View className="rounded-full bg-primary/10 px-2.5 py-1">
              <Text className="text-xs font-medium text-primary">可交互</Text>
            </View>
          </View>
          <Text className="text-sm leading-5 text-muted-foreground">{item.description}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-1.5">
        {item.components.map(component => (
          <View
            className="rounded-lg border border-border/60 bg-background px-2.5 py-1.5"
            key={component}
          >
            <Text className="text-xs font-medium text-foreground">{component}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-between border-t border-border/60 pt-3">
        <Text className="text-xs font-semibold text-primary">{item.index}</Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-medium text-foreground">进入场景</Text>
          <PatternIcon
            colorClassName="accent-muted-foreground"
            name="arrow-forward"
            size={18}
          />
        </View>
      </View>
    </Pressable>
  );
};

const PatternsScreen = () => {
  return (
    <View className="flex-1 bg-background pt-safe">
      <View className="gap-2 px-5 pb-4 pt-5">
        <Text className="text-2xl font-bold text-foreground">组合场景</Text>
        <Text className="text-sm leading-5 text-muted-foreground">
          从组件能力进入真实任务，检查组合、状态与反馈闭环
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pb-safe-offset-28 pt-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4 rounded-2xl bg-primary p-5">
          <View className="size-11 items-center justify-center rounded-xl bg-primary-foreground/15">
            <PatternIcon
              colorClassName="accent-primary-foreground"
              name="route"
              size={24}
            />
          </View>
          <View className="gap-1.5">
            <Text className="text-lg font-semibold text-primary-foreground">从单组件到完整任务</Text>
            <Text className="text-sm leading-5 text-primary-foreground/75">
              每个入口组合多个相关能力，逐步覆盖正常、错误、加载、禁用和成功状态。
            </Text>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1 rounded-xl bg-primary-foreground/10 px-3 py-2.5">
              <Text className="text-lg font-bold text-primary-foreground">6</Text>
              <Text className="text-xs text-primary-foreground/70">任务场景</Text>
            </View>
            <View className="flex-1 rounded-xl bg-primary-foreground/10 px-3 py-2.5">
              <Text className="text-lg font-bold text-primary-foreground">5+</Text>
              <Text className="text-xs text-primary-foreground/70">组合能力</Text>
            </View>
            <View className="flex-1 rounded-xl bg-primary-foreground/10 px-3 py-2.5">
              <Text className="text-lg font-bold text-primary-foreground">完整</Text>
              <Text className="text-xs text-primary-foreground/70">交互闭环</Text>
            </View>
          </View>
        </View>

        <View className="gap-1 px-1 pt-2">
          <Text className="text-lg font-semibold text-foreground">场景清单</Text>
          <Text className="text-sm text-muted-foreground">选择一个任务，进入当前最相关的组件示例</Text>
        </View>

        {PATTERN_ENTRIES.map(item => (
          <PatternCard
            item={item}
            key={item.title}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default PatternsScreen;
