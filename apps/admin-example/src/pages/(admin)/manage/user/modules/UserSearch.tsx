import { SvgIcon } from '@shell/ui/compose';
import type { TableSearchProps } from '@shell/ui/compose';
import { REG_EMAIL, REG_PHONE } from '@skyroc/utils';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';
import type { FormRule } from 'antd';
import { useTranslation } from 'react-i18next';

import { translateOptions } from '@/utils/common';

import { enableStatusOptions, userGenderOptions } from './shared';

interface UserSearchProps {
  /** Ant Design search form instance controlled by the table hook. */
  form: TableSearchProps<Api.SystemManage.UserSearchParams>['form'];
  /** Reset search form and submitted query params. */
  reset: TableSearchProps<Api.SystemManage.UserSearchParams>['reset'];
  /** Submit search form. */
  search: TableSearchProps<Api.SystemManage.UserSearchParams>['search'];
  /** Current submitted search params used as form initial values. */
  searchParams: TableSearchProps<Api.SystemManage.UserSearchParams>['searchParams'];
}

const UserSearch = (props: UserSearchProps) => {
  const { form, reset, search, searchParams } = props;

  const { t } = useTranslation();
  const emailRule = createPatternRule(REG_EMAIL, t('form.email.invalid'));
  const phoneRule = createPatternRule(REG_PHONE, t('form.phone.invalid'));

  async function handleSearch() {
    await search();
  }

  return (
    <Form
      form={form}
      initialValues={searchParams}
      labelCol={{ md: 7, span: 5 }}
    >
      <Row
        gutter={[16, 16]}
        wrap
      >
        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label={t('page.manage.user.userName')}
            name="userName"
          >
            <Input
              allowClear
              placeholder={t('page.manage.user.form.userName')}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label={t('page.manage.user.userGender')}
            name="userGender"
          >
            <Select
              allowClear
              options={translateOptions(userGenderOptions)}
              placeholder={t('page.manage.user.form.userGender')}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label={t('page.manage.user.nickName')}
            name="nickName"
          >
            <Input
              allowClear
              placeholder={t('page.manage.user.form.nickName')}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label={t('page.manage.user.userPhone')}
            name="userPhone"
            rules={[phoneRule]}
          >
            <Input
              allowClear
              placeholder={t('page.manage.user.form.userPhone')}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label={t('page.manage.user.userEmail')}
            name="userEmail"
            rules={[emailRule]}
          >
            <Input
              allowClear
              placeholder={t('page.manage.user.form.userEmail')}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label={t('page.manage.user.userStatus')}
            name="status"
          >
            <Select
              allowClear
              options={translateOptions(enableStatusOptions)}
              placeholder={t('page.manage.user.form.userStatus')}
            />
          </Form.Item>
        </Col>

        <Col
          lg={12}
          span={24}
        >
          <Form.Item className="m-0">
            <Flex
              align="center"
              gap={12}
              justify="end"
            >
              <Button
                icon={<SvgIcon icon="ic:round-refresh" />}
                onClick={reset}
              >
                {t('common.reset')}
              </Button>
              <Button
                ghost
                icon={<SvgIcon icon="ic:round-search" />}
                type="primary"
                onClick={handleSearch}
              >
                {t('common.search')}
              </Button>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserSearch;

function createPatternRule(pattern: RegExp, message: string): FormRule {
  return {
    message,
    pattern,
    validateTrigger: 'onChange'
  };
}
