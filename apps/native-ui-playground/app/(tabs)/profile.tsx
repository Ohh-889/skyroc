import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, Text } from '@skyroc/native-ui';
import type { ComponentProps } from 'react';
import { ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { COMPONENT_COUNT } from '@/src/component-catalog';
import wechatContactQr from '../../assets/images/wechat-contact-qr.jpg';

type ProfileIconName = ComponentProps<typeof MaterialIcons>['name'];

interface CapabilityEntry {
  /** 能力方向的简短说明 */
  description: string;
  /** 能力方向对应的图标 */
  icon: ProfileIconName;
  /** 能力方向名称 */
  title: string;
}

interface ServiceEntry {
  /** 服务范围的补充说明 */
  description: string;
  /** 可承接的服务名称 */
  title: string;
}

const CAPABILITY_ENTRIES: readonly CapabilityEntry[] = [
  {
    description: '面向 iOS、Android、微信小程序与浏览器，兼顾体验和交付效率。',
    icon: 'devices',
    title: 'App · 小程序 · Web'
  },
  {
    description: '使用 Next.js 构建官网、管理平台、内容产品与全栈 Web 应用。',
    icon: 'web',
    title: 'Next.js 全栈应用'
  },
  {
    description: '使用 Hono、NestJS 与 Python 设计接口、业务服务和后台能力。',
    icon: 'dns',
    title: '服务端与 API'
  }
];

const SERVICE_ENTRIES: readonly ServiceEntry[] = [
  { description: '从需求梳理到 App、小程序和 Web 端完整交付', title: '跨端产品开发' },
  { description: '管理后台、业务工作台、数据录入与权限系统', title: '中后台系统' },
  { description: '设计系统、业务组件封装与现有界面还原', title: 'UI 组件与页面实现' },
  { description: '功能新增、接口联调、体验优化与疑难问题修复', title: '现有项目迭代' }
];

const COOPERATION_STEPS = ['需求沟通', '方案确认', '开发交付', '维护迭代'] as const;
const ProfileIcon = withUniwind(MaterialIcons);

interface CapabilityCardProps {
  /** 当前展示的能力方向 */
  item: CapabilityEntry;
}

const CapabilityCard = (props: CapabilityCardProps) => {
  const { item } = props;

  return (
    <View className="flex-row items-start gap-3 rounded-2xl border border-border/60 bg-secondary/35 p-4">
      <View className="size-11 items-center justify-center rounded-xl bg-primary/10">
        <ProfileIcon
          colorClassName="accent-primary"
          name={item.icon}
          size={23}
        />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-foreground">{item.title}</Text>
        <Text className="text-sm leading-5 text-muted-foreground">{item.description}</Text>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <View className="flex-1 bg-background pt-safe">
      <View className="gap-2 px-5 pb-4 pt-5">
        <Text className="text-2xl font-bold text-foreground">我的</Text>
        <Text className="text-sm leading-5 text-muted-foreground">关于 Native UI、开发能力与定制合作</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pb-safe-offset-28 pt-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5 rounded-3xl bg-primary p-5">
          <View className="size-12 items-center justify-center rounded-2xl bg-primary-foreground/15">
            <ProfileIcon
              colorClassName="accent-primary-foreground"
              name="auto-awesome"
              size={25}
            />
          </View>

          <View className="gap-2">
            <Text className="text-xl font-bold leading-7 text-primary-foreground">
              Native UI，面向真实业务的 React Native 组件库
            </Text>
            <Text className="text-sm leading-6 text-primary-foreground/75">
              基于 Expo 与 Uniwind 构建，关注一致的组件 API、原生交互体验、主题适配和跨端开发效率。
            </Text>
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1 rounded-xl bg-primary-foreground/10 px-3 py-3">
              <Text className="text-xl font-bold text-primary-foreground">{COMPONENT_COUNT}</Text>
              <Text className="text-xs text-primary-foreground/70">UI 组件</Text>
            </View>
            <View className="flex-1 rounded-xl bg-primary-foreground/10 px-3 py-3">
              <Text className="text-base font-bold text-primary-foreground">Expo</Text>
              <Text className="text-xs text-primary-foreground/70">原生能力</Text>
            </View>
            <View className="flex-1 rounded-xl bg-primary-foreground/10 px-3 py-3">
              <Text className="text-base font-bold text-primary-foreground">Uniwind</Text>
              <Text className="text-xs text-primary-foreground/70">主题样式</Text>
            </View>
          </View>
        </View>

        <View className="gap-3">
          <View className="gap-1 px-1">
            <Text className="text-lg font-semibold text-foreground">开发能力</Text>
            <Text className="text-sm text-muted-foreground">覆盖客户端、Web 全栈与服务端开发</Text>
          </View>
          {CAPABILITY_ENTRIES.map(item => (
            <CapabilityCard
              item={item}
              key={item.title}
            />
          ))}
          <View className="flex-row flex-wrap gap-2 px-1">
            {['App', '小程序', 'Web', 'Next.js', 'Hono', 'NestJS', 'Python'].map(technology => (
              <View
                className="rounded-lg bg-primary/10 px-3 py-2"
                key={technology}
              >
                <Text className="text-xs font-semibold text-primary">{technology}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-4 rounded-2xl border border-border/60 bg-secondary/35 p-5">
          <View className="gap-1">
            <Text className="text-lg font-semibold text-foreground">可承接的定制开发</Text>
            <Text className="text-sm leading-5 text-muted-foreground">适合从零开发，也可以接手已有项目继续迭代</Text>
          </View>

          <View className="gap-4">
            {SERVICE_ENTRIES.map(service => (
              <View
                className="flex-row items-start gap-3"
                key={service.title}
              >
                <View className="mt-0.5 size-6 items-center justify-center rounded-full bg-success/15">
                  <ProfileIcon
                    colorClassName="accent-success"
                    name="check"
                    size={16}
                  />
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="font-medium text-foreground">{service.title}</Text>
                  <Text className="text-sm leading-5 text-muted-foreground">{service.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-3">
          <View className="gap-1 px-1">
            <Text className="text-lg font-semibold text-foreground">合作流程</Text>
            <Text className="text-sm text-muted-foreground">过程透明，按阶段确认目标与交付结果</Text>
          </View>
          <View className="flex-row gap-2">
            {COOPERATION_STEPS.map((step, index) => (
              <View
                className="flex-1 items-center gap-2 rounded-xl bg-secondary/60 px-1 py-3"
                key={step}
              >
                <View className="size-7 items-center justify-center rounded-full bg-primary">
                  <Text className="text-xs font-bold text-primary-foreground">{index + 1}</Text>
                </View>
                <Text className="text-center text-xs font-medium text-foreground">{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-4 rounded-3xl border border-border/60 bg-secondary/35 p-5">
          <View className="flex-row items-center gap-3">
            <View className="size-11 items-center justify-center rounded-xl bg-primary/10">
              <ProfileIcon
                colorClassName="accent-primary"
                name="qr-code-2"
                size={24}
              />
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-lg font-semibold text-foreground">微信联系</Text>
              <Text className="text-sm text-muted-foreground">扫码添加好友，沟通定制开发需求</Text>
            </View>
          </View>

          <View className="overflow-hidden rounded-2xl border border-border bg-white p-2">
            <Image
              accessibilityLabel="微信联系二维码"
              className="aspect-[0.7626] w-full"
              src={wechatContactQr}
            />
          </View>

          <View className="rounded-xl bg-primary/10 px-4 py-3">
            <Text className="text-center text-sm font-medium text-primary">添加时请备注：定制开发 + 项目类型</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
