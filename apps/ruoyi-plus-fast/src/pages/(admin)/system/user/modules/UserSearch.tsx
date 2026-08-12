import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';

import type { UserStatus } from '@/service/api/system-user';

import type { UserSearchField, UserTableParams } from './shared';

interface UserSearchProps {
  /** 由表格 Hook 管理的查询表单实例。 */
  form: TableSearchProps<UserTableParams>['form'];
  /** 重置查询表单和已提交参数。 */
  reset: TableSearchProps<UserTableParams>['reset'];
  /** 提交查询表单。 */
  search: TableSearchProps<UserTableParams>['search'];
  /** 当前已经提交的用户查询参数。 */
  searchParams: TableSearchProps<UserTableParams>['searchParams'];
}

const SEARCH_FIELD_OPTIONS = [
  { label: '用户账号', value: 'username' },
  { label: '用户昵称', value: 'nickname' },
  { label: '手机号码', value: 'phone' }
] satisfies Array<{ label: string; value: UserSearchField }>;

const STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
] satisfies Array<{ label: string; value: UserStatus }>;

const UserSearch = (props: UserSearchProps) => {
  const { form, reset, search, searchParams } = props;

  async function handleSearch() {
    await search();
  }

  return (
    <Form form={form} initialValues={searchParams} labelCol={{ md: 7, span: 5 }}>
      <Row gutter={[16, 16]} wrap>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="查询字段" name="searchField">
            <Select options={SEARCH_FIELD_OPTIONS} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="关键词" name="keyword">
            <Input allowClear placeholder="请输入查询关键词" onPressEnter={handleSearch} />
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

export default UserSearch;
