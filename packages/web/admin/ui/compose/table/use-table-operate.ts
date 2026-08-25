import { useBoolean } from 'ahooks';
import { Form, message } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import type { Key } from 'react';
import { useTranslation } from 'react-i18next';

import type { TableData, TableOperateType } from './types';

/**
 * 表格操作Hook
 *
 * 提供表格常用操作功能： - 添加/编辑抽屉管理 - 表格行选择 - 删除操作
 */
export function useTableOperate<T extends TableData = TableData>(
  data: T[],
  getData: (isResetCurrent?: boolean) => Promise<void>,
  executeResActions?: (res: T, operateType: TableOperateType) => void | Promise<void>
) {
  const { t } = useTranslation();

  // 抽屉可见性状态
  const [drawerVisible, { setFalse: closeDrawer, setTrue: openDrawer }] = useBoolean();

  // 操作类型：添加或编辑
  const [operateType, setOperateType] = useState<TableOperateType>('add');

  // 表单实例
  const [form] = Form.useForm<T>();

  /** 正在编辑的数据 */
  const [editingData, setEditingData] = useState<T>();

  /** 处理添加操作 */
  function handleAdd() {
    setOperateType('add');
    setEditingData(undefined);
    form.resetFields();
    openDrawer();
  }

  /**
   * 处理编辑操作
   *
   * @param idOrData - 数据ID或完整数据对象
   */
  function handleEdit(idOrData: T['id'] | T) {
    if (typeof idOrData === 'object') {
      form.setFieldsValue(idOrData);
      setEditingData(idOrData);
    } else {
      const findItem = data.find(item => item.id === idOrData);
      if (findItem) {
        form.setFieldsValue(findItem);
        setEditingData(findItem);
      }
    }

    setOperateType('edit');
    openDrawer();
  }

  /** 选中的行keys */
  const [checkedRowKeys, setCheckedRowKeys] = useState<Key[]>([]);

  /** 行选择变化处理 */
  function onSelectChange(keys: Key[]) {
    setCheckedRowKeys(keys);
  }

  /** 行选择配置 */
  const rowSelection: TableProps<T>['rowSelection'] = {
    columnWidth: 48,
    fixed: true,
    onChange: onSelectChange,
    selectedRowKeys: checkedRowKeys,
    type: 'checkbox'
  };

  /** 关闭抽屉 */
  function onClose() {
    closeDrawer();
    form.resetFields();
    setEditingData(undefined);
  }

  /** 批量删除完成后的回调 */
  async function onBatchDeleted() {
    message.success(t('common.deleteSuccess'));
    setCheckedRowKeys([]);
    await getData(false);
  }

  /** 单个删除完成后的回调 */
  async function onDeleted() {
    message.success(t('common.deleteSuccess'));
    await getData(false);
  }

  /** 提交表单 */
  async function handleSubmit() {
    const res = await form.validateFields();

    if (executeResActions) {
      // 执行业务逻辑
      await executeResActions(res, operateType);
    }

    message.success(t('common.updateSuccess'));

    onClose();
    await getData();
  }

  return {
    checkedRowKeys,
    closeDrawer,
    drawerVisible,
    editingData,
    generalPopupOperation: {
      form,
      handleSubmit,
      onClose,
      open: drawerVisible,
      operateType
    },
    handleAdd,
    handleEdit,
    onBatchDeleted,
    onDeleted,
    onSelectChange,
    openDrawer,
    operateType,
    rowSelection
  };
}
