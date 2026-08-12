import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';

import SearchRangePicker from '@/features/table/SearchRangePicker';
import type { RoleListParams, RoleStatus } from '@/service/api/system-role';

interface RoleSearchProps {
  /** 由表格 Hook 管理的查询表单实例。 */
  form: TableSearchProps<RoleListParams>['form'];
  /** 重置查询表单和已提交参数。 */
  reset: TableSearchProps<RoleListParams>['reset'];
  /** 提交查询表单。 */
  search: TableSearchProps<RoleListParams>['search'];
  /** 当前已经提交的角色查询参数。 */
  searchParams: TableSearchProps<RoleListParams>['searchParams'];
}

const STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
] satisfies Array<{ label: string; value: RoleStatus }>;

const RoleSearch = (props: RoleSearchProps) => {
  const { form, reset, search, searchParams } = props;

  async function handleSearch() {
    await search();
  }

  return (
    <Form form={form} initialValues={searchParams} labelCol={{ md: 7, span: 5 }}>
      <Row gutter={[16, 16]} wrap>
        <Col lg={6} md={12} span={24}>
          <Form.Item className="m-0" label="角色名称" name="roleName">
            <Input allowClear placeholder="请输入角色名称" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>

        <Col lg={6} md={12} span={24}>
          <Form.Item className="m-0" label="权限字符" name="roleKey">
            <Input allowClear placeholder="例如 admin、dept-lead" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>

        <Col lg={6} md={12} span={24}>
          <Form.Item className="m-0" label="状态" name="status">
            <Select allowClear options={STATUS_OPTIONS} placeholder="全部状态" />
          </Form.Item>
        </Col>

        <Col lg={6} md={12} span={24}>
          <SearchRangePicker
            form={form}
            granularity="day"
            label="创建时间"
          />
        </Col>

        <Col lg={24} span={24}>
          <Form.Item className="m-0">
            <Flex align="center" gap={12} justify="end">
              <Button icon={<SvgIcon icon="ic:round-refresh" />} onClick={reset}>
                重置
              </Button>
              <Button ghost icon={<SvgIcon icon="ic:round-search" />} type="primary" onClick={handleSearch}>
                查询
              </Button>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default RoleSearch;
