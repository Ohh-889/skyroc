'use client';

import {
  ArrowRight,
  Bluetooth,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  CircleX,
  Download,
  Eye,
  EyeOff,
  Globe,
  Heart,
  ImageOff,
  Link,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Plus,
  Printer,
  QrCode,
  Search,
  SlidersHorizontal,
  Smartphone,
  Star,
  User,
  Wifi,
  X
} from 'lucide-react';
import type { CSSProperties } from 'react';

/**
 * `@expo/vector-icons` 的 web 替身。
 *
 * 真包在 Next + Turbopack 下跑不起来：它经 expo-font 依赖 expo-modules-core 的原生桥
 * （react-native-web 没有 TurboModuleRegistry），而 expo-font 的 web 实现又 import 了
 * node:async_hooks —— 那是给 Expo Router 的 SSR 分包用的，Metro 会拆 server/client，Next 不会，
 * 于是 node 内建模块被塞进浏览器 chunk，Turbopack 直接 panic。
 *
 * 文档站只需要图标的视觉占位，所以统一用 lucide-react 渲染等价字形。
 * next.config.mjs 里把 AntDesign / Feather / FontAwesome / Ionicons / MaterialIcons / Octicons
 * 六个入口都 alias 到本文件。少 alias 一个都会把真包拖回来：它的 createIconSet.js 在 node_modules
 * 里直接发未编译的 JSX，next build 走到 chunk 拼装时会以 "Expected ';', got 'ident'" panic。
 *
 * 注意：这里只覆盖 @skyroc/native-ui 当前用到的图标名，新增图标要同步补 ICON_MAP。
 */

const ICON_MAP = {
  'arrow-right': ArrowRight,
  bluetooth: Bluetooth,
  'broken-image': ImageOff,
  'caret-down': ChevronDown,
  'caret-up': ChevronUp,
  check: Check,
  'check-circle': CircleCheck,
  checkmark: Check,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  close: X,
  'close-circle': CircleX,
  down: ChevronDown,
  download: Download,
  'eye-off-outline': EyeOff,
  'eye-outline': Eye,
  heart: Heart,
  'heart-outline': Heart,
  left: ChevronLeft,
  link: Link,
  mail: Mail,
  'map-pin': MapPin,
  minus: Minus,
  'more-horiz': MoreHorizontal,
  'more-horizontal': MoreHorizontal,
  person: User,
  plus: Plus,
  printer: Printer,
  qq: MessageCircle,
  qrcode: QrCode,
  'reorder-two': Menu,
  right: ChevronRight,
  search: Search,
  sliders: SlidersHorizontal,
  smartphone: Smartphone,
  star: Star,
  'star-outline': Star,
  up: ChevronUp,
  wechat: MessageCircle,
  weibo: Globe,
  wifi: Wifi
} as const;

interface ExpoVectorIconProps {
  /** 字形颜色。uniwind 的 withUniwind HOC 会把 `accent-*` 工具类映射成这个 prop */
  color?: string;

  /** 图标名，沿用 @expo/vector-icons 各字体集的原始命名 */
  name: string;

  /** 字形边长，单位 px */
  size?: number;

  /** react-native-web 透传下来的行内样式 */
  style?: CSSProperties;
}

const ExpoVectorIcon = (props: ExpoVectorIconProps) => {
  const { color = 'currentColor', name, size = 24, style } = props;

  const Icon = ICON_MAP[name as keyof typeof ICON_MAP];

  if (!Icon) {
    if (__DEV__) {
      console.warn(`[expo-vector-icons shim] 未映射的图标名 "${name}"，请在 ICON_MAP 中补充。`);
    }

    return null;
  }

  return (
    <Icon
      color={color}
      size={size}
      style={style}
    />
  );
};

export default ExpoVectorIcon;
