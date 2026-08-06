import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { Button, Col, Flex, Form, Input, Row } from 'antd';

import type { OnlineSessionListParams } from '@/service/api/monitor-online';

interface OnlineSearchProps {
  /** 由表格 Hook 管理的查询表单。 */
  form: TableSearchProps<OnlineSessionListParams>['form'];
  /** 重置表单和已提交查询参数。 */
  reset: TableSearchProps<OnlineSessionListParams>['reset'];
  /** 提交在线会话查询。 */
  search: TableSearchProps<OnlineSessionListParams>['search'];
  /** 当前已经提交的在线会话查询参数。 */
  searchParams: TableSearchProps<OnlineSessionListParams>['searchParams'];
}

const OnlineSearch = (props: OnlineSearchProps) => {
  const { form, reset, search, searchParams } = props;

  async function handleSearch() {
    await search();
  }

  return (
    <Form form={form} initialValues={searchParams} labelCol={{ md: 7, span: 5 }}>
      <Row gutter={[16, 16]} wrap>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="登录地址" name="ipaddr">
            <Input allowClear placeholder="请输入完整登录 IP" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="用户名称" name="userName">
            <Input allowClear placeholder="请输入完整用户账号" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>
        <Col lg={8} md={24} span={24}>
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

export default OnlineSearch;
