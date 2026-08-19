import {
  BellRing,
  Compass,
  Database,
  FormInput,
  Hand,
  Keyboard,
  Layers3,
  MousePointerClick,
  PanelTop,
  Palette,
  ShieldCheck,
  Smartphone,
  Type
} from 'lucide-react';

export const PLATFORM_FEATURES = [
  {
    description: '按下态、手势与 44pt 触摸热区进入组件默认行为，不再由业务页面反复补齐。',
    icon: Hand,
    title: '触摸是第一输入方式'
  },
  {
    description: '安全区域、原生弹层和键盘避让围绕 iOS 与 Android 的真实运行环境设计。',
    icon: ShieldCheck,
    title: '平台边界内置于契约'
  },
  {
    description: 'Uniwind 语义色与 TypeScript 类型让组件、主题和业务代码保持同一种表达。',
    icon: Smartphone,
    title: '一套界面语言，两端交付'
  },
  {
    description: '主题色、状态色与暗色模式全部来自统一语义令牌，业务侧不需要维护平行色板。',
    icon: Palette,
    title: '语义主题保持同源'
  },
  {
    description: '输入、键盘、焦点与禁用状态按原生控件行为组织，避免只验证视觉结果。',
    icon: Keyboard,
    title: '输入行为面向设备'
  },
  {
    description: '公开 Props、Ref 与回调都有明确类型，文档用法直接对应组件源码。',
    icon: Type,
    title: '类型就是使用边界'
  }
] as const;

export const COMPONENT_CATEGORIES = [
  {
    accentClassName: 'bg-primary/10 text-primary',
    description: '触发操作、呈现文字与组织基础视觉节奏。',
    href: '/docs/components/button',
    icon: MousePointerClick,
    items: ['Button', 'Text', 'Image', 'Divider', 'FloatingButton'],
    title: '通用'
  },
  {
    accentClassName: 'bg-info/10 text-info',
    description: '从表单输入到日期、选择器和移动键盘。',
    href: '/docs/components/form',
    icon: FormInput,
    items: ['Form', 'Field', 'Picker', 'Calendar', 'NumberKeyboard'],
    title: '输入'
  },
  {
    accentClassName: 'bg-success/10 text-success',
    description: '表达头像、状态、计数与可滑动的数据条目。',
    href: '/docs/components/avatar',
    icon: Database,
    items: ['Avatar', 'Badge', 'Tag', 'CountDown', 'SwipeCell'],
    title: '数据展示'
  },
  {
    accentClassName: 'bg-warning/10 text-warning',
    description: '承载弹窗、底部面板与移动端快捷操作。',
    href: '/docs/components/popup',
    icon: PanelTop,
    items: ['Popup', 'Dialog', 'Sheet', 'ActionSheet', 'ShareSheet'],
    title: '弹层覆盖'
  },
  {
    accentClassName: 'bg-primary/10 text-primary',
    description: '组织页面位置、分页路径与长内容锚点。',
    href: '/docs/components/navbar',
    icon: Compass,
    items: ['NavBar', 'Tabs', 'Sidebar', 'IndexBar', 'Pagination'],
    title: '导航'
  },
  {
    accentClassName: 'bg-info/10 text-info',
    description: '建立移动列表、网格、间距与折叠层级。',
    href: '/docs/components/space',
    icon: Layers3,
    items: ['Space', 'Grid', 'Cell', 'Collapse'],
    title: '布局容器'
  },
  {
    accentClassName: 'bg-destructive/10 text-destructive',
    description: '让操作结果在正确位置和时机被用户感知。',
    href: '/docs/components/toast',
    icon: BellRing,
    items: ['Toast', 'Notify'],
    title: '反馈'
  }
] as const;
