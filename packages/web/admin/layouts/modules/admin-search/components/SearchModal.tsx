import { SvgIcon } from '@shell/ui/compose';
import { useDebounceFn, useKeyPress } from 'ahooks';
import {
  Button as AButton,
  Empty as AEmpty,
  Input as AInput,
  type InputRef,
  Modal as AModal,
  Space as ASpace
} from 'antd';
import { clsx } from 'clsx';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAdminMenus } from '../../../state/menus/use-admin-menus';
import { useAdminState } from '../../../state/use-admin-state';

import SearchFooter from './SearchFooter';
import SearchResult from './SearchResult';

interface Props {
  /** 关闭搜索弹窗 */
  onClose: () => void;
  /** 是否显示搜索弹窗 */
  show: boolean;
}

/**
 * Transform menu to searchMenus
 *
 * @param menus - Menus
 * @param treeMap
 */
function transformMenuToSearchMenus(menus: Menu.CommonMenu[], treeMap: Menu.CommonMenu[] = []) {
  if (menus && menus.length === 0) return [];
  return menus.reduce((acc, cur) => {
    acc.push(cur);

    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenus(cur.children, treeMap);
    }
    return acc;
  }, treeMap);
}

const SearchModal = (props: Props) => {
  const { onClose, show } = props;

  const [resultOptions, setResultOptions] = useState<Menu.CommonMenu[]>([]);

  const [activeRoute, setActiveRoute] = useState<string>('');

  const { isMobile } = useAdminState();

  const { t } = useTranslation();

  const keyword = useRef<InputRef>(null);

  const { menus, routerPushByKey } = useAdminMenus();

  const searchMenus = useMemo(() => transformMenuToSearchMenus(menus), [menus]);

  function getSearchText(menu: Menu.CommonMenu) {
    const i18nTitle = menu.i18nKey ? t(menu.i18nKey) : '';
    return `${menu.title ?? ''} ${i18nTitle}`.toLocaleLowerCase();
  }

  function handleClose() {
    // handle with setTimeout to prevent user from seeing some operations
    setTimeout(() => {
      onClose();
      setResultOptions([]);
    }, 200);
  }

  function search() {
    const trimKeyword = keyword.current?.input?.value?.toLocaleLowerCase().trim();
    const result = trimKeyword
      ? searchMenus.filter(menu => menu.type !== 'divider' && getSearchText(menu).includes(trimKeyword))
      : [];

    const activeName = result[0]?.key || '';

    setResultOptions(result);

    setActiveRoute(activeName as unknown as string);
  }

  const handleSearch = useDebounceFn(search, { wait: 300 });

  /** Key up */
  function handleUp() {
    handleKeyPress(-1); // 方向 -1 表示向上
  }

  /** Key down */
  function handleDown() {
    handleKeyPress(1); // 方向 1 表示向下
  }

  function getActivePathIndex() {
    return resultOptions.findIndex(item => item.key === activeRoute);
  }

  function handleKeyPress(direction: 1 | -1) {
    const { length } = resultOptions;
    if (length === 0) return;

    const index = getActivePathIndex();
    if (index === -1) return;

    const activeIndex = (index + direction + length) % length; // 确保 index 在范围内循环

    const activeKey = resultOptions[activeIndex].key;

    setActiveRoute(activeKey);
  }

  /** Key enter */
  function handleEnter() {
    if (resultOptions.length === 0 || activeRoute === '') return;
    handleClose();
    routerPushByKey(activeRoute);
  }

  useKeyPress('Escape', handleClose);
  useKeyPress('Enter', handleEnter);
  useKeyPress('uparrow', handleUp);
  useKeyPress('downarrow', handleDown);

  return (
    <AModal
      destroyOnHidden
      className={clsx({ 'top-0px rounded-0': isMobile })}
      closable={false}
      footer={isMobile ? null : <SearchFooter />}
      height={isMobile ? '100%' : 400}
      open={show}
      style={isMobile ? { margin: 0, maxWidth: '100%', padding: 0 } : undefined}
      styles={{ body: { height: isMobile ? '100vh' : '100%', paddingBottom: 0 } }}
      width={isMobile ? '100%' : 630}
      onCancel={handleClose}
    >
      <ASpace.Compact className="w-full">
        <AInput
          allowClear
          placeholder={t('common.keywordSearch')}
          prefix={
            <SvgIcon
              className="text-15px text-#c2c2c2"
              icon="uil:search"
            />
          }
          ref={keyword}
          onInput={handleSearch.run}
        />
        {isMobile && (
          <AButton
            ghost
            type="primary"
            onClick={handleClose}
          >
            {t('common.cancel')}
          </AButton>
        )}
      </ASpace.Compact>

      <div className="mt-20px">
        {resultOptions.length === 0 ? (
          <AEmpty />
        ) : (
          resultOptions.map(item => (
            <SearchResult
              active={item.key === activeRoute}
              enter={handleEnter}
              key={item.key}
              menu={item}
              setActiveRouteName={setActiveRoute}
            />
          ))
        )}
      </div>
    </AModal>
  );
};

export default SearchModal;
