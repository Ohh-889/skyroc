import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import type { Locale } from '../../../i18n/config';

interface ComponentInfo {
  description: string;
  keywords: string[];
  title: string;
}

// English component info
const componentsInfoEn: Record<string, ComponentInfo> = {
  accordion: {
    title: 'Accordion',
    description: 'Skyroc UI Accordion Component - Collapsible panel, supports single, multiple, custom icons and more.',
    keywords: ['accordion', 'collapsible', 'collapse', 'panel']
  },
  alert: {
    title: 'Alert',
    description: 'Skyroc UI Alert Component - Alert notification component with multiple colors, sizes, and variants.',
    keywords: ['alert', 'warning', 'notification', 'message']
  },
  'alert-dialog': {
    title: 'AlertDialog',
    description: 'Skyroc UI AlertDialog Component - Confirmation dialog for important action confirmations.',
    keywords: ['alert-dialog', 'dialog', 'confirm', 'modal']
  },
  'aspect-ratio': {
    title: 'AspectRatio',
    description: 'Skyroc UI AspectRatio Component - Container that maintains fixed aspect ratio.',
    keywords: ['aspect-ratio', 'ratio', 'container']
  },
  avatar: {
    title: 'Avatar',
    description: 'Skyroc UI Avatar Component - Avatar with image, text fallback, and avatar groups.',
    keywords: ['avatar', 'profile', 'user', 'image']
  },
  badge: {
    title: 'Badge',
    description: 'Skyroc UI Badge Component - Badge with multiple colors, shapes, and variants.',
    keywords: ['badge', 'tag', 'label', 'status']
  },
  breadcrumb: {
    title: 'Breadcrumb',
    description: 'Skyroc UI Breadcrumb Component - Navigation showing current page location in hierarchy.',
    keywords: ['breadcrumb', 'navigation', 'path', 'trail']
  },
  button: {
    title: 'Button',
    description: 'Skyroc UI Button Component - Button with multiple colors, sizes, shapes, and loading states.',
    keywords: ['button', 'click', 'action', 'submit']
  },
  card: {
    title: 'Card',
    description: 'Skyroc UI Card Component - Card container for information display and grouping.',
    keywords: ['card', 'container', 'panel', 'box']
  },
  carousel: {
    title: 'Carousel',
    description: 'Skyroc UI Carousel Component - Carousel with autoplay, multiple images, and vertical direction.',
    keywords: ['carousel', 'slider', 'swiper', 'gallery']
  },
  checkbox: {
    title: 'Checkbox',
    description: 'Skyroc UI Checkbox Component - Checkbox with multiple colors and sizes.',
    keywords: ['checkbox', 'check', 'select', 'option']
  },
  chip: {
    title: 'Chip',
    description: 'Skyroc UI Chip Component - Chip for displaying status or markers.',
    keywords: ['chip', 'tag', 'dot', 'indicator']
  },
  collapsible: {
    title: 'Collapsible',
    description: 'Skyroc UI Collapsible Component - Collapsible content area.',
    keywords: ['collapsible', 'collapse', 'expand', 'toggle']
  },
  combobox: {
    title: 'Combobox',
    description: 'Skyroc UI Combobox Component - Searchable dropdown select.',
    keywords: ['combobox', 'autocomplete', 'search', 'select']
  },
  command: {
    title: 'Command',
    description: 'Skyroc UI Command Component - Command palette for quick execution and search.',
    keywords: ['command', 'cmdk', 'command palette', 'search']
  },
  'context-menu': {
    title: 'ContextMenu',
    description: 'Skyroc UI ContextMenu Component - Right-click context menu.',
    keywords: ['context-menu', 'right-click', 'menu', 'popup']
  },
  dialog: {
    title: 'Dialog',
    description: 'Skyroc UI Dialog Component - Modal dialog for user interaction and information display.',
    keywords: ['dialog', 'modal', 'popup', 'overlay']
  },
  divider: {
    title: 'Divider',
    description: 'Skyroc UI Divider Component - Divider for content separation.',
    keywords: ['divider', 'separator', 'line', 'hr']
  },
  drawer: {
    title: 'Drawer',
    description: 'Skyroc UI Drawer Component - Drawer panel that slides from screen edge.',
    keywords: ['drawer', 'slide', 'panel', 'sidebar']
  },
  'dropdown-menu': {
    title: 'DropdownMenu',
    description: 'Skyroc UI DropdownMenu Component - Trigger-based dropdown menu.',
    keywords: ['dropdown-menu', 'menu', 'dropdown', 'popup']
  },
  form: {
    title: 'Form',
    description: 'Skyroc UI Form Component - Form with data collection, validation, and submission.',
    keywords: ['form', 'input', 'validation', 'submit']
  },
  'hover-card': {
    title: 'HoverCard',
    description: 'Skyroc UI HoverCard Component - Preview card shown on hover.',
    keywords: ['hover-card', 'preview', 'tooltip', 'popup']
  },
  icon: {
    title: 'Icon',
    description: 'Skyroc UI Icon Component - Icon with Iconify library integration.',
    keywords: ['icon', 'iconify', 'svg', 'symbol']
  },
  input: {
    title: 'Input',
    description: 'Skyroc UI Input Component - Input with multiple types and states.',
    keywords: ['input', 'text', 'field', 'textbox']
  },
  'input-otp': {
    title: 'InputOTP',
    description: 'Skyroc UI InputOTP Component - One-time password/verification code input.',
    keywords: ['input-otp', 'otp', 'verification', 'code']
  },
  'keyboard-key': {
    title: 'KeyboardKey',
    description: 'Skyroc UI KeyboardKey Component - Display keyboard keys.',
    keywords: ['keyboard-key', 'shortcut', 'hotkey', 'key']
  },
  label: {
    title: 'Label',
    description: 'Skyroc UI Label Component - Form label.',
    keywords: ['label', 'form', 'text', 'field']
  },
  list: {
    title: 'List',
    description: 'Skyroc UI List Component - List for displaying items with title, description, and icons.',
    keywords: ['list', 'item', 'content', 'menu']
  },
  'navigation-menu': {
    title: 'NavigationMenu',
    description: 'Skyroc UI NavigationMenu Component - Horizontal navigation menu.',
    keywords: ['navigation-menu', 'nav', 'menu', 'header']
  },
  pagination: {
    title: 'Pagination',
    description: 'Skyroc UI Pagination Component - Pagination with multiple variants, sizes, and shapes.',
    keywords: ['pagination', 'pager', 'page', 'navigation']
  },
  password: {
    title: 'Password',
    description: 'Skyroc UI Password Component - Password input with visibility toggle and clearable button.',
    keywords: ['password', 'input', 'security', 'visibility']
  },
  popover: {
    title: 'Popover',
    description: 'Skyroc UI Popover Component - Popover for displaying more content.',
    keywords: ['popover', 'popup', 'overlay', 'tooltip']
  },
  progress: {
    title: 'Progress',
    description: 'Skyroc UI Progress Component - Progress bar showing operation progress.',
    keywords: ['progress', 'loading', 'bar', 'indicator']
  },
  radio: {
    title: 'Radio',
    description: 'Skyroc UI Radio Component - Radio button for single selection.',
    keywords: ['radio', 'select', 'option', 'choice']
  },
  resizable: {
    title: 'Resizable',
    description: 'Skyroc UI Resizable Component - Resizable panel.',
    keywords: ['resizable', 'resize', 'panel', 'split']
  },
  'scroll-area': {
    title: 'ScrollArea',
    description: 'Skyroc UI ScrollArea Component - Scroll area with custom scrollbar.',
    keywords: ['scroll-area', 'scrollbar', 'overflow', 'scroll']
  },
  select: {
    title: 'Select',
    description: 'Skyroc UI Select Component - Dropdown selector.',
    keywords: ['select', 'dropdown', 'option', 'choice']
  },
  sheet: {
    title: 'Sheet',
    description: 'Skyroc UI Sheet Component - Side panel.',
    keywords: ['sheet', 'sidebar', 'panel', 'drawer']
  },
  skeleton: {
    title: 'Skeleton',
    description: 'Skyroc UI Skeleton Component - Skeleton loading placeholder.',
    keywords: ['skeleton', 'loading', 'placeholder', 'shimmer']
  },
  slider: {
    title: 'Slider',
    description: 'Skyroc UI Slider Component - Slider for selecting numeric range.',
    keywords: ['slider', 'range', 'input', 'value']
  },
  sonner: {
    title: 'Sonner',
    description: 'Skyroc UI Sonner Component - Toast notification.',
    keywords: ['sonner', 'toast', 'notification', 'alert']
  },
  tabs: {
    title: 'Tabs',
    description: 'Skyroc UI Tabs Component - Tabs for content switching.',
    keywords: ['tabs', 'tab', 'panel', 'switch']
  },
  textarea: {
    title: 'Textarea',
    description: 'Skyroc UI Textarea Component - Multi-line text input.',
    keywords: ['textarea', 'text', 'multiline', 'input']
  },
  toggle: {
    title: 'Toggle',
    description: 'Skyroc UI Toggle Component - Toggle button.',
    keywords: ['toggle', 'switch', 'button', 'on-off']
  },
  'toggle-group': {
    title: 'ToggleGroup',
    description: 'Skyroc UI ToggleGroup Component - Toggle button group.',
    keywords: ['toggle-group', 'button-group', 'segment', 'tabs']
  },
  tooltip: {
    title: 'Tooltip',
    description: 'Skyroc UI Tooltip Component - Text hint shown on hover.',
    keywords: ['tooltip', 'hint', 'tip', 'hover']
  },
  tree: {
    title: 'Tree',
    description:
      'Skyroc UI Tree Component - Hierarchical tree structure with expand/collapse, selection, and virtual scrolling.',
    keywords: ['tree', 'treeview', 'hierarchy', 'folder']
  },
  virtualizer: {
    title: 'Virtualizer',
    description: 'Skyroc UI Virtualizer Component - High-performance virtual list and grid for large data rendering.',
    keywords: ['virtualizer', 'virtual-list', 'virtual-scroll', 'big-data']
  }
};

