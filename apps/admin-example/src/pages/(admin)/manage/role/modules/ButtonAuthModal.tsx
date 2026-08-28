import { Button, Modal, Space, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { useEffect, useState } from 'react';
import type { Key } from 'react';
import { useTranslation } from 'react-i18next';

interface ButtonAuthModalProps {
  /** Close the permission modal. */
  onClose: () => void;
  /** Whether the permission modal is visible. */
  open: boolean;
  /** Role id used when reading and saving button permission checks. */
  roleId: number;
}

const ButtonAuthModal = (props: ButtonAuthModalProps) => {
  const { onClose, open, roleId } = props;

  const { t } = useTranslation();
  const [checks, setChecks] = useState<Key[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const title = `${t('common.edit')}${t('page.manage.role.buttonAuth')}`;

  useEffect(() => {
    if (!open) return;

    setTreeData(createButtonAuthTree());
    setChecks([1, 2, 3, 4, 5]);
  }, [open, roleId]);

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
      <Tree
        checkable
        checkedKeys={checks}
        className="h-280px"
        height={280}
        treeData={treeData}
        onCheck={handleCheck}
      />
    </Modal>
  );
};

export default ButtonAuthModal;

function createButtonAuthTree(): DataNode[] {
  return [
    { key: 1, title: 'button1' },
    { key: 2, title: 'button2' },
    { key: 3, title: 'button3' },
    { key: 4, title: 'button4' },
    { key: 5, title: 'button5' },
    { key: 6, title: 'button6' },
    { key: 7, title: 'button7' },
    { key: 8, title: 'button8' },
    { key: 9, title: 'button9' },
    { key: 10, title: 'button10' }
  ];
}

function normalizeTreeChecks(value: Key[] | { checked: Key[] }) {
  if (Array.isArray(value)) {
    return value;
  }

  return value.checked;
}
