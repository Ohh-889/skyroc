import Feather from '@expo/vector-icons/Feather';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { Pressable, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { Sidebar } from '../sidebar';
import type { SidebarItem } from '../sidebar';
import { Text } from '../text/Typography';
import { treeSelectVariants } from './tree-select-variants';
import type { TreeSelectActiveId, TreeSelectChild, TreeSelectChildId, TreeSelectItem, TreeSelectProps } from './types';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让勾选色跟随主题 token */
const SelectedIcon = withUniwind(Feather);

/** 多选模式的空值，提到组件外，避免每次渲染都新建数组 */
const EMPTY_IDS: TreeSelectChildId[] = [];

/** 把分组数据转成 Sidebar 所需的格式，分组没显式给 id 时退化成下标 */
function toSidebarItems(items: TreeSelectItem[]): SidebarItem[] {
  return items.map((item, index) => ({
    badge: item.badge,
    disabled: item.disabled,
    dot: item.dot,
    key: String(item.id ?? index),
    title: item.text
  }));
}

/** 右侧子项属性 */
interface TreeSelectItemViewProps {
  /** 各插槽自定义 className */
  classNames: TreeSelectProps['classNames'];

  /** 子项数据 */
  item: TreeSelectChild;

  /** 是否多选，决定无障碍语义是 checkbox 还是 menuitem */
  multiple: boolean;

  /** 点击回调 */
  onPress: () => void;

  /** 是否选中 */
  selected: boolean;
}

const TreeSelectItemView = (props: TreeSelectItemViewProps) => {
  const { classNames, item, multiple, onPress, selected } = props;

  const disabled = Boolean(item.disabled);

  const variantSlots = treeSelectVariants({ active: selected, disabled });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      contentItem: cn(variantSlots.contentItem(), classNames?.contentItem),
      contentItemText: cn(variantSlots.contentItemText(), classNames?.contentItemText),
      selectedIcon: cn(variantSlots.selectedIcon(), classNames?.selectedIcon)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  return (
    <Pressable
      accessibilityLabel={item.text}
      accessibilityRole={multiple ? 'checkbox' : 'menuitem'}
      accessibilityState={multiple ? { checked: selected, disabled } : { disabled, selected }}
      className={slotClassNames.contentItem}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className={slotClassNames.contentItemText}>{item.text}</Text>

      {selected && (
        <SelectedIcon
          colorClassName={slotClassNames.selectedIcon}
          name="check"
          size={16}
        />
      )}
    </Pressable>
  );
};

const TreeSelect = (props: TreeSelectProps) => {
  const {
    activeId: activeIdProp,
    className,
    classNames,
    defaultActiveId,
    defaultMainActiveIndex = 0,
    height = 300,
    items = [],
    mainActiveIndex: mainActiveIndexProp,
    max = Infinity,
    multiple = false,
    onActiveIdChange,
    onClickItem,
    onClickNav,
    onMainActiveIndexChange,
    renderContent,
    sidebarClassNames,
    style,
    ...restProps
  } = props;

  const [mainActiveIndex, setMainActiveIndex] = useControllableState({
    caller: 'TreeSelect',
    defaultProp: defaultMainActiveIndex,
    onChange: onMainActiveIndexChange,
    prop: mainActiveIndexProp
  });

  const [activeId, setActiveId] = useControllableState<TreeSelectActiveId>({
    caller: 'TreeSelect',
    defaultProp: defaultActiveId ?? (multiple ? EMPTY_IDS : null),
    onChange: onActiveIdChange,
    prop: activeIdProp
  });

  const variantSlots = treeSelectVariants();

  // items 变短或受控索引越界时收敛到合法范围，否则右侧一片空白、左侧也没有任何激活项
  const activeGroupIndex = items.length > 0 ? Math.min(Math.max(mainActiveIndex, 0), items.length - 1) : -1;
  const activeGroup = items[activeGroupIndex];
  const children = activeGroup?.children ?? [];
  const sidebarItems = toSidebarItems(items);

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content),
      root: cn(variantSlots.root(), classNames?.root, className),
      sidebar: cn(variantSlots.sidebar(), classNames?.sidebar)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function isSelected(id: TreeSelectChildId) {
    if (multiple) return Array.isArray(activeId) && activeId.includes(id);

    return activeId === id;
  }

  function handleNavChange(index: number) {
    setMainActiveIndex(index);
    onClickNav?.(index);
  }

  function handleItemPress(item: TreeSelectChild) {
    if (multiple) {
      const current = Array.isArray(activeId) ? activeId : EMPTY_IDS;
      const exists = current.includes(item.id);

      // 达到上限时新增无效：选中态与回调都不发出，调用方不会收到「点了却没变」的假信号
      if (!exists && current.length >= max) return;

      setActiveId(exists ? current.filter(id => id !== item.id) : [...current, item.id]);
    } else {
      if (activeId === item.id) return;

      setActiveId(item.id);
    }

    onClickItem?.(item);
  }

  function renderChildren() {
    if (renderContent && activeGroup) return renderContent(activeGroup, activeGroupIndex);

    return children.map(item => (
      <TreeSelectItemView
        key={item.id}
        classNames={classNames}
        item={item}
        multiple={multiple}
        selected={isSelected(item.id)}
        onPress={() => handleItemPress(item)}
      />
    ));
  }

  return (
    <View
      className={slotClassNames.root}
      style={[{ height }, style]}
      {...restProps}
    >
      <Sidebar
        activeIndex={activeGroupIndex}
        className={slotClassNames.sidebar}
        classNames={sidebarClassNames}
        items={sidebarItems}
        onIndexChange={handleNavChange}
      />

      <ScrollView
        className={slotClassNames.content}
        showsVerticalScrollIndicator={false}
      >
        {renderChildren()}
      </ScrollView>
    </View>
  );
};

export { TreeSelect };
