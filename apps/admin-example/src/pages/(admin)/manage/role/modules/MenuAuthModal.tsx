import { Button, Modal, Select, Space, Spin, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useEffect, useState } from 'react';
import type { Key } from 'react';
import { useTranslation } from 'react-i18next';

import { useAllPagesQuery, useMenuTreeQuery } from '@/service/api';

interface MenuAuthModalProps {
  /** Close the permission modal. */
  onClose: () => void;
  /** Whether the permission modal is visible. */
  open: boolean;
  /** Role id used when reading and saving menu permission checks. */
  roleId: number;
}

const MenuAuthModal = (props: MenuAuthModalProps) => {
  const { onClose, open, roleId } = props;

  const { t } = useTranslation();
  const { data: allPages = [], isFetching: isFetchingPages, refetch: refetchPages } = useAllPagesQuery();
  const { data: menuTree = [], isFetching: isFetchingTree, refetch: refetchMenuTree } = useMenuTreeQuery();
  const [home, setHome] = useState<string>();
  const [checks, setChecks] = useState<Key[]>([]);
  const pageSelectOptions = allPages.map(getPageOption);
  const treeData = menuTree.map(convertMenuTreeToDataNode);
  const title = `${t('common.edit')}${t('page.manage.role.menuAuth')}`;

  useEffect(() => {
    if (!open) return;

    setHome('');
    setChecks([]);
    refetchPages().catch(() => undefined);
    refetchMenuTree().catch(() => undefined);
  }, [open, refetchMenuTree, refetchPages, roleId]);

  function handleSubmit() {
    window.$message?.success?.(t('common.modifySuccess'));
    onClose();
  }

  function handleCheck(value: Key[] | { checked: Key[] }) {
    setChecks(normalizeTreeChecks(value));
  }

  return (
    <Modal
      className="w-480px"
      footer={
        <Space className="mt-16px">
          <Button
            size="small"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={handleSubmit}
          >
            {t('common.confirm')}
          </Button>
        </Space>
      }
      open={open}
      title={title}
      onCancel={onClose}
    >
      <div className="flex-y-center gap-16px pb-12px">
        <div>{t('page.manage.menu.home')}</div>

        <Select
          className="w-240px"
          loading={isFetchingPages}
          options={pageSelectOptions}
          size="small"
          value={home}
          onChange={setHome}
        />
      </div>

      {isFetchingTree ? (
        <div className="h-280px flex-center">
          <Spin />
        </div>
      ) : (
        <Tree
          blockNode
          checkable
          checkedKeys={checks}
          className="h-280px"
          height={280}
          treeData={treeData}
          onCheck={handleCheck}
        />
      )}
    </Modal>
  );
};

export default MenuAuthModal;

function convertMenuTreeToDataNode(menu: Api.SystemManage.MenuTree): DataNode {
  return {
    children: menu.children?.map(convertMenuTreeToDataNode),
    key: menu.id,
    title: menu.label
  };
}

function getPageOption(page: string) {
  return {
    label: page,
    value: page
  };
}

function normalizeTreeChecks(value: Key[] | { checked: Key[] }) {
  if (Array.isArray(value)) {
    return value;
  }

  return value.checked;
}
