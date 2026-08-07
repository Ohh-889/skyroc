import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { Button, Col, DatePicker, Flex, Form, Input, Row, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import type { ConfigListParams, ConfigType } from '@/service/api/system-config';

export interface ConfigTableParams extends ConfigListParams {
  createdRange?: [Dayjs | null, Dayjs | null] | null;
}
interface ConfigSearchProps {
  /** 查询表单及提交状态。 */ form: TableSearchProps<ConfigTableParams>['form'];
  /** 重置查询。 */ reset: TableSearchProps<ConfigTableParams>['reset'];
  /** 提交查询。 */ search: TableSearchProps<ConfigTableParams>['search'];
  /** 当前查询条件。 */ searchParams: TableSearchProps<ConfigTableParams>['searchParams'];
}
const ConfigSearch = (props: ConfigSearchProps) => {
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
            label="参数名称"
            name="configName"
          >
            <Input
              allowClear
              placeholder="请输入参数名称"
              onPressEnter={submitSearch}
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
            label="参数键名"
            name="configKey"
          >
            <Input
              allowClear
              placeholder="请输入参数键名"
              onPressEnter={submitSearch}
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
            label="系统内置"
            name="configType"
          >
            <Select
              allowClear
              options={[
                { label: '内置', value: 'Y' satisfies ConfigType },
                { label: '自定义', value: 'N' satisfies ConfigType }
              ]}
              placeholder="全部类型"
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
            label="创建时间"
            name="createdRange"
          >
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>
        </Col>
        <Col
          lg={24}
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
export default ConfigSearch;
