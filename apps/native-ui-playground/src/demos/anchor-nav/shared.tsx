import type { AnchorNavSection } from '@skyroc/native-ui';

/**
 * 组件库分组数据，几个 AnchorNav 单点 demo 共用。
 *
 * 之所以抽出来而不是各自复制一份：这份数据有八个分组三十多个条目，重复五遍会让每个 demo 的源码全是数据、看不见 API 用法。
 */
const LIBRARY_DATA: AnchorNavSection[] = [
  {
    badge: 6,
    children: [
      { key: 'button', text: 'Button 按钮' },
      { key: 'text', text: 'Text 文字' },
      { key: 'avatar', text: 'Avatar 头像' },
      { key: 'badge', text: 'Badge 徽标' }
    ],
    key: 'basic',
    title: '基础组件'
  },
  {
    children: [
      { key: 'input', text: 'Input 输入框' },
      { key: 'field', text: 'Field 字段' },
      { key: 'checkbox', text: 'Checkbox 复选框' },
      { key: 'radio', text: 'Radio 单选框' }
    ],
    dot: true,
    key: 'form',
    title: '表单输入'
  },
  {
    children: [
      { key: 'toast', text: 'Toast 轻提示' },
      { key: 'notify', text: 'Notify 通知' },
      { key: 'dialog', text: 'Dialog 对话框' },
      { key: 'action-sheet', text: 'ActionSheet 操作面板' }
    ],
    key: 'feedback',
    title: '反馈展示'
  },
  {
    children: [
      { key: 'tabs', text: 'Tabs 标签页' },
      { key: 'sidebar', text: 'Sidebar 侧边导航' },
      { key: 'anchor-nav', text: 'AnchorNav 锚点导航' },
      { key: 'pagination', text: 'Pagination 分页' }
    ],
    key: 'navigation',
    title: '导航布局'
  },
  {
    children: [
      { key: 'cell', text: 'Cell 单元格' },
      { key: 'collapse', text: 'Collapse 折叠面板' },
      { key: 'grid', text: 'Grid 宫格' },
      { key: 'tree-select', text: 'TreeSelect 分类选择' }
    ],
    key: 'display',
    title: '数据展示'
  },
  {
    children: [
      { key: 'popup', text: 'Popup 弹出层' },
      { key: 'sheet', text: 'Sheet 底部面板' },
      { key: 'picker', text: 'Picker 选择器' },
      { key: 'calendar', text: 'Calendar 日历' }
    ],
    key: 'overlay',
    title: '弹层选择'
  },
  {
    children: [
      { key: 'signature', text: 'Signature 签名' },
      { key: 'rolling-text', text: 'RollingText 滚动文字' },
      { key: 'back-top', text: 'BackTop 返回顶部' }
    ],
    disabled: true,
    key: 'experimental',
    title: '实验组件'
  },
  {
    children: [
      { key: 'divider', text: 'Divider 分隔线' },
      { key: 'space', text: 'Space 间距' },
      { key: 'image', text: 'Image 图片' },
      { key: 'tag', text: 'Tag 标签' }
    ],
    key: 'utility',
    title: '通用工具'
  }
];

export { LIBRARY_DATA };