// Chinese component info
const componentsInfoZh: Record<string, ComponentInfo> = {
  accordion: {
    title: 'Accordion 手风琴',
    description: 'Skyroc UI Accordion 组件 - 可折叠面板，支持单选、多选、自定义图标等多种模式。',
    keywords: ['accordion', '手风琴', '折叠面板', 'collapse']
  },
  alert: {
    title: 'Alert 警告提示',
    description: 'Skyroc UI Alert 组件 - 警告提示组件，支持多种颜色、尺寸和变体。',
    keywords: ['alert', '警告', '提示', 'notification']
  },
  'alert-dialog': {
    title: 'AlertDialog 确认对话框',
    description: 'Skyroc UI AlertDialog 组件 - 确认对话框，用于重要操作的二次确认。',
    keywords: ['alert-dialog', '对话框', '确认框', 'confirm']
  },
  'aspect-ratio': {
    title: 'AspectRatio 宽高比',
    description: 'Skyroc UI AspectRatio 组件 - 保持内容固定宽高比的容器组件。',
    keywords: ['aspect-ratio', '宽高比', '比例容器']
  },
  avatar: {
    title: 'Avatar 头像',
    description: 'Skyroc UI Avatar 组件 - 头像组件，支持图片、文字回退和头像组。',
    keywords: ['avatar', '头像', 'profile', 'user']
  },
  badge: {
    title: 'Badge 徽章',
    description: 'Skyroc UI Badge 组件 - 徽章组件，支持多种颜色、形状和变体。',
    keywords: ['badge', '徽章', '标记', 'tag']
  },
  breadcrumb: {
    title: 'Breadcrumb 面包屑',
    description: 'Skyroc UI Breadcrumb 组件 - 面包屑导航，展示当前页面在系统层级结构中的位置。',
    keywords: ['breadcrumb', '面包屑', '导航', 'navigation']
  },
  button: {
    title: 'Button 按钮',
    description: 'Skyroc UI Button 组件 - 按钮组件，支持多种颜色、尺寸、形状和加载状态。',
    keywords: ['button', '按钮', 'click', 'action']
  },
  card: {
    title: 'Card 卡片',
    description: 'Skyroc UI Card 组件 - 卡片容器组件，用于信息展示和分组。',
    keywords: ['card', '卡片', '容器', 'container']
  },
  carousel: {
    title: 'Carousel 轮播图',
    description: 'Skyroc UI Carousel 组件 - 轮播图组件，支持自动播放、多图和垂直方向。',
    keywords: ['carousel', '轮播图', 'slider', 'swiper']
  },
  checkbox: {
    title: 'Checkbox 复选框',
    description: 'Skyroc UI Checkbox 组件 - 复选框组件，支持多种颜色和尺寸。',
    keywords: ['checkbox', '复选框', '选择', 'select']
  },
  chip: {
    title: 'Chip 标签',
    description: 'Skyroc UI Chip 组件 - 标签组件，用于展示状态或标记。',
    keywords: ['chip', '标签', '徽标', 'dot']
  },
  collapsible: {
    title: 'Collapsible 折叠',
    description: 'Skyroc UI Collapsible 组件 - 可折叠的内容区域。',
    keywords: ['collapsible', '折叠', 'expand', 'collapse']
  },
  combobox: {
    title: 'Combobox 组合框',
    description: 'Skyroc UI Combobox 组件 - 可搜索的下拉选择组件。',
    keywords: ['combobox', '组合框', '搜索选择', 'autocomplete']
  },
  command: {
    title: 'Command 命令面板',
    description: 'Skyroc UI Command 组件 - 命令面板，用于快速执行命令和搜索。',
    keywords: ['command', '命令面板', 'cmdk', 'command palette']
  },
  'context-menu': {
    title: 'ContextMenu 右键菜单',
    description: 'Skyroc UI ContextMenu 组件 - 右键上下文菜单。',
    keywords: ['context-menu', '右键菜单', '上下文菜单', 'menu']
  },
  dialog: {
    title: 'Dialog 对话框',
    description: 'Skyroc UI Dialog 组件 - 模态对话框，用于用户交互和信息展示。',
    keywords: ['dialog', '对话框', 'modal', 'popup']
  },
  divider: {
    title: 'Divider 分割线',
    description: 'Skyroc UI Divider 组件 - 分割线组件，用于内容分隔。',
    keywords: ['divider', '分割线', 'separator', 'line']
  },
  drawer: {
    title: 'Drawer 抽屉',
    description: 'Skyroc UI Drawer 组件 - 抽屉组件，从屏幕边缘滑出的面板。',
    keywords: ['drawer', '抽屉', 'slide', 'panel']
  },
  'dropdown-menu': {
    title: 'DropdownMenu 下拉菜单',
    description: 'Skyroc UI DropdownMenu 组件 - 下拉菜单，触发式弹出菜单。',
    keywords: ['dropdown-menu', '下拉菜单', 'menu', 'dropdown']
  },
  form: {
    title: 'Form 表单',
    description: 'Skyroc UI Form 组件 - 表单组件，支持数据收集、验证和提交。',
    keywords: ['form', '表单', 'input', 'validation']
  },
  'hover-card': {
    title: 'HoverCard 悬停卡片',
    description: 'Skyroc UI HoverCard 组件 - 悬停时显示的预览卡片。',
    keywords: ['hover-card', '悬停卡片', 'preview', 'tooltip']
  },
  icon: {
    title: 'Icon 图标',
    description: 'Skyroc UI Icon 组件 - 图标组件，集成 Iconify 图标库。',
    keywords: ['icon', '图标', 'iconify', 'svg']
  },
  input: {
    title: 'Input 输入框',
    description: 'Skyroc UI Input 组件 - 输入框组件，支持多种类型和状态。',
    keywords: ['input', '输入框', 'text', 'field']
  },
  'input-otp': {
    title: 'InputOTP 验证码输入',
    description: 'Skyroc UI InputOTP 组件 - 一次性密码/验证码输入组件。',
    keywords: ['input-otp', '验证码', 'otp', 'code']
  },
  'keyboard-key': {
    title: 'KeyboardKey 键盘键',
    description: 'Skyroc UI KeyboardKey 组件 - 展示键盘按键的组件。',
    keywords: ['keyboard-key', '键盘', 'shortcut', 'hotkey']
  },
  label: {
    title: 'Label 标签',
    description: 'Skyroc UI Label 组件 - 表单标签组件。',
    keywords: ['label', '标签', 'form', 'text']
  },
  list: {
    title: 'List 列表',
    description: 'Skyroc UI List 组件 - 列表组件，用于展示带标题、描述和图标的列表项。',
    keywords: ['list', '列表', 'item', '列表项']
  },
  'navigation-menu': {
    title: 'NavigationMenu 导航菜单',
    description: 'Skyroc UI NavigationMenu 组件 - 水平导航菜单组件。',
    keywords: ['navigation-menu', '导航菜单', 'nav', 'menu']
  },
  pagination: {
    title: 'Pagination 分页',
    description: 'Skyroc UI Pagination 组件 - 分页组件，支持多种样式变体、尺寸和形状。',
    keywords: ['pagination', '分页', 'pager', 'page']
  },
  password: {
    title: 'Password 密码输入框',
    description: 'Skyroc UI Password 组件 - 密码输入框组件，支持显示/隐藏密码和清除按钮。',
    keywords: ['password', '密码', '输入框', 'visibility']
  },
  popover: {
    title: 'Popover 气泡',
    description: 'Skyroc UI Popover 组件 - 气泡弹出框，用于展示更多内容。',
    keywords: ['popover', '气泡', 'popup', 'overlay']
  },
  progress: {
    title: 'Progress 进度条',
    description: 'Skyroc UI Progress 组件 - 进度条组件，展示操作进度。',
    keywords: ['progress', '进度条', 'loading', 'bar']
  },
  radio: {
    title: 'Radio 单选框',
    description: 'Skyroc UI Radio 组件 - 单选框组件，用于单项选择。',
    keywords: ['radio', '单选框', 'select', 'option']
  },
  resizable: {
    title: 'Resizable 可调整大小',
    description: 'Skyroc UI Resizable 组件 - 可调整大小的面板组件。',
    keywords: ['resizable', '可调整大小', 'resize', 'panel']
  },
  'scroll-area': {
    title: 'ScrollArea 滚动区域',
    description: 'Skyroc UI ScrollArea 组件 - 自定义滚动条的滚动区域。',
    keywords: ['scroll-area', '滚动区域', 'scrollbar', 'overflow']
  },
  select: {
    title: 'Select 选择器',
    description: 'Skyroc UI Select 组件 - 下拉选择器组件。',
    keywords: ['select', '选择器', 'dropdown', 'option']
  },
  sheet: {
    title: 'Sheet 侧边栏',
    description: 'Skyroc UI Sheet 组件 - 侧边栏面板组件。',
    keywords: ['sheet', '侧边栏', 'sidebar', 'panel']
  },
  skeleton: {
    title: 'Skeleton 骨架屏',
    description: 'Skyroc UI Skeleton 组件 - 骨架屏加载占位组件。',
    keywords: ['skeleton', '骨架屏', 'loading', 'placeholder']
  },
  slider: {
    title: 'Slider 滑块',
    description: 'Skyroc UI Slider 组件 - 滑块组件，用于选择数值范围。',
    keywords: ['slider', '滑块', 'range', 'input']
  },
  sonner: {
    title: 'Sonner 通知',
    description: 'Skyroc UI Sonner 组件 - Toast 通知组件。',
    keywords: ['sonner', '通知', 'toast', 'notification']
  },
  tabs: {
    title: 'Tabs 选项卡',
    description: 'Skyroc UI Tabs 组件 - 选项卡组件，用于内容切换。',
    keywords: ['tabs', '选项卡', 'tab', 'panel']
  },
  textarea: {
    title: 'Textarea 文本域',
    description: 'Skyroc UI Textarea 组件 - 多行文本输入组件。',
    keywords: ['textarea', '文本域', 'text', 'multiline']
  },
  toggle: {
    title: 'Toggle 切换',
    description: 'Skyroc UI Toggle 组件 - 切换按钮组件。',
    keywords: ['toggle', '切换', 'switch', 'button']
  },
  'toggle-group': {
    title: 'ToggleGroup 切换组',
    description: 'Skyroc UI ToggleGroup 组件 - 切换按钮组组件。',
    keywords: ['toggle-group', '切换组', 'button-group', 'segment']
  },
  tooltip: {
    title: 'Tooltip 提示',
    description: 'Skyroc UI Tooltip 组件 - 文字提示组件，鼠标悬停时显示。',
    keywords: ['tooltip', '提示', 'hint', 'tip']
  },
  tree: {
    title: 'Tree 树形控件',
    description: 'Skyroc UI Tree 组件 - 层级树形结构组件，支持展开折叠、选择、虚拟滚动等功能。',
    keywords: ['tree', '树形控件', '树视图', '层级结构', 'treeview']
  },
  virtualizer: {
    title: 'Virtualizer 虚拟列表',
    description: 'Skyroc UI Virtualizer 组件 - 高性能虚拟列表和网格组件，支持大数据量渲染。',
    keywords: ['virtualizer', '虚拟列表', 'virtual-list', 'virtual-scroll', '大数据']
  }
};

// Get component info based on locale
function getComponentsInfo(locale: Locale): Record<string, ComponentInfo> {
  return locale === 'zh' ? componentsInfoZh : componentsInfoEn;
}

// Generate component page metadata - accepts locale as parameter
export async function generateComponentMetadata(componentName: string): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;

  const componentsInfo = getComponentsInfo(locale);

  const info = componentsInfo[componentName];

  if (!info) {
    return {
      title: componentName.charAt(0).toUpperCase() + componentName.slice(1),
      description: `Skyroc UI ${componentName} component demo`
    };
  }

  return {
    title: info.title,
    description: info.description,
    keywords: [...info.keywords, 'Skyroc UI', 'React', 'Component'],
    openGraph: {
      title: `${info.title} | Skyroc UI`,
      description: info.description,
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title: `${info.title} | Skyroc UI`,
      description: info.description
    }
  };
}

// Export for backward compatibility
export const componentsInfo = componentsInfoEn;
