import Ionicons from '@expo/vector-icons/Ionicons';
import { cn, isString } from '@skyroc/utils';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { Input } from '../input';
import { Text } from '../text/Typography';
import { SEARCH_ICON_SIZE_MAP, searchVariants } from './search-variants';
import type { SearchProps } from './types';

/**
 * Ionicons 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让搜索图标色跟随主题 token。
 *
 * 图标库跟 Input 的清除 / 密码按钮保持一致（同为 Ionicons），同一个搜索栏里不会出现两套图标风格。
 */
const SearchIcon = withUniwind(Ionicons);

/** 文本节点（string / number）交给 Text 渲染，其余节点（图标、自定义 Text 等）原样透出 */
function isTextNode(node: unknown) {
  return isString(node) || typeof node === 'number';
}

/**
 * 搜索栏。
 *
 * 输入框本体完全委托给 `Input`（固定 `variant="filled"`），本组件只负责外层布局、 左侧标签与右侧操作按钮，值也由 Input 托管——受控传 `value` + `onChangeText`， 非受控传
 * `defaultValue`。
 *
 * @example
 *   ```tsx
 *   <Search placeholder="搜索商品" onSearch={handleSearch} />
 *
 *   <Search showAction shape="round" label="城市" onCancel={handleCancel} />
 *   ```
 */
const Search = (props: SearchProps) => {
  const {
    action = '取消',
    className,
    classNames,
    clearable = true,
    inputClassNames,
    label,
    leading,
    onCancel,
    onSearch,
    onSubmitEditing,
    returnKeyType = 'search',
    shape,
    showAction = false,
    size = 'md',
    ...rest
  } = props;

  const variantSlots = searchVariants({ shape, size });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      action: cn(variantSlots.action(), classNames?.action),
      actionText: cn(variantSlots.actionText(), classNames?.actionText),
      icon: variantSlots.icon(),
      input: cn(variantSlots.input(), classNames?.input, inputClassNames?.root),
      label: cn(variantSlots.label(), classNames?.label),
      root: cn(variantSlots.root(), className, classNames?.root)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function handleSubmitEditing(e: Parameters<NonNullable<SearchProps['onSubmitEditing']>>[0]) {
    // 值由 Input 内部托管，非受控用法下这一层拿不到当前文本，因此取事件里的真实内容
    onSearch?.(e.nativeEvent.text);
    onSubmitEditing?.(e);
  }

  function renderLeading() {
    if (leading) return leading;

    return (
      <SearchIcon
        colorClassName={slotClassNames.icon}
        name="search"
        size={SEARCH_ICON_SIZE_MAP[size]}
      />
    );
  }

  return (
    <View className={slotClassNames.root}>
      {isTextNode(label) ? <Text className={slotClassNames.label}>{label}</Text> : label}

      {/* rest 展开在最前，避免调用方的透传属性覆盖下面这些由组件托管的属性 */}
      <Input
        {...rest}
        classNames={{ ...inputClassNames, root: slotClassNames.input }}
        clearable={clearable}
        leading={renderLeading()}
        returnKeyType={returnKeyType}
        size={size}
        variant="filled"
        onSubmitEditing={handleSubmitEditing}
      />

      {showAction ? (
        <Pressable
          className={slotClassNames.action}
          role="button"
          onPress={onCancel}
        >
          {isTextNode(action) ? <Text className={slotClassNames.actionText}>{action}</Text> : action}
        </Pressable>
      ) : null}
    </View>
  );
};

export { Search };
