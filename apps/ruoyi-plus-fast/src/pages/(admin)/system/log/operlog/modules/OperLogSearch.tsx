import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';

import SearchRangePicker from '@/features/table/SearchRangePicker';
import type { OperLogBusinessType, OperLogListParams, OperLogStatus } from '@/service/api/monitor-operlog';

interface OperLogSearchProps {
  /** 由表格 Hook 管理的查询表单。 */
  form: TableSearchProps<OperLogListParams>['form'];
  /** 重置表单和已提交查询参数。 */
  reset: TableSearchProps<OperLogListParams>['reset'];
  /** 提交操作日志查询。 */
  search: TableSearchProps<OperLogListParams>['search'];
  /** 当前已提交的操作日志查询参数。 */
  searchParams: TableSearchProps<OperLogListParams>['searchParams'];
}

const BUSINESS_TYPE_OPTIONS = [
  { label: '其它', value: 0 },
  { label: '新增', value: 1 },
  { label: '修改', value: 2 },
  { label: '删除', value: 3 },
  { label: '授权', value: 4 },
  { label: '导出', value: 5 },
  { label: '导入', value: 6 },
  { label: '强退', value: 7 },
  { label: '生成代码', value: 8 },
  { label: '清空数据', value: 9 }
] satisfies Array<{ label: string; value: OperLogBusinessType }>;

const STATUS_OPTIONS = [
  { label: '正常', value: 0 },
  { label: '异常', value: 1 }
] satisfies Array<{ label: string; value: OperLogStatus }>;

const OperLogSearch = (props: OperLogSearchProps) => {
  const { form, reset, search, searchParams } = props;

  async function handleSearch() {
    await search();
  }

  return (
    <Form form={form} initialValues={searchParams} labelCol={{ md: 7, span: 5 }}>
      <Row gutter={[16, 16]} wrap>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="系统模块" name="title">
            <Input allowClear placeholder="请输入系统模块" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="操作类型" name="businessType">
            <Select allowClear options={BUSINESS_TYPE_OPTIONS} placeholder="请选择操作类型" />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="操作人员" name="operName">
            <Input allowClear placeholder="请输入操作人员" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="操作 IP" name="operIp">
            <Input allowClear placeholder="请输入操作 IP" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="操作状态" name="status">
            <Select allowClear options={STATUS_OPTIONS} placeholder="请选择操作状态" />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <SearchRangePicker
            showTime
            form={form}
            label="操作时间"
          />
        </Col>
        <Col className="lg:ml-auto" lg={8} md={12} span={24}>
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

export default OperLogSearch;
