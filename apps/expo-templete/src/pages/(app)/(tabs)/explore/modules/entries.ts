import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { Href } from 'expo-router';

/** 一条演示入口 */
export interface DemoEntry {
  /** 这一页重点演示的 API */
  api: string;

  href: Href;

  icon: keyof typeof MaterialCommunityIcons.glyphMap;

  subtitle: string;

  title: string;
}

/** 一组演示入口 */
export interface DemoEntryGroup {
  entries: DemoEntry[];

  title: string;
}

/**
 * 模板的能力目录。
 *
 * 新增演示页时往这里加一条就会出现在「发现」tab；业务项目上线前把整份文件连同 `src/app/(app)/demo` 一起删掉，这个 tab 换成自己的内容即可。
 */
export const DEMO_ENTRY_GROUPS: DemoEntryGroup[] = [
  {
    title: '四种真实列表场景',
    entries: [
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
    ]
  },
  {
    title: '地基',
    entries: [
      {
        api: 'useThemeMode · Uniwind.setTheme · SecureStore 持久化',
        href: '/demo/theme',
        icon: 'palette-outline',
        subtitle: '亮 / 暗 / 跟随系统三态，顺带把整套语义色和尺度过一遍',
        title: '主题与 Token'
      },
      {
        api: 'useLocale · setupI18n · format 统一入口 · i18next 插值与复数',
        href: '/demo/i18n',
        icon: 'translate',
        subtitle: '中英 / 跟随系统三态，切换当场生效，日期数字货币都走同一个入口',
        title: '国际化'
      },
      {
        api: 'FieldGroup · FormItem · FormList · valuePropName / trigger',
        href: '/demo/form',
        icon: 'form-select',
        subtitle: '一屏过完输入与选择控件，含异步、联动、服务端回填五种校验',
        title: '表单解决方案'
      }
    ]
  },
  {
    title: '原生能力',
    entries: [
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
    ]
  }
];
