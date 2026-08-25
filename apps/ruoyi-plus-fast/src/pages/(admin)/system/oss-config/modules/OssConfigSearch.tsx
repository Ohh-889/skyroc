import { SvgIcon } from '@shell/ui/compose';
import type { TableSearchProps } from '@shell/ui/compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';

import type { OssConfigListParams } from '@/service/api/system-oss-config';

import { OSS_CONFIG_STATUS_OPTIONS } from './oss-config-utils';

export type OssConfigTableParams = OssConfigListParams;

interface OssConfigSearchProps {
  /** 由表格 Hook 管理的查询表单实例。 */
  form: TableSearchProps<OssConfigTableParams>['form'];
  /** 重置查询表单和已提交参数。 */
  reset: TableSearchProps<OssConfigTableParams>['reset'];
  /** 提交查询表单。 */
  search: TableSearchProps<OssConfigTableParams>['search'];
  /** 当前已经提交的配置查询参数。 */
  searchParams: TableSearchProps<OssConfigTableParams>['searchParams'];
}

const OssConfigSearch = (props: OssConfigSearchProps) => {
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
            label="配置名称"
            name="configKey"
          >
            <Input
              allowClear
              maxLength={20}
              placeholder="精确匹配，如 minio"
              onPressEnter={handleSearch}
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
            label="桶名称"
            name="bucketName"
          >
            <Input
              allowClear
              maxLength={255}
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
            label="默认状态"
            name="status"
          >
            <Select
              allowClear
              options={[...OSS_CONFIG_STATUS_OPTIONS]}
              placeholder="全部"
            />
          </Form.Item>
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

export default OssConfigSearch;
