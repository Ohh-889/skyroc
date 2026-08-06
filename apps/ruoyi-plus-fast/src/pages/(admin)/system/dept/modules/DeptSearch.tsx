import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';

import type { DeptListParams, DeptStatus } from '@/service/api/system-dept';

interface DeptSearchProps {
  /** 由表格 Hook 管理的查询表单实例。 */
  form: TableSearchProps<DeptListParams>['form'];
  /** 重置查询表单和已提交参数。 */
  reset: TableSearchProps<DeptListParams>['reset'];
  /** 提交查询表单。 */
  search: TableSearchProps<DeptListParams>['search'];
  /** 当前已经提交的部门查询参数。 */
  searchParams: TableSearchProps<DeptListParams>['searchParams'];
}

const STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
] satisfies Array<{ label: string; value: DeptStatus }>;

const DeptSearch = (props: DeptSearchProps) => {
  const { form, reset, search, searchParams } = props;

  async function handleSearch() {
    await search();
  }

  return (
    <Form form={form} initialValues={searchParams} labelCol={{ md: 7, span: 5 }}>
      <Row gutter={[16, 16]} wrap>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="部门名称" name="deptName">
            <Input allowClear placeholder="请输入部门名称" />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="类别编码" name="deptCategory">
            <Input allowClear placeholder="请输入类别编码" />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="状态" name="status">
            <Select allowClear options={STATUS_OPTIONS} placeholder="全部状态" />
          </Form.Item>
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

export default DeptSearch;
