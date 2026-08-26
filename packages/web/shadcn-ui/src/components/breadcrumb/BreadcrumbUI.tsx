'use client';

import type { Ref } from 'react';
import { Fragment, forwardRef } from 'react';
import { DropdownMenu, type DropdownMenuProps } from '../dropdown-menu';
import BreadcrumbEllipsis from './BreadcrumbEllipsis';
import BreadcrumbItemContent from './BreadcrumbItem';
import BreadcrumbLink from './BreadcrumbLink';
import BreadcrumbList from './BreadcrumbList';
import BreadcrumbPage from './BreadcrumbPage';
import BreadcrumbRoot from './BreadcrumbRoot';
import BreadcrumbSeparator from './BreadcrumbSeparator';
import type { BreadcrumbItem, BreadcrumbProps } from './types';

type EllipsisProps<T extends BreadcrumbItem> = Pick<
  BreadcrumbProps<T>,
  'className' | 'ellipsisIcon' | 'handleItemClick' | 'items' | 'renderEllipsis'
> & {
  ellipsisDropdownProps?: Omit<DropdownMenuProps, 'children' | 'items'>;
  ellipsisProps?: BreadcrumbProps<T>['ellipsisProps'];
};

const Ellipsis = <T extends BreadcrumbItem>(props: EllipsisProps<T>) => {
  const { className, ellipsisDropdownProps, ellipsisIcon, ellipsisProps, handleItemClick, items, renderEllipsis } = props;

  if (renderEllipsis) {
    return renderEllipsis(items);
  }

  const dropdownItems: DropdownMenuProps['items'] = items.map(item => ({
    label: item.label,
    leading: item.leading,
    trailing: item.trailing,
    onSelect: () => handleItemClick?.(item)
  }));

  return (
    <DropdownMenu
      items={dropdownItems}
      modal={false}
      {...ellipsisDropdownProps}
    >
      <BreadcrumbEllipsis
        className={className}
        {...ellipsisProps}
      >
        {ellipsisIcon}
      </BreadcrumbEllipsis>
    </DropdownMenu>
  );
};

// eslint-disable-next-line max-params
function renderBreadcrumbContent<T extends BreadcrumbItem>(item: T, renderItem: BreadcrumbProps<T>['renderItem'], linkProps?: BreadcrumbProps<T>['linkProps'], pageProps?: BreadcrumbProps<T>['pageProps']) {
  if (renderItem)
    return renderItem(item);

  if (item.href) {
    return (
      <BreadcrumbLink
        {...item}
        {...linkProps}
      >
        {item.label}
      </BreadcrumbLink>
    );
  }

  return (
    <BreadcrumbPage
      {...item}
      {...pageProps}
    >
      {item.label}
    </BreadcrumbPage>
  );
}

const Breadcrumb = <T extends BreadcrumbItem>(props: BreadcrumbProps<T>, ref: Ref<HTMLElement>) => {
  const {
    className,
    classNames,
    ellipsis,
    ellipsisDropdownProps,
    ellipsisIcon,
    ellipsisProps,
    handleItemClick,
    itemProps,
    items,
    linkProps,
    listProps,
    pageProps,
    renderEllipsis,
    renderItem,
    separator,
    separatorProps,
    size,
    ...rest
  } = props;

  const computedEllipsisRange = getEllipsisRange();

  const itemsFilterEllipsis = getItemsFilterEllipsis();

  const startEllipsisIndex = computedEllipsisRange?.[0];

  const ellipsisItems = computedEllipsisRange ? items.slice(computedEllipsisRange[0], computedEllipsisRange[1]) : [];

  function getItemsFilterEllipsis() {
    if (!computedEllipsisRange)
      return items;

    const [start, end] = computedEllipsisRange;

    return [...items.slice(0, start), ...items.slice(end)];
  }

  function getEllipsisRange() {
    /** when the item count is greater than 4, we will show ellipsis */
    const MIN_ITEM_COUNT_WITH_ELLIPSIS = 5;

    if (!ellipsis || items.length < MIN_ITEM_COUNT_WITH_ELLIPSIS)
      return null;

    if (ellipsis === true) {
      return [1, items.length - 2];
    }

    let [start, end] = ellipsis;

    if (start === 0) {
      start = 1;
    }

    if (end === items.length) {
      end = items.length - 1;
    }

    return [start, end];
  }

  return (
    <BreadcrumbRoot
      className={className || classNames?.root}
      size={size}
      {...rest}
      ref={ref}
    >
      <BreadcrumbList
        className={classNames?.list}
        size={size}
        {...listProps}
      >
        {itemsFilterEllipsis.map((item, index) => {
          const isEllipsis = startEllipsisIndex && startEllipsisIndex === index;

          const isShowSeparator = index < itemsFilterEllipsis.length - 1;

          return (
            <Fragment key={item.value}>
              {isEllipsis
                ? (
                  <>
                    <Ellipsis<T>
                      className={classNames?.ellipsis}
                      ellipsisDropdownProps={ellipsisDropdownProps}
                      ellipsisIcon={ellipsisIcon}
                      ellipsisProps={ellipsisProps}
                      handleItemClick={handleItemClick}
                      items={ellipsisItems}
                      renderEllipsis={renderEllipsis}
                    />

                    {separator || (
                      <BreadcrumbSeparator
                        className={classNames?.separator}
                        {...separatorProps}
                      />
                    )}
                  </>
                )
                : null}

              <BreadcrumbItemContent
                className={classNames?.item}
                size={size}
                onClick={() => handleItemClick?.(item)}
                {...itemProps}
              >
                {item.leading}
                {renderBreadcrumbContent(item, renderItem, linkProps, pageProps)}
                {item.trailing}
              </BreadcrumbItemContent>

              {isShowSeparator
                ? separator || (
                  <BreadcrumbSeparator
                    className={classNames?.separator}
                    {...separatorProps}
                  />
                )
                : null}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
};

Breadcrumb.displayName = 'BreadcrumbUI';

const BreadcrumbUI = forwardRef(Breadcrumb) as <T extends BreadcrumbItem>(
  props: BreadcrumbProps<T> & { ref?: Ref<HTMLElement> }
) => React.ReactElement;

export default BreadcrumbUI;
