import { SvgIcon } from '@shell/ui/compose';
import type { TableSearchProps } from '@shell/ui/compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';

import SearchRangePicker from '@/features/table/SearchRangePicker';
import type { LoginInfoListParams, LoginInfoStatus } from '@/service/api/monitor-logininfo';

interface LoginInfoSearchProps {
  /** 由表格 Hook 管理的查询表单。 */
  form: TableSearchProps<LoginInfoListParams>['form'];
  /** 重置表单和已提交查询参数。 */
  reset: TableSearchProps<LoginInfoListParams>['reset'];
  /** 提交登录日志查询。 */
  search: TableSearchProps<LoginInfoListParams>['search'];
  /** 当前已提交的登录日志查询参数。 */
  searchParams: TableSearchProps<LoginInfoListParams>['searchParams'];
}

const STATUS_OPTIONS = [
  { label: '成功', value: '0' },
  { label: '失败', value: '1' }
] satisfies Array<{ label: string; value: LoginInfoStatus }>;

const LoginInfoSearch = (props: LoginInfoSearchProps) => {
  const { form, reset, search, searchParams } = props;

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
          lg={8}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="用户账号"
            name="userName"
          >
            <Input
              allowClear
              placeholder="请输入用户账号"
              onPressEnter={handleSearch}
            />
          </Form.Item>
        </Col>
        <Col
          lg={8}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="登录 IP"
            name="ipaddr"
          >
            <Input
              allowClear
              placeholder="请输入登录 IP"
              onPressEnter={handleSearch}
            />
          </Form.Item>
        </Col>
        <Col
          lg={8}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="登录状态"
            name="status"
          >
            <Select
              allowClear
              options={STATUS_OPTIONS}
              placeholder="请选择登录状态"
            />
          </Form.Item>
        </Col>
        <Col
          lg={8}
          md={12}
          span={24}
        >
          <SearchRangePicker
            showTime
            form={form}
            label="访问时间"
          />
        </Col>
        <Col
          className="lg:ml-auto"
          lg={8}
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

export default LoginInfoSearch;
