'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import PaginationContent from './PaginationContent';
import PaginationEllipsis from './PaginationEllipsis';
import PaginationFirst from './PaginationFirst';
import PaginationItem from './PaginationItem';
import PaginationLast from './PaginationLast';
import PaginationNext from './PaginationNext';
import PaginationPrevious from './PaginationPrevious';
import PaginationRoot from './PaginationRoot';
import { getPageCount, getRange, transform } from './shared';
import type { PaginationProps } from './types';

const PaginationUI = forwardRef<ComponentRef<'nav'>, PaginationProps>((props, ref) => {
  const {
    actionAsSelected = false,
    className,
    classNames,
    contentProps,
    defaultPage = 1,
    disabled = false,
    ellipsisIcon,
    ellipsisProps,
    firstIcon,
    firstLabel,
    firstProps,
    itemProps,
    itemsPerPage = 10,
    lastIcon,
    lastLabel,
    lastProps,
    nextIcon,
    nextLabel,
    nextProps,
    onPageChange,
    page: pageProp,
    previousIcon,
    previousLabel,
    previousProps,
    shape,
    showEdges = false,
    showFirstLast = true,
    siblingCount = 1,
    size,
    total,
    variant,
    ...rest
  } = props;

  const [currentPage, setCurrentPage] = useControllableState({
    caller: 'pagination',
    defaultProp: defaultPage,
    onChange: onPageChange,
    prop: pageProp
  });

  const pageCount = getPageCount(total, itemsPerPage);

  // ---------------------------
  // Calculated pages
  // ---------------------------
  const pages = transform(getRange(currentPage, pageCount, siblingCount, showEdges));

  // ---------------------------
  // Common reusable boolean flags
  // ---------------------------
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;

  // ---------------------------
  // Events
  // ---------------------------
  const handlePageChange = (page: number) => {
    if (disabled)
      return;
    if (page < 1 || page > pageCount)
      return;
    setCurrentPage(page);
  };

  const handleFirst = () => handlePageChange(1);
  const handlePrevious = () => handlePageChange(currentPage - 1);
  const handleNext = () => handlePageChange(currentPage + 1);
  const handleLast = () => handlePageChange(pageCount);

  return (
    <PaginationRoot
      className={className}
      ref={ref}
      size={size}
      {...rest}
    >
      <PaginationContent
        className={classNames?.list}
        size={size}
        {...contentProps}
      >
        {showFirstLast
          ? (
            <PaginationFirst
              actionAsSelected={actionAsSelected}
              className={classNames?.navigationButton}
              disabled={disabled || isFirstPage}
              icon={firstIcon}
              label={firstLabel}
              shape={shape}
              size={size}
              variant={variant}
              onClick={handleFirst}
              {...firstProps}
            />
          )
          : null}

        <PaginationPrevious
          actionAsSelected={actionAsSelected}
          className={classNames?.navigationButton}
          disabled={disabled || isFirstPage}
          icon={previousIcon}
          label={previousLabel}
          shape={shape}
          size={size}
          variant={variant}
          onClick={handlePrevious}
          {...previousProps}
        />

        {pages.map((item, index) => {
          if (item.type === 'ellipsis') {
            return (
              <PaginationEllipsis
                className={classNames?.ellipsis}
                icon={ellipsisIcon}
                key={`ellipsis-${index}`}
                size={size}
                {...ellipsisProps}
              />
            );
          }

          return (
            <PaginationItem
              className={classNames?.button}
              disabled={disabled}
              isActive={currentPage === item.value}
              key={item.value}
              shape={shape}
              size={size}
              value={item.value}
              variant={variant}
              onClick={() => handlePageChange(item.value)}
              {...itemProps}
            />
          );
        })}

        <PaginationNext
          actionAsSelected={actionAsSelected}
          className={classNames?.navigationButton}
          disabled={disabled || isLastPage}
          icon={nextIcon}
          label={nextLabel}
          shape={shape}
          size={size}
          variant={variant}
          onClick={handleNext}
          {...nextProps}
        />

        {showFirstLast
          ? (
            <PaginationLast
              actionAsSelected={actionAsSelected}
              className={classNames?.navigationButton}
              disabled={disabled || isLastPage}
              icon={lastIcon}
              label={lastLabel}
              shape={shape}
              size={size}
              variant={variant}
              onClick={handleLast}
              {...lastProps}
            />
          )
          : null}
      </PaginationContent>
    </PaginationRoot>
  );
});

PaginationUI.displayName = 'PaginationUI';

export default PaginationUI;
