import { SvgIcon } from '@shell/ui/compose';
import type { TableSearchProps } from '@shell/ui/compose';
import { Button, Col, Flex, Form, Input, Row } from 'antd';
import type { DictDataListParams } from '@/service/api/system-dict';

interface DictDataSearchProps {
  /** 是否禁用搜索。 */
  disabled: boolean;
  /** 字典数据查询表单。 */
  searchProps: TableSearchProps<DictDataListParams>;
}

const DictDataSearch = (props: DictDataSearchProps) => {
  const { disabled, searchProps } = props;
  const { form, reset, search, searchParams } = searchProps;

  async function handleSearch() {
    await search();
  }

  function handleReset() {
    reset();
  }

  return (
    <Form form={form} initialValues={searchParams} labelCol={{ md: 7, span: 5 }}>
      <Row gutter={[16, 16]} wrap>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="字典标签" name="dictLabel">
            <Input allowClear disabled={disabled} placeholder="请输入字典标签" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>
        <Col lg={24} span={24}>
          <Form.Item className="m-0">
            <Flex align="center" gap={12} justify="end">
              <Button icon={<SvgIcon icon="ic:round-refresh" />} onClick={handleReset}>
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

export default DictDataSearch;
