import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { Button, Col, DatePicker, Flex, Form, Input, Row, Select } from 'antd';
import type { Dayjs } from 'dayjs';

import type { NoticeListParams, NoticeStatus, NoticeType } from '@/service/api/system-notice';

export interface NoticeTableParams extends NoticeListParams {
  /** 查询表单使用的创建时间范围。 */
  createdRange?: [Dayjs | null, Dayjs | null] | null;
}

interface NoticeSearchProps {
  /** 由表格 Hook 管理的查询表单。 */
  form: TableSearchProps<NoticeTableParams>['form'];
  /** 重置表单和已提交查询参数。 */
  reset: TableSearchProps<NoticeTableParams>['reset'];
  /** 提交公告查询。 */
  search: TableSearchProps<NoticeTableParams>['search'];
  /** 当前已经提交的公告查询参数。 */
  searchParams: TableSearchProps<NoticeTableParams>['searchParams'];
}

const NOTICE_TYPE_OPTIONS = [
  { label: '通知', value: '1' },
  { label: '公告', value: '2' }
] satisfies Array<{ label: string; value: NoticeType }>;

const NOTICE_STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '关闭', value: '1' }
] satisfies Array<{ label: string; value: NoticeStatus }>;

const NoticeSearch = (props: NoticeSearchProps) => {
  const { form, reset, search, searchParams } = props;

  async function handleSearch() {
    await search();
  }

  return (
    <Form form={form} initialValues={searchParams} labelCol={{ md: 7, span: 5 }}>
      <Row gutter={[16, 16]} wrap>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="公告标题" name="noticeTitle">
            <Input allowClear placeholder="请输入公告标题" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="操作人员" name="createByName">
            <Input allowClear placeholder="请输入创建人账号" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="公告类型" name="noticeType">
            <Select allowClear options={NOTICE_TYPE_OPTIONS} placeholder="全部类型" />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="公告状态" name="status">
            <Select allowClear options={NOTICE_STATUS_OPTIONS} placeholder="全部状态" />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="创建时间" name="createdRange">
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>
        </Col>
        <Col lg={8} md={12} span={24}>
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

export default NoticeSearch;
