import { SvgIcon } from '@shell/ui/compose';
import type { TableSearchProps } from '@shell/ui/compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';

import SearchRangePicker from '@/features/table/SearchRangePicker';
import type { NoticeListParams, NoticeStatus, NoticeType } from '@/service/api/system-notice';

interface NoticeSearchProps {
  /** 由表格 Hook 管理的查询表单。 */
  form: TableSearchProps<NoticeListParams>['form'];
  /** 重置表单和已提交查询参数。 */
  reset: TableSearchProps<NoticeListParams>['reset'];
  /** 提交公告查询。 */
  search: TableSearchProps<NoticeListParams>['search'];
  /** 当前已经提交的公告查询参数。 */
  searchParams: TableSearchProps<NoticeListParams>['searchParams'];
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
          <SearchRangePicker
            form={form}
            granularity="day"
            label="创建时间"
          />
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
