import { SvgIcon } from '@shell/ui/compose';
import type { TableSearchProps } from '@shell/ui/compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { translateOptions } from '@/utils/common';

import { enableStatusOptions } from './shared';

interface RoleSearchProps {
  /** Ant Design search form instance controlled by the table hook. */
  form: TableSearchProps<Api.SystemManage.RoleSearchParams>['form'];
  /** Reset search form and submitted query params. */
  reset: TableSearchProps<Api.SystemManage.RoleSearchParams>['reset'];
  /** Submit search form. */
  search: TableSearchProps<Api.SystemManage.RoleSearchParams>['search'];
  /** Current submitted search params used as form initial values. */
  searchParams: TableSearchProps<Api.SystemManage.RoleSearchParams>['searchParams'];
}

const RoleSearch = (props: RoleSearchProps) => {
  const { form, reset, search, searchParams } = props;

  const { t } = useTranslation();

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
            label={t('page.manage.role.roleName')}
            name="roleName"
          >
            <Input
              allowClear
              placeholder={t('page.manage.role.form.roleName')}
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
            label={t('page.manage.role.roleCode')}
            name="roleCode"
          >
            <Input
              allowClear
              placeholder={t('page.manage.role.form.roleCode')}
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
            label={t('page.manage.role.roleStatus')}
            name="status"
          >
            <Select
              allowClear
              options={translateOptions(enableStatusOptions)}
              placeholder={t('page.manage.role.form.roleStatus')}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
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

export default RoleSearch;
