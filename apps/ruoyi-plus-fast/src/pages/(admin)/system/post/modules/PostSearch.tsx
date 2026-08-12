import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';
import type { PostId, PostListParams, PostStatus } from '@/service/api/system-post';

export interface PostDepartmentOption {
  /** 部门是否已停用。 */
  disabled: boolean;
  /** 带完整层级的部门名称。 */
  label: string;
  /** 当前层级的部门名称。 */
  shortLabel: string;
  /** 部门主键。 */
  value: PostId;
}

interface PostSearchProps {
  /** 岗位查询可选择的部门。 */
  departments: PostDepartmentOption[];
  /** 由表格 Hook 管理的查询表单。 */
  form: TableSearchProps<PostListParams>['form'];
  /** 精确部门发生变化时同步左侧部门树。 */
  onExactDepartmentChange: (deptId?: PostId) => void;
  /** 重置岗位查询以及左侧部门范围。 */
  onReset: () => void;
  /** 重置表单和已提交查询参数。 */
  reset: TableSearchProps<PostListParams>['reset'];
  /** 提交岗位查询。 */
  search: TableSearchProps<PostListParams>['search'];
  /** 当前已经提交的查询参数。 */
  searchParams: TableSearchProps<PostListParams>['searchParams'];
}

const STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
] satisfies Array<{ label: string; value: PostStatus }>;

const PostSearch = (props: PostSearchProps) => {
  const { departments, form, onExactDepartmentChange, onReset, reset, search, searchParams } = props;

  async function handleSearch() {
    await search();
  }

  function handleReset() {
    reset();
    onReset();
  }

  function handleExactDepartmentChange(deptId?: PostId) {
    form.setFieldValue('belongDeptId', undefined);
    onExactDepartmentChange(deptId);
  }

  return (
    <Form form={form} initialValues={searchParams} labelCol={{ md: 7, span: 5 }}>
      <Form.Item hidden name="belongDeptId">
        <Input />
      </Form.Item>

      <Row gutter={[16, 16]} wrap>
        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="岗位名称" name="postName">
            <Input allowClear placeholder="请输入岗位名称" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="岗位编码" name="postCode">
            <Input allowClear placeholder="请输入岗位编码" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="状态" name="status">
            <Select allowClear options={STATUS_OPTIONS} placeholder="全部状态" />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="类别编码" name="postCategory">
            <Input allowClear placeholder="请输入类别编码" onPressEnter={handleSearch} />
          </Form.Item>
        </Col>

        <Col lg={8} md={12} span={24}>
          <Form.Item className="m-0" label="精确部门" name="deptId">
            <Select
              allowClear
              showSearch={{
                optionFilterProp: "label"
              }}
              options={departments.map(option => ({ label: option.label, value: option.value }))}
              placeholder="只查询一个部门"
              onChange={handleExactDepartmentChange}
            />
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

export default PostSearch;
