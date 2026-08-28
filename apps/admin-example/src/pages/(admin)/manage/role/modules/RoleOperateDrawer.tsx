import type { GeneralPopupOperationProps, TableDataWithIndex } from '@shell/ui/compose';
import { Button, Drawer, Flex, Form, Input, Radio, Space } from 'antd';
import type { FormRule } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonAuthModal from './ButtonAuthModal';
import MenuAuthModal from './MenuAuthModal';
import { enableStatusOptions } from './shared';

type RoleTableRecord = TableDataWithIndex<Api.SystemManage.Role>;

interface RoleOperateDrawerProps {
  /** Ant Design form instance shared with table operate hook. */
  form: GeneralPopupOperationProps<RoleTableRecord>['form'];
  /** Submit add or edit form. */
  handleSubmit: GeneralPopupOperationProps<RoleTableRecord>['handleSubmit'];
  /** Close drawer and reset form state. */
  onClose: GeneralPopupOperationProps<RoleTableRecord>['onClose'];
  /** Whether the drawer is visible. */
  open: GeneralPopupOperationProps<RoleTableRecord>['open'];
  /** Current operation type. */
  operateType: GeneralPopupOperationProps<RoleTableRecord>['operateType'];
  /** Current editing role id used by permission modals. */
  rowId: number;
}

const RoleOperateDrawer = (props: RoleOperateDrawerProps) => {
  const { form, handleSubmit, onClose, open, operateType, rowId } = props;

  const { t } = useTranslation();
  const requiredRule = createRequiredRule(t('form.required'));
  const [buttonAuthVisible, setButtonAuthVisible] = useState(false);
  const [menuAuthVisible, setMenuAuthVisible] = useState(false);

  function openButtonAuthModal() {
    setButtonAuthVisible(true);
  }

  function closeButtonAuthModal() {
    setButtonAuthVisible(false);
  }

  function openMenuAuthModal() {
    setMenuAuthVisible(true);
  }

  function closeMenuAuthModal() {
    setMenuAuthVisible(false);
  }

  return (
    <Drawer
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
          >
            {t('common.confirm')}
          </Button>
        </Flex>
      }
      open={open}
      title={operateType === 'add' ? t('page.manage.role.addRole') : t('page.manage.role.editRole')}
      onClose={onClose}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label={t('page.manage.role.roleName')}
          name="roleName"
          rules={[requiredRule]}
        >
          <Input placeholder={t('page.manage.role.form.roleName')} />
        </Form.Item>

        <Form.Item
          label={t('page.manage.role.roleCode')}
          name="roleCode"
          rules={[requiredRule]}
        >
          <Input placeholder={t('page.manage.role.form.roleCode')} />
        </Form.Item>

        <Form.Item
          label={t('page.manage.role.roleStatus')}
          name="status"
          rules={[requiredRule]}
        >
          <Radio.Group>
            {enableStatusOptions.map(item => (
              <Radio
                key={item.value}
                value={item.value}
              >
                {t(item.label)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('page.manage.role.roleDesc')}
          name="roleDesc"
        >
          <Input placeholder={t('page.manage.role.form.roleDesc')} />
        </Form.Item>
      </Form>

      {operateType === 'edit' && (
        <Space>
          <Button onClick={openMenuAuthModal}>{t('page.manage.role.menuAuth')}</Button>
          <MenuAuthModal
            open={menuAuthVisible}
            roleId={rowId}
            onClose={closeMenuAuthModal}
          />

          <Button onClick={openButtonAuthModal}>{t('page.manage.role.buttonAuth')}</Button>
          <ButtonAuthModal
            open={buttonAuthVisible}
            roleId={rowId}
            onClose={closeButtonAuthModal}
          />
        </Space>
      )}
    </Drawer>
  );
};

export default RoleOperateDrawer;

function createRequiredRule(message: string): FormRule {
  return {
    message,
    required: true
  };
}
