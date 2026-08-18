import {
  Blocks,
  BookOpenText,
  Boxes,
  Braces,
  Compass,
  Database,
  FormInput,
  Layers3,
  MousePointerClick,
  PanelTop,
  Route,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export const COMPONENT_CATEGORIES = [
  {
    accentClassName: 'bg-primary/10 text-primary',
    description: '基础操作、图标、键盘提示与内容分隔。',
    href: '/components/button',
    icon: MousePointerClick,
    items: ['Button', 'Icon', 'KeyboardKey', 'Layout', 'Divider'],
    title: '通用'
  },
  {
    accentClassName: 'bg-info/10 text-info',
    description: '覆盖文本、选择、校验与复杂表单输入。',
    href: '/components/input',
    icon: FormInput,
    items: ['Input', 'Select', 'Checkbox', 'Radio', 'Form', 'Slider'],
    title: '输入'
  },
  {
    accentClassName: 'bg-success/10 text-success',
    description: '让内容、状态与复杂数据更易于扫描。',
    href: '/components/card',
    icon: Database,
    items: ['Card', 'Badge', 'Tag', 'Avatar', 'Tree', 'Progress'],
    title: '数据展示'
  },
  {
    accentClassName: 'bg-warning/10 text-warning',
    description: '承载模态任务、浮层信息与快捷操作。',
    href: '/components/dialog',
    icon: PanelTop,
    items: ['Dialog', 'Drawer', 'Popover', 'Tooltip', 'Command'],
    title: '弹层覆盖'
  },
  {
    accentClassName: 'bg-primary/10 text-primary',
    description: '组织页面层级、位置与连续任务路径。',
    href: '/components/tabs',
    icon: Compass,
    items: ['Tabs', 'Segment', 'Breadcrumb', 'Pagination', 'Menubar'],
    title: '导航'
  },
  {
    accentClassName: 'bg-info/10 text-info',
    description: '处理折叠、缩放、滚动与内容比例。',
    href: '/components/accordion',
    icon: Layers3,
    items: ['Accordion', 'Collapsible', 'Resizable', 'ScrollArea'],
    title: '布局容器'
  },
  {
    accentClassName: 'bg-destructive/10 text-destructive',
    description: '为状态变化提供明确且一致的反馈。',
    href: '/components/alert',
    icon: Sparkles,
    items: ['Alert', 'Toggle', 'ToggleGroup'],
    title: '反馈'
  },
  {
    accentClassName: 'bg-warning/10 text-warning',
    description: '供复杂组件复用的几何与行为基础。',
    href: '/components/arrow',
    icon: Braces,
    items: ['Arrow'],
    title: '底层原语'
  }
] as const;

export const DOCUMENTATION_PATHS = [
  {
    description: '完成安装、Provider 配置与第一个组件接入。',
    href: '/overview/getting-started',
    icon: BookOpenText,
    label: '01 · GET STARTED',
    title: '开始使用 Skyroc UI'
  },
  {
    description: '理解语义颜色、尺寸、圆角与主题令牌。',
    href: '/overview/design-system',
    icon: SlidersHorizontal,
    label: '02 · DESIGN SYSTEM',
    title: '建立一致的视觉语言'
  },
  {
    description: '按表单、弹层、导航与反馈任务选择组件。',
    href: '/overview/usage-guides',
    icon: Route,
    label: '03 · USAGE GUIDES',
    title: '沿真实界面任务组合'
  }
] as const;

export const HERO_ENTRIES = [
  {
    description: '按类别浏览 54 个组件与完整 API',
    href: '/components/button',
    icon: Boxes,
    label: 'COMPONENTS',
    title: '查找组件'
  },
  {
    description: '安装、配置并接入第一个界面',
    href: '/overview/getting-started',
    icon: BookOpenText,
    label: 'GET STARTED',
    title: '开始构建'
  },
  {
    description: '从令牌到组合原则理解系统边界',
    href: '/overview/design-system',
    icon: Blocks,
    label: 'FOUNDATION',
    title: '阅读设计系统'
  }
] as const;

export const HOME_METRICS = [
  { label: 'Components', value: '54' },
  { label: 'Categories', value: '8' },
  { label: 'Foundation', value: 'Radix UI' }
] as const;

export const FOOTER_LINKS = [
  { href: '/components/button', label: '组件' },
  { href: '/overview/introduction', label: '概览' },
  { href: 'https://admin-docs.skyroc.me/docs/web/ui', label: 'Admin Docs' }
] as const;
