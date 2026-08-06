import { SvgIcon } from '@skyroc/web-ui-compose';
import {
  Alert,
  Button,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Radio,
  Spin,
  TreeSelect,
  Typography
} from 'antd';
import { useEffect, useMemo } from 'react';

import { usePostDetailQuery } from '@/service/api/system-post';
import type { PostDeptTreeNode, PostId, PostSavePayload, PostStatus } from '@/service/api/system-post';

export type PostEditorMode = 'create' | 'update';

interface PostFormValues {
  deptId: PostId;
  postCategory?: string;
  postCode: string;
  postName: string;
  postSort: number;
  remark?: string;
  status: PostStatus;
}

interface PostDeptTreeOption {
  children?: PostDeptTreeOption[];
  disabled: boolean;
  title: string;
  value: PostId;
}

interface PostEditorDrawerProps {
  /** 岗位表单使用的部门选择树。 */
  departments: PostDeptTreeNode[];

  /** 保存请求是否正在执行。 */
  loading: boolean;

  /** 抽屉当前处于新增还是编辑模式。 */
  mode: PostEditorMode;

  /** 关闭岗位编辑抽屉。 */
  onClose: () => void;

  /** 提交经过表单校验的岗位数据。 */
  onSubmit: (values: PostSavePayload) => Promise<void>;

  /** 抽屉是否打开。 */
  open: boolean;

  /** 编辑中的岗位 ID；新增模式下为空。 */
  postId?: PostId;

  /** 从部门树新增岗位时预选的部门 ID。 */
  presetDeptId?: PostId;
}

function buildDepartmentTreeData(nodes: PostDeptTreeNode[]): PostDeptTreeOption[] {
  return nodes.map(node => ({
    children: node.children?.length ? buildDepartmentTreeData(node.children) : [],
    disabled: node.disabled,
    title: node.label,
    value: node.id
  }));
}

const PostEditorDrawer = (props: PostEditorDrawerProps) => {
  const { departments, loading, mode, onClose, onSubmit, open, postId, presetDeptId } = props;

  const [form] = Form.useForm<PostFormValues>();
  const isUpdate = mode === 'update';
  const detailQuery = usePostDetailQuery(postId, open && isUpdate);
  const departmentTreeData = useMemo(() => buildDepartmentTreeData(departments), [departments]);

  useEffect(() => {
    if (!open) return;
    if (!isUpdate) {
      form.resetFields();
      form.setFieldsValue({
        deptId: presetDeptId,
        postCategory: '',
        postCode: '',
        postName: '',
        postSort: 0,
        remark: '',
        status: '0'
      });
      return;
    }
    if (!detailQuery.data) return;

    form.setFieldsValue({
      deptId: detailQuery.data.deptId,
      postCategory: detailQuery.data.postCategory ?? '',
      postCode: detailQuery.data.postCode,
      postName: detailQuery.data.postName,
      postSort: detailQuery.data.postSort,
      remark: detailQuery.data.remark ?? '',
      status: detailQuery.data.status
    });
  }, [detailQuery.data, form, isUpdate, open, presetDeptId]);



  async function handleFinish(values: PostFormValues) {
    await onSubmit({
      deptId: values.deptId,
      postCategory: values.postCategory?.trim() || null,
      postCode: values.postCode.trim(),
      postName: values.postName.trim(),
      postSort: values.postSort,
      remark: values.remark?.trim() || null,
      status: values.status
    });
  }

  const drawerTitle = isUpdate ? '编辑岗位' : '新增岗位';
  const drawerSubtitle = isUpdate ? '修改岗位信息或调整所属部门' : '在组织中创建新的任职位置';

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex gap={8} justify="flex-end">
          <Button disabled={loading} onClick={onClose}>
            取消
          </Button>
          <Button loading={loading} type="primary" onClick={() => form.submit()}>
            保存岗位
          </Button>
        </Flex>
      }
      mask={{
        closable: !loading
      }}
      open={open}
      title={
        <div>
          <div className="text-17px font-600">{drawerTitle}</div>
          <div className="mt-3px text-12px text-tertiary">{drawerSubtitle}</div>
        </div>
      }
      size={560}
      onClose={onClose}
    >
      {detailQuery.isError ? (
        <Alert
          action={
            <Button size="small" onClick={() => detailQuery.refetch()}>
              重试
            </Button>
          }
          className="mb-16px"
          title="岗位详情加载失败"
          showIcon
          type="error"
        />
      ) : null}

      <Spin spinning={isUpdate && detailQuery.isLoading}>
        <Form<PostFormValues> form={form} layout="vertical" requiredMark onFinish={handleFinish}>
          <Typography.Text className="flex items-center gap-7px" strong>
            <SvgIcon className="text-primary" icon="ph:tree-structure" />
            组织归属
          </Typography.Text>
          <Divider className="my-12px" />

          <Form.Item
            extra="停用部门可用于查看历史岗位，但不能新建或迁入岗位。"
            label="所属部门"
            name="deptId"
            rules={[{ message: '请选择所属部门', required: true }]}
          >
            <TreeSelect
              showSearch={{
                treeNodeFilterProp: "title"
              }}
              placeholder="请选择所属部门"
              treeData={departmentTreeData}
              treeDefaultExpandAll
            />
          </Form.Item>

          <Typography.Text className="flex items-center gap-7px" strong>
            <SvgIcon className="text-primary" icon="ph:identification-card" />
            岗位信息
          </Typography.Text>
          <Divider className="my-12px" />

          <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
            <Form.Item
              extra="同一部门内岗位名称不能重复。"
              label="岗位名称"
              name="postName"
              rules={[
                { message: '请输入岗位名称', required: true },
                { max: 50, message: '岗位名称最多 50 个字符' }
              ]}
            >
              <Input allowClear maxLength={50} placeholder="例如 前端工程师" />
            </Form.Item>

            <Form.Item
              extra="租户内唯一，用于导入和系统对接。"
              label="岗位编码"
              name="postCode"
              rules={[
                { message: '请输入岗位编码', required: true },
                { max: 64, message: '岗位编码最多 64 个字符' }
              ]}
            >
              <Input allowClear maxLength={64} placeholder="例如 FE_DEV" />
            </Form.Item>

            <Form.Item
              extra="当前没有已确认的类别字典，先按编码录入。"
              label="类别编码"
              name="postCategory"
              rules={[{ max: 100, message: '类别编码最多 100 个字符' }]}
            >
              <Input allowClear maxLength={100} placeholder="例如 TECH" />
            </Form.Item>

            <Form.Item label="岗位顺序" name="postSort" rules={[{ message: '请输入岗位顺序', required: true }]}>
              <InputNumber className="w-full" min={0} precision={0} />
            </Form.Item>
          </div>

          <Form.Item extra="已分配用户的岗位不能停用。" label="岗位状态" name="status">
            <Radio.Group
              options={[
                { label: '正常', value: '0' },
                { label: '停用', value: '1' }
              ]}
            />
          </Form.Item>

          <Form.Item label="备注" name="remark" rules={[{ max: 500, message: '备注最多 500 个字符' }]}>
            <Input.TextArea allowClear maxLength={500} placeholder="请输入岗位职责或使用说明" rows={4} showCount />
          </Form.Item>

          <Alert
            description="岗位描述用户在部门中的任职位置，不会直接授予菜单或按钮权限。权限仍由角色管理。"
            showIcon
            type="info"
          />
        </Form>
      </Spin>
    </Drawer>
  );
};

export default PostEditorDrawer;
