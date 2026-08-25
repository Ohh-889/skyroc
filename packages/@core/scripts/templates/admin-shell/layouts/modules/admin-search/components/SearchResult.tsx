import { SvgIcon } from '@shell/ui/compose';
import { clsx } from 'clsx';
import { memo } from 'react';

interface Props {
  /** 当前结果是否处于键盘或鼠标选中状态 */
  active: boolean;
  /** 确认进入当前选中菜单 */
  enter: () => void;
  /** 当前搜索命中的菜单 */
  menu: Menu.CommonMenu;
  /** 设置当前激活的菜单路径 */
  setActiveRouteName: (name: string) => void;
}

const SearchResult = memo((props: Props) => {
  const { active, enter, menu, setActiveRouteName } = props;

  function handleMouseEnter() {
    setActiveRouteName(menu.key);
  }

  return (
    <div
      className={clsx(
        'mt-8px h-56px flex-y-center cursor-pointer justify-between rounded-4px bg-#e5e7eb px-14px dark:bg-dark',
        { 'bg-primary': active },
        { 'text-#fff': active }
      )}
      onClick={enter}
      onMouseEnter={handleMouseEnter}
    >
      <span className="ml-5px flex-1">
        {menu.icon}
        {menu.label}
      </span>

      <SvgIcon icon="ant-design:enter-outlined" />
    </div>
  );
});

export default SearchResult;
