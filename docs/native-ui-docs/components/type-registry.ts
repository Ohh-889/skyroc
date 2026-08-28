/**
 * 跨页面类型链接注册表
 *
 * 当某个类型的定义不在当前页面时，在这里注册它的完整路径。 key: 类型名（PascalCase） value: 目标页面路径 + 锚点
 *
 * 解析优先级（见 type-anchor.tsx / type-link.tsx）： 1. 当前页有定义（TypeTable / UnionType）→ 走 #type-xxx 页内锚点，平滑滚动 2. 当前页没有定义 →
 * 用这里注册的跨页地址 3. 注册的目标页面还不存在 → 不渲染成链接，避免 404
 *
 * 所以通用工具类型（如 SlotClassNames）在各页自己写一份定义即可，不必注册。
 */
export const TYPE_REGISTRY: Record<string, string> = {
  ActionSheetProps: '/docs/components/action-sheet#actionsheet',
  AnchorNavProps: '/docs/components/anchor-nav#anchornav',
  AvatarProps: '/docs/components/avatar#avatar',
  ButtonProps: '/docs/components/button#button',
  CellGroupProps: '/docs/components/cell#cellgroup',
  CellGroupSlots: '/docs/components/cell#type-cell-group-slots',
  CellProps: '/docs/components/cell#cell',
  CellSlots: '/docs/components/cell#type-cell-slots',
  DropdownMenuProps: '/docs/components/dropdown-menu#dropdownmenu',
  FieldGroupProps: '/docs/components/field#fieldgroup',
  FieldItemProps: '/docs/components/field#fielditem',
  FormComputedFieldProps: '/docs/components/form#formcomputedfield',
  FormInstance: '/docs/components/form#type-form-instance',
  FormItemProps: '/docs/components/form#formitem',
  FormProps: '/docs/components/form#form',
  FormSchema: '/docs/components/form#type-form-schema',
  GridItemData: '/docs/components/grid#type-grid-item-data',
  GridProps: '/docs/components/grid#grid',
  ImageProps: '/docs/components/image#image',
  ImageSource: '/docs/components/image#type-image-source',
  IndexBarProps: '/docs/components/index-bar#indexbar',
  InputProps: '/docs/components/input#input',
  Meta: '/docs/components/form#type-meta',
  NavBarProps: '/docs/components/navbar#navbar',
  NotifyOptions: '/docs/components/notify#notifyoptions',
  PaginationProps: '/docs/components/pagination#pagination',
  PasswordInputProps: '/docs/components/password-input#passwordinput',
  PickerFieldNames: '/docs/components/picker#type-picker-field-names',
  PickerOption: '/docs/components/picker#type-picker-option',
  PickerProps: '/docs/components/picker#picker',
  PickerSlots: '/docs/components/picker#type-picker-slots',
  PickerViewProps: '/docs/components/picker#pickerview',
  PopupPosition: '/docs/components/popup#type-popup-position',
  PopupProps: '/docs/components/popup#popup',
  Rule: '/docs/components/form#type-rule',
  RuleType: '/docs/components/form#type-rule-type',
  SheetProps: '/docs/components/sheet#sheet',
  SheetSlots: '/docs/components/sheet#type-sheet-slots',
  SidebarItem: '/docs/components/sidebar#type-sidebar-item',
  SidebarProps: '/docs/components/sidebar#sidebar',
  SidebarSlots: '/docs/components/sidebar#type-sidebar-slots',
  ToastOptions: '/docs/components/toast#toastoptions',
  ValidateErrorEntity: '/docs/components/form#type-validate-error-entity',
  ValidateMessages: '/docs/components/form#type-validate-messages'
};
