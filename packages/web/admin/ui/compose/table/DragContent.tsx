import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Checkbox, Divider, Tooltip } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../components';

import type { TableColumnCheck, TableColumnFixed } from './types';

interface DragContentProps {
  /** 可配置显隐、排序和固定位置的表格列。 */
  columns: TableColumnCheck[];
  /** 更新列设置后的回调。 */
  setColumnChecks: (checks: TableColumnCheck[]) => void;
}

interface SortableItemProps {
  /** 当前列配置项。 */
  item: TableColumnCheck;
  /** 切换列固定位置时触发。 */
  onFixedChange: (item: TableColumnCheck) => void;
  /** 切换列显示状态时触发。 */
  onVisibleChange: (item: TableColumnCheck, checked: boolean) => void;
}

const FIXED_OPTIONS: TableColumnFixed[] = ['left', 'right', 'unFixed'];

const fixedTooltipRecord: Record<TableColumnFixed, string> = {
  left: 'datatable.fixed.right',
  right: 'datatable.fixed.unFixed',
  unFixed: 'datatable.fixed.left'
};

/** 单个可拖拽列项组件。 */
const SortableItem = (props: SortableItemProps) => {
  const { item, onFixedChange, onVisibleChange } = props;

  const { t } = useTranslation();
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.key
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.6 : 1,
    transform: CSS.Transform.toString(transform),
    transition
  };

  function handleCheckChange(event: { target: { checked: boolean } }) {
    onVisibleChange(item, event.target.checked);
  }

  function handleFixedClick() {
    onFixedChange(item);
  }

  return (
    <div
      className="h-36px flex items-center justify-between gap-6px rd-4px px-6px transition-colors hover:bg-primary hover:bg-opacity-10"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="min-w-0 flex flex-1 items-center">
        <span className="mr-8px h-full flex cursor-move items-center text-icon" {...listeners}>
          <SvgIcon icon="mdi:drag" />
        </span>
        <Checkbox checked={item.checked} className="min-w-0 flex-1" onChange={handleCheckChange}>
          <span className="block truncate">{renderColumnTitle(item.title, item.key)}</span>
        </Checkbox>
      </div>
      <Tooltip title={t(fixedTooltipRecord[item.fixed])}>
        <Button
          disabled={!item.checked}
          icon={renderFixedIcon(item.fixed)}
          size="small"
          tabIndex={-1}
          type="text"
          onClick={handleFixedClick}
        />
      </Tooltip>
    </div>
  );
};

/** 列设置拖拽内容组件。 */
const DragContent = (props: DragContentProps) => {
  const { columns, setColumnChecks } = props;

  const { t } = useTranslation();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const visibleColumns = columns.filter(item => item.visible);
  const visibleStats = getVisibleStats(columns);
  const selectAllChecked = visibleStats.total > 0 && visibleStats.checked === visibleStats.total;
  const selectAllIndeterminate = visibleStats.checked > 0 && visibleStats.checked < visibleStats.total;

  function handleSelectAll(event: { target: { checked: boolean } }) {
    const nextColumns = columns.map(item => {
      if (!item.visible) return item;

      return {
        ...item,
        checked: event.target.checked
      };
    });

    setColumnChecks(nextColumns);
  }

  function handleVisibleChange(target: TableColumnCheck, checked: boolean) {
    const nextColumns = columns.map(item => {
      if (item.key !== target.key) return item;

      return {
        ...item,
        checked
      };
    });

    setColumnChecks(nextColumns);
  }

  function handleFixedChange(target: TableColumnCheck) {
    const nextFixed = getNextFixed(target.fixed);
    const nextColumns = columns.map(item => {
      if (item.key !== target.key) return item;

      return {
        ...item,
        fixed: nextFixed
      };
    });

    setColumnChecks(nextColumns);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = columns.findIndex(item => item.key === active.id);
    const newIndex = columns.findIndex(item => item.key === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setColumnChecks(arrayMove(columns, oldIndex, newIndex));
  }

  return (
    <div className="w-220px">
      <div className="h-36px flex items-center rd-4px px-26px transition-colors hover:bg-primary hover:bg-opacity-10">
        <Checkbox
          checked={selectAllChecked}
          className="flex-1"
          disabled={visibleStats.total === 0}
          indeterminate={selectAllIndeterminate}
          onChange={handleSelectAll}
        >
          {t('common.selectAll')}
        </Checkbox>
      </div>
      <Divider className="!my-4px" />
      <div className="max-h-240px overflow-y-auto">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleColumns.map(item => item.key)} strategy={verticalListSortingStrategy}>
            {visibleColumns.map(item => (
              <SortableItem
                item={item}
                key={item.key}
                onFixedChange={handleFixedChange}
                onVisibleChange={handleVisibleChange}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default DragContent;

function getVisibleStats(columns: TableColumnCheck[]) {
  let total = 0;
  let checked = 0;

  columns.forEach(item => {
    if (!item.visible) return;

    total += 1;

    if (item.checked) {
      checked += 1;
    }
  });

  return { checked, total };
}

function getNextFixed(fixed: TableColumnFixed) {
  const index = FIXED_OPTIONS.findIndex(item => item === fixed);

  if (index === -1 || index === FIXED_OPTIONS.length - 1) {
    return FIXED_OPTIONS[0];
  }

  return FIXED_OPTIONS[index + 1];
}

function renderColumnTitle(title: TableColumnCheck['title'], fallback: string): ReactNode {
  if (typeof title === 'function') {
    return fallback;
  }

  return title ?? fallback;
}

function renderFixedIcon(fixed: TableColumnFixed) {
  if (fixed === 'left') {
    return <SvgIcon className="rotate-270" icon="octicon:pin-16" />;
  }

  if (fixed === 'right') {
    return <SvgIcon icon="octicon:pin-slash-16" />;
  }

  return <SvgIcon icon="octicon:pin-16" />;
}
