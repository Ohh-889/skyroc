/**
 * 跨页面类型链接注册表
 *
 * 当某个类型的定义不在当前页面时，需要在这里注册它的完整路径。
 * key: 类型名（PascalCase）
 * value: 目标页面路径 + 锚点
 *
 * 如果类型在当前页面有定义（TypeTable / UnionType），无需注册，
 * 会自动生成 #type-xxx 的当前页锚点。
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
  // 通用工具类型，定义写在 Button 页的类型区
  SlotClassNames: '/docs/components/button#type-slot-class-names'
};
