import type { GeneralPopupOperationProps, TableDataWithIndex } from '@shell/ui/compose';
import { Button, Drawer, Flex, Form, Input, Radio, Select } from 'antd';
import type { FormRule } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAllRolesQuery } from '@/service/api';

import { enableStatusOptions, userGenderOptions } from './shared';

type UserTableRecord = TableDataWithIndex<Api.SystemManage.User>;

interface UserOperateDrawerProps {
  /** Ant Design form instance shared with table operate hook. */
  form: GeneralPopupOperationProps<UserTableRecord>['form'];
  /** Submit add or edit form. */
  handleSubmit: GeneralPopupOperationProps<UserTableRecord>['handleSubmit'];
  /** Close drawer and reset form state. */
  onClose: GeneralPopupOperationProps<UserTableRecord>['onClose'];
  /** Whether the drawer is visible. */
  open: GeneralPopupOperationProps<UserTableRecord>['open'];
  /** Current operation type. */
  operateType: GeneralPopupOperationProps<UserTableRecord>['operateType'];
}

const UserOperateDrawer = (props: UserOperateDrawerProps) => {
  const { form, handleSubmit, onClose, open, operateType } = props;

  const { t } = useTranslation();
  const { data: allRoles = [], isFetching, refetch } = useAllRolesQuery();
  const requiredRule = createRequiredRule(t('form.required'));
  const roleOptions = allRoles.map(getRoleOption);

  useEffect(() => {
    if (!open) return;

    refetch().catch(() => undefined);
  }, [open, refetch]);

  return (
    <Drawer
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="primary" onClick={handleSubmit}>
            {t('common.confirm')}
          </Button>
        </Flex>
      }
      open={open}
      title={operateType === 'add' ? t('page.manage.user.addUser') : t('page.manage.user.editUser')}
      onClose={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item label={t('page.manage.user.userName')} name="userName" rules={[requiredRule]}>
          <Input placeholder={t('page.manage.user.form.userName')} />
        </Form.Item>

        <Form.Item label={t('page.manage.user.userGender')} name="userGender">
          <Radio.Group>
            {userGenderOptions.map(item => (
              <Radio key={item.value} value={item.value}>
                {t(item.label)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('page.manage.user.nickName')} name="nickName">
          <Input placeholder={t('page.manage.user.form.nickName')} />
        </Form.Item>

        <Form.Item label={t('page.manage.user.userPhone')} name="userPhone">
          <Input placeholder={t('page.manage.user.form.userPhone')} />
        </Form.Item>

        <Form.Item label={t('page.manage.user.userEmail')} name="userEmail">
          <Input placeholder={t('page.manage.user.form.userEmail')} />
        </Form.Item>

        <Form.Item label={t('page.manage.user.userStatus')} name="status" rules={[requiredRule]}>
          <Radio.Group>
            {enableStatusOptions.map(item => (
              <Radio key={item.value} value={item.value}>
                {t(item.label)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('page.manage.user.userRole')} name="userRoles">
          <Select
            loading={isFetching}
            mode="multiple"
            options={roleOptions}
            placeholder={t('page.manage.user.form.userRole')}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UserOperateDrawer;

function createRequiredRule(message: string): FormRule {
  return {
    message,
    required: true
  };
}

function getRoleOption(item: Api.SystemManage.AllRole) {
  return {
    label: item.roleName,
    value: item.roleCode
  };
}
