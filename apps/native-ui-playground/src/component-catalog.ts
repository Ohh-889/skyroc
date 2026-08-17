import type { Href } from 'expo-router';

interface ComponentCatalogItem {
  /** 组件用途的简短说明 */
  description: string;
  /** 组件示例页路由 */
  href: Href;
  /** 组件导出名称 */
  name: string;
}

interface ComponentCatalogGroup {
  /** 当前分类下的组件入口 */
  components: readonly ComponentCatalogItem[];
  /** 分类标题 */
  title: string;
}

const COMPONENT_CATALOG = [
  {
    title: '基础组件',
    components: [
      { description: '按钮与操作触发', href: '/components/button', name: 'Button' },
      { description: '列表信息单元', href: '/components/cell', name: 'Cell' },
      { description: '内容分隔', href: '/components/divider', name: 'Divider' },
      { description: '宫格布局', href: '/components/grid', name: 'Grid' },
      { description: '图片展示', href: '/components/image', name: 'Image' },
      { description: '元素间距', href: '/components/space', name: 'Space' },
      { description: '主题文字', href: '/components/text', name: 'Text' }
    ]
  },
  {
    title: '表单组件',
    components: [
      { description: '多选与多选组', href: '/components/checkbox', name: 'Checkbox' },
      { description: '表单字段布局', href: '/components/field', name: 'Field' },
      { description: '表单状态与校验', href: '/components/form', name: 'Form' },
      { description: '文本输入', href: '/components/input', name: 'Input' },
      { description: '密码输入', href: '/components/password-input', name: 'PasswordInput' },
      { description: '单选与单选组', href: '/components/radio', name: 'Radio' },
      { description: '评分输入', href: '/components/rate', name: 'Rate' },
      { description: '搜索输入', href: '/components/search', name: 'Search' },
      { description: '手写签名', href: '/components/signature', name: 'Signature' },
      { description: '滑动选择数值', href: '/components/slider', name: 'Slider' },
      { description: '步进器输入', href: '/components/stepper', name: 'Stepper' },
      { description: '状态开关', href: '/components/switch', name: 'Switch' }
    ]
  },
  {
    title: '选择组件',
    components: [
      { description: '日历与日期范围', href: '/components/calendar', name: 'Calendar' },
      { description: '日期选择器', href: '/components/date-picker', name: 'DatePicker' },
      { description: '数字键盘', href: '/components/number-keyboard', name: 'NumberKeyboard' },
      { description: '滚轮选择器', href: '/components/picker', name: 'Picker' },
      { description: '多列联动选择', href: '/components/picker-group', name: 'PickerGroup' },
      { description: '时间选择器', href: '/components/time-picker', name: 'TimePicker' },
      { description: '树形分类选择', href: '/components/tree-select', name: 'TreeSelect' }
    ]
  },
  {
    title: '反馈组件',
    components: [
      { description: '底部操作菜单', href: '/components/action-sheet', name: 'ActionSheet' },
      { description: '确认与提示弹窗', href: '/components/dialog', name: 'Dialog' },
      { description: '页面顶部通知', href: '/components/notify', name: 'Notify' },
      { description: '通用弹出层', href: '/components/popup', name: 'Popup' },
      { description: '分享操作面板', href: '/components/share-sheet', name: 'ShareSheet' },
      { description: '底部内容面板', href: '/components/sheet', name: 'Sheet' },
      { description: '滑动单元格操作', href: '/components/swipe-cell', name: 'SwipeCell' },
      { description: '轻量消息提示', href: '/components/toast', name: 'Toast' }
    ]
  },
  {
    title: '展示组件',
    components: [
      { description: '头像与头像组', href: '/components/avatar', name: 'Avatar' },
      { description: '徽标与角标', href: '/components/badge', name: 'Badge' },
      { description: '折叠内容面板', href: '/components/collapse', name: 'Collapse' },
      { description: '倒计时展示', href: '/components/count-down', name: 'CountDown' },
      { description: '数字滚动动画', href: '/components/rolling-text', name: 'RollingText' },
      { description: '状态标签', href: '/components/tag', name: 'Tag' },
      { description: '多行文本省略', href: '/components/text-ellipsis', name: 'TextEllipsis' }
    ]
  },
  {
    title: '导航组件',
    components: [
      { description: '页面锚点导航', href: '/components/anchor-nav', name: 'AnchorNav' },
      { description: '返回页面顶部', href: '/components/back-top', name: 'BackTop' },
      { description: '下拉菜单筛选', href: '/components/dropdown-menu', name: 'DropdownMenu' },
      { description: '悬浮操作按钮', href: '/components/floating-button', name: 'FloatingButton' },
      { description: '索引分类导航', href: '/components/index-bar', name: 'IndexBar' },
      { description: '页面顶部导航栏', href: '/components/navbar', name: 'NavBar' },
      { description: '分页导航', href: '/components/pagination', name: 'Pagination' },
      { description: '侧边分类导航', href: '/components/sidebar', name: 'Sidebar' },
      { description: '标签页切换', href: '/components/tabs', name: 'Tabs' }
    ]
  }
] as const satisfies readonly ComponentCatalogGroup[];

const COMPONENT_COUNT = COMPONENT_CATALOG.reduce((count, group) => count + group.components.length, 0);

export { COMPONENT_CATALOG, COMPONENT_COUNT };
export type { ComponentCatalogGroup, ComponentCatalogItem };
