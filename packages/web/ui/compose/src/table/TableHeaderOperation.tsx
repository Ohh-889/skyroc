import { Button, Popconfirm, Popover, Space } from 'antd';
import type { SpaceProps } from 'antd';
import classNames from 'clsx';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { SvgIcon } from '../components';

import DragContent from './DragContent';
import type { TableColumnCheck } from './types';

interface TableHeaderOperationProps {
  /** 添加按钮点击事件 */
  add?: () => Promise<void> | void;
  /** 添加按钮文案，默认使用 common.add */
  addText?: string;
  /** 批量删除按钮文案，默认使用 common.batchDelete */
  batchDeleteText?: string;
  /** 自定义操作按钮（会替换默认的添加和批量删除按钮） */
  children?: ReactNode;
  /** 表格列配置 */
  columns: TableColumnCheck[];
  /** 列设置按钮文案，默认使用 common.columnSetting */
  columnSettingText?: string;
  /** 是否禁用删除按钮 */
  disabledDelete?: boolean;
  /** Space 组件的对齐方式 */
  itemAlign?: SpaceProps['align'];
  /** 加载状态（刷新按钮图标会旋转） */
  loading?: boolean;
  /** 批量删除按钮点击事件 */
  onDelete?: () => Promise<void> | void;
  /** 前缀内容（显示在最前面） */
  prefix?: ReactNode;
  /** 刷新按钮点击事件 */
  refresh: () => Promise<void> | void;
  /** 刷新按钮文案，默认使用 common.refresh */
  refreshText?: string;
  /** 更新列配置的回调 */
  setColumnChecks: (checks: TableColumnCheck[]) => void;
  /** 后缀内容（显示在最后面） */
  suffix?: ReactNode;
}

/**
 * 表格头部操作栏组件
 *
 * 提供常用的表格操作功能： - 添加按钮 - 批量删除按钮 - 刷新按钮 - 列设置（显示/隐藏、拖拽排序）
 *
 * @example
 *   ```tsx
 *   <TableHeaderOperation
 *     columns={columnChecks}
 *     setColumnChecks={setColumnChecks}
 *     add={handleAdd}
 *     onDelete={handleBatchDelete}
 *     disabledDelete={checkedRowKeys.length === 0}
 *     refresh={getData}
 *     loading={loading}
 *   />;
 *   ```
 */
const TableHeaderOperation = (props: TableHeaderOperationProps) => {
  const {
    add,
    addText,
    batchDeleteText,
    children,
    columns,
    columnSettingText,
    disabledDelete = false,
    itemAlign,
    loading = false,
    onDelete,
    prefix,
    refresh,
    refreshText,
    setColumnChecks,
    suffix
  } = props;

  const { t } = useTranslation();

  return (
    <Space wrap align={itemAlign} className="lt-sm:w-200px">
      {prefix}

      {children || (
        <>
          {add && (
            <Button
              ghost
              icon={<SvgIcon className="text-icon" icon="ic:round-plus" />}
              size="small"
              type="primary"
              onClick={add}
            >
              {addText ?? t('common.add')}
            </Button>
          )}

          {onDelete && (
            <Popconfirm title={t('common.confirmDelete')} onConfirm={onDelete}>
              <Button
                danger
                ghost
                disabled={disabledDelete}
                icon={<SvgIcon className="text-icon" icon="ic:round-delete" />}
                size="small"
              >
                {batchDeleteText ?? t('common.batchDelete')}
              </Button>
            </Popconfirm>
          )}
        </>
      )}

      <Button
        size="small"
        icon={
          <SvgIcon
            className={classNames('text-icon', {
              'animate-spin': loading
            })}
            icon="mdi:refresh"
          />
        }
        onClick={refresh}
      >
        {refreshText ?? t('common.refresh')}
      </Button>

      <Popover
        placement="bottomRight"
        trigger="click"
        content={<DragContent columns={columns} setColumnChecks={setColumnChecks} />}
      >
        <Button icon={<SvgIcon icon="ant-design:setting-outlined" />} size="small">
          {columnSettingText ?? t('common.columnSetting')}
        </Button>
      </Popover>

      {suffix}
    </Space>
  );
};

export default TableHeaderOperation;
