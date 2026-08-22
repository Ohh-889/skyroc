import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Cell, CellGroup, Text } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { DemoHeader } from './modules/DemoHeader';

const Icon = withUniwind(MaterialCommunityIcons);

/** 一条演示入口 */
interface DemoEntry {
  /** 这一页重点演示的 API */
  api: string;

  href: Href;

  icon: keyof typeof MaterialCommunityIcons.glyphMap;

  subtitle: string;

  title: string;
}

const LIST_ENTRIES: DemoEntry[] = [
  {
    api: 'QueryList · params 进 queryKey · 错误重试 · 空态',
    href: '/demo/orders',
    icon: 'receipt-text-outline',
    subtitle: '分段筛选切换自动重新分页，带失败开关',
    title: '我的订单'
  },
  {
    api: 'useInfiniteList + List · updateItem · 客户端日期分组',
    href: '/demo/messages',
    icon: 'bell-outline',
    subtitle: '类型筛选、未读概览，点一条就地标已读',
    title: '消息中心'
  },
  {
    api: 'QueryList + useQuery · 防抖关键词 · 服务端下发组头',
    href: '/demo/contacts',
    icon: 'account-search-outline',
    subtitle: '常用联系人不分页，下面的部门列表分页',
    title: '通讯录'
  },
  {
    api: 'collapsed / onExpand · renderFooter · 时间轴',
    href: '/demo/activity',
    icon: 'timeline-text-outline',
    subtitle: '默认只加载第一页，点开才继续往下翻',
    title: '操作日志'
  }
];

/** 原生能力演示，和上面的列表场景无关，单独一组免得混进 src/feature/list 的叙述里 */
const NATIVE_ENTRIES: DemoEntry[] = [
  {
    api: 'openMapLink · canOpenURL 探测 · showActionSheet',
    href: '/demo/map',
    icon: 'map-marker-radius-outline',
    subtitle: '选高德 / 百度 / 腾讯 / Apple 地图起导航，都没装则跳 H5',
    title: '地图导航演示'
  },
  {
    api: 'ensureBluetoothReady · getBluetoothState · 状态变化事件',
    href: '/demo/bluetooth',
    icon: 'bluetooth',
    subtitle: '蓝牙状态、权限与引导开启，两端差异都摆在页面上',
    title: '蓝牙能力测试'
  },
  {
    api: 'sendWechatAuth · share* 九种类型 · Universal Link 自检',
    href: '/demo/wechat',
    icon: 'wechat',
    subtitle: '微信登录授权与各类分享的真机测试台',
    title: '微信能力测试'
  },
  {
    api: 'createLiveActivity · start / update / end · pushToken',
    href: '/demo/live-activity',
    icon: 'cellphone-dock',
    subtitle: '门诊排队叫号推到锁屏和灵动岛，带到场倒计时',
    title: '灵动岛排队叫号'
  }
];

export default function PagesIndexScreen() {
  const router = useRouter();

  const renderEntry = (entry: DemoEntry) => (
    <Cell
      showArrow
      key={entry.title}
      title={entry.title}
      onPress={() => router.push(entry.href)}
      leading={
        <View className="size-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon
            colorClassName="accent-primary"
            name={entry.icon}
            size={20}
          />
        </View>
      }
      subtitle={
        <View className="gap-1">
          <Text
            color="muted"
            size="sm"
          >
            {entry.subtitle}
          </Text>

          <Text
            color="muted"
            size="xs"
          >
            {entry.api}
          </Text>
        </View>
      }
    />
  );

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title="组件演示" />

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-4 px-4 py-5"
      >
        <View className="gap-2">
          <Text
            size="xl"
            weight="semibold"
          >
            四种真实列表场景
          </Text>

          <Text
            color="muted"
            size="sm"
          >
            全部基于 src/feature/list 的两个组件和一个 hook：不分页用 List，分页用 QueryList，要拿到数据就用
            useInfiniteList 配 List。
          </Text>
        </View>

        <CellGroup
          inset
          title="演示页面"
        >
          {LIST_ENTRIES.map(renderEntry)}
        </CellGroup>

        <CellGroup
          inset
          title="原生能力"
        >
          {NATIVE_ENTRIES.map(renderEntry)}
        </CellGroup>
      </ScrollView>
    </View>
  );
}
