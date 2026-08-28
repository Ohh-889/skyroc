import { SvgIcon } from '@shell/ui/compose';
import { ConfigProvider, Tree } from 'antd';
import type { ConfigProviderProps, TreeDataNode, TreeNodeProps, TreeProps } from 'antd';
import { clsx } from 'clsx';

type TreeClassNames = Exclude<NonNullable<TreeProps['classNames']>, (...args: never[]) => unknown>;

const APP_TREE_THEME: ConfigProviderProps['theme'] = {
  components: {
    Tree: {
      directoryNodeSelectedBg: 'transparent',
      indentSize: 16,
      nodeHoverBg: 'transparent',
      nodeSelectedBg: 'transparent'
    }
  }
};

const DEFAULT_CLASS_NAMES: TreeClassNames = {
  item: 'h-38px items-center rounded-md hover:bg-layout [&:has(.ant-tree-node-selected)]:bg-primary-bg!',
  itemSwitcher: 'mt-4px mr-0 block hover:before:bg-transparent!',
  itemTitle: '[.ant-tree-node-selected_&]:(text-primary font-bold)'
};

export interface AppTreeProps<T extends TreeDataNode = TreeDataNode> extends Omit<TreeProps<T>, 'classNames'> {
  /** 在默认视觉样式之上追加的 Tree 语义类名。 */
  classNames?: TreeClassNames;
}

function renderDefaultSwitcherIcon(nodeProps: TreeNodeProps) {
  return (
    <SvgIcon
      className="mt-6px size-16px"
      icon="ph:caret-down"
      style={{
        transform: `rotate(${nodeProps.expanded ? 0 : -90}deg)`,
        transition: 'transform 0.3s'
      }}
    />
  );
}

const AppTree = <T extends TreeDataNode = TreeDataNode>(props: AppTreeProps<T>) => {
  const { classNames, switcherIcon = renderDefaultSwitcherIcon, ...treeProps } = props;

  function resolveClassNames(): TreeClassNames {
    return {
      ...classNames,
      item: clsx(DEFAULT_CLASS_NAMES.item, classNames?.item),
      itemSwitcher: clsx(DEFAULT_CLASS_NAMES.itemSwitcher, classNames?.itemSwitcher),
      itemTitle: clsx(DEFAULT_CLASS_NAMES.itemTitle, classNames?.itemTitle)
    };
  }

  return (
    <ConfigProvider theme={APP_TREE_THEME}>
      <Tree<T>
        classNames={resolveClassNames()}
        switcherIcon={switcherIcon}
        {...treeProps}
      />
    </ConfigProvider>
  );
};

export default AppTree;
