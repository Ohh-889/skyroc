/**
 * 跨页面类型链接注册表
 *
 * 当某个类型的定义不在当前页面时，在这里注册它的完整路径。
 * key: 类型名（PascalCase）
 * value: 目标页面路径 + 锚点
 *
 * 解析优先级（见 type-anchor.tsx / type-link.tsx）：
 * 1. 当前页有定义（TypeTable / UnionType）→ 走 #type-xxx 页内锚点，平滑滚动
 * 2. 当前页没有定义 → 用这里注册的跨页地址
 * 3. 注册的目标页面还不存在 → 不渲染成链接，避免 404
 *
 * 所以通用工具类型（如 SlotClassNames）在各页自己写一份定义即可，不必注册。
 */
export const TYPE_REGISTRY: Record<string, string> = {
  ActionSheetProps: '/docs/components/action-sheet#actionsheet',
  AnchorNavProps: '/docs/components/anchor-nav#anchornav',
  AvatarProps: '/docs/components/avatar#avatar',
  ButtonProps: '/docs/components/button#button',
  CellGroupProps: '/docs/components/cell#cellgroup',
  CellProps: '/docs/components/cell#cell',
  CellSlots: '/docs/components/cell#type-cell-slots',
  ImageProps: '/docs/components/image#image',
  ImageSource: '/docs/components/image#type-image-source',
  InputProps: '/docs/components/input#input'
};
