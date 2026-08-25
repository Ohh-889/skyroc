import { SvgIcon } from '@shell/ui/compose';
import type { TableSearchProps } from '@shell/ui/compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';

import SearchRangePicker from '@/features/table/SearchRangePicker';
import type { TenantPackageListParams } from '@/service/api/system-tenant-package';

import { TENANT_PACKAGE_FIELD_LIMITS, TENANT_PACKAGE_STATUS_OPTIONS } from './tenant-package-utils';

interface TenantPackageSearchProps {
  /** 由表格 Hook 管理的查询表单实例。 */
  form: TableSearchProps<TenantPackageListParams>['form'];
  /** 重置查询表单和已提交参数。 */
  reset: TableSearchProps<TenantPackageListParams>['reset'];
  /** 提交查询表单。 */
  search: TableSearchProps<TenantPackageListParams>['search'];
  /** 当前已经提交的套餐查询参数。 */
  searchParams: TableSearchProps<TenantPackageListParams>['searchParams'];
}

const TenantPackageSearch = (props: TenantPackageSearchProps) => {
  const { form, reset, search, searchParams } = props;

  async function handleSearch() {
    await search();
  }

  return (
    <Form
      form={form}
      initialValues={searchParams}
      labelCol={{ md: 8, span: 6 }}
    >
      <Row
        gutter={[16, 16]}
        wrap
      >
        <Col
          lg={7}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="套餐名称"
            name="packageName"
          >
            <Input
              allowClear
              maxLength={TENANT_PACKAGE_FIELD_LIMITS.packageName}
              placeholder="模糊匹配"
              onPressEnter={handleSearch}
            />
          </Form.Item>
        </Col>

        <Col
          lg={5}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="状态"
            name="status"
          >
            <Select
              allowClear
              options={[...TENANT_PACKAGE_STATUS_OPTIONS]}
              placeholder="全部状态"
            />
          </Form.Item>
        </Col>

        <Col
          lg={7}
          md={12}
          span={24}
        >
          <SearchRangePicker
            form={form}
            granularity="day"
            label="创建时间"
          />
        </Col>

        <Col
          lg={5}
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
                重置
              </Button>
              <Button
                ghost
                icon={<SvgIcon icon="ic:round-search" />}
                type="primary"
                onClick={handleSearch}
              >
                查询
              </Button>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default TenantPackageSearch;
