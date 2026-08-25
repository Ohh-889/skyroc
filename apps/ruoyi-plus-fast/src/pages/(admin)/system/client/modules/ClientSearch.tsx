import { SvgIcon } from '@shell/ui/compose';
import type { TableSearchProps } from '@shell/ui/compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';
import type { ClientListParams, ClientStatus } from '@/service/api/system-client';


interface ClientSearchProps {
  /** 查询表单实例。 */
  form: TableSearchProps<ClientListParams>['form'];
  /** 重置查询条件。 */
  reset: TableSearchProps<ClientListParams>['reset'];
  /** 提交查询。 */
  search: TableSearchProps<ClientListParams>['search'];
  /** 当前查询条件。 */
  searchParams: TableSearchProps<ClientListParams>['searchParams'];
}

const ClientSearch = (props: ClientSearchProps) => {
  const { form, reset, search, searchParams } = props;

  async function submitSearch() {
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
            label="客户端 ID"
            name="clientId"
          >
            <Input
              allowClear
              maxLength={64}
              placeholder="请输入完整客户端 ID"
              onPressEnter={submitSearch}
            />
          </Form.Item>
        </Col>
        <Col
          lg={7}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="客户端 Key"
            name="clientKey"
          >
            <Input
              allowClear
              maxLength={32}
              placeholder="例如 pc、android"
              onPressEnter={submitSearch}
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
              options={[
                { label: '正常', value: '0' satisfies ClientStatus },
                { label: '停用', value: '1' satisfies ClientStatus }
              ]}
              placeholder="全部状态"
            />
          </Form.Item>
        </Col>
        <Col
          lg={4}
          md={12}
          span={24}
        >
          <Form.Item className="m-0">
            <Flex
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
                onClick={submitSearch}
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

export default ClientSearch;
