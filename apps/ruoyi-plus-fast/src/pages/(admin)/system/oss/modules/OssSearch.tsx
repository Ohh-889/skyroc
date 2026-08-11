import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { AutoComplete, Button, Col, DatePicker, Flex, Form, Input, InputNumber, Row } from 'antd';

import type { OssListParams } from '@/service/api/system-oss';

import { formatOssTime, toOssCreatedRange } from './shared';
import type { OssCreatedRange } from './shared';

interface OssSearchProps {
  /** 由表格 Hook 管理的查询表单实例。 */
  form: TableSearchProps<OssListParams>['form'];
  /** 重置查询表单和已提交参数。 */
  reset: TableSearchProps<OssListParams>['reset'];
  /** 提交查询表单。 */
  search: TableSearchProps<OssListParams>['search'];
  /** 当前已经提交的文件查询参数。 */
  searchParams: TableSearchProps<OssListParams>['searchParams'];
  /** 当前页出现过的存储配置 key，只作为输入建议，不限制取值。 */
  serviceOptions: string[];
}

/** 常见后缀建议。接口是精确匹配，所以统一给带点的格式。 */
const SUFFIX_OPTIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf', '.docx', '.xlsx', '.zip', '.mp4'].map(
  value => ({ value })
);

const OssSearch = (props: OssSearchProps) => {
  const { form, reset, search, searchParams, serviceOptions } = props;

  const beginTime = Form.useWatch('beginTime', form);
  const endTime = Form.useWatch('endTime', form);

  async function handleSearch() {
    await search();
  }

  /** RangePicker 只认 Dayjs，但参数、URL 和接口统一用字符串，所以选完立刻拆回表单里那两个字段。 */
  function handleCreatedRangeChange(value: OssCreatedRange) {
    form.setFieldsValue({
      beginTime: formatOssTime(value?.[0]),
      endTime: formatOssTime(value?.[1])
    });
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
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="原始名称"
            name="originalName"
          >
            <Input
              allowClear
              maxLength={255}
              placeholder="上传时的文件名"
              onPressEnter={handleSearch}
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
            label="对象 Key"
            name="fileName"
          >
            <Input
              allowClear
              maxLength={255}
              placeholder="存储中的对象路径片段"
              onPressEnter={handleSearch}
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
            label="文件后缀"
            name="fileSuffix"
          >
            <AutoComplete
              allowClear
              filterOption
              options={SUFFIX_OPTIONS}
              placeholder="例如 .png"
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
            label="存储配置"
            name="service"
          >
            <AutoComplete
              allowClear
              filterOption
              options={serviceOptions.map(value => ({ value }))}
              placeholder="配置名称，如 minio"
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
            label="上传人 ID"
            name="createBy"
          >
            <InputNumber
              className="w-full"
              min={0}
              placeholder="接口暂不支持按姓名查询"
              precision={0}
            />
          </Form.Item>
        </Col>

        <Col
          lg={12}
          md={24}
          span={24}
        >
          <Form.Item
            hidden
            name="beginTime"
          >
            <Input />
          </Form.Item>
          <Form.Item
            hidden
            name="endTime"
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="m-0"
            label="创建时间"
            labelCol={{ lg: 4, md: 4, span: 6 }}
          >
            <DatePicker.RangePicker
              className="w-full"
              showTime={{ format: 'HH:mm' }}
              value={toOssCreatedRange(beginTime, endTime)}
              onChange={handleCreatedRangeChange}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={24}
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

export default OssSearch;
