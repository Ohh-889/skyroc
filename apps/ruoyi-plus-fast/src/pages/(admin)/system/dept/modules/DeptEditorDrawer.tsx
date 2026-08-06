// oxlint-disable max-params
// oxlint-disable complexity
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
  Select,
  Spin,
  TreeSelect,
  Typography
} from 'antd';
import { useEffect, useMemo } from 'react';

import { useDeptDetailQuery, useDeptListExcludingSubtreeQuery, useDeptListQuery } from '@/service/api/system-dept';
import type { DeptId, DeptSavePayload, DeptStatus } from '@/service/api/system-dept';
import { useUserOptionsQuery } from '@/service/api/system-user';
import type { UserListItem } from '@/service/api/system-user';

import { buildDeptSelectTree } from './dept-utils';

export type DeptEditorMode = 'create' | 'update';

interface DeptFormValues {
  deptCategory?: string;
  deptName: string;
  email?: string;
  leader?: DeptId;
  orderNum: number;
  parentId: DeptId;
  phone?: string;
  status: DeptStatus;
}

interface DeptEditorDrawerProps {
  /** 编辑中的部门 ID；新增模式下为空。 */
  deptId?: DeptId;

  /** 保存请求是否正在执行。 */
  loading: boolean;

  /** 抽屉当前处于新增还是编辑模式。 */
  mode: DeptEditorMode;

  /** 关闭抽屉。 */
  onClose: () => void;

  /** 提交经过表单校验的部门数据。 */
  onSubmit: (values: DeptSavePayload) => Promise<void>;

  /** 抽屉是否打开。 */
  open: boolean;

  /** 新增下级时预选的上级部门 ID。 */
  parentId?: DeptId;
}

function buildLeaderOptions(
  users: UserListItem[],
  currentLeader: DeptId | null | undefined,
  currentLeaderName: null | string | undefined
) {
  const options = users.map(user => ({
    label: user.nickName || user.userName,
    value: user.userId
  }));
  if (currentLeader === null || currentLeader === undefined) return options;
  if (options.some(option => String(option.value) === String(currentLeader))) return options;
  return [{ label: currentLeaderName || `用户 #${currentLeader}`, value: currentLeader }, ...options];
}

interface DrawerLoadingState {
  createOptions: boolean;
  detail: boolean;
  exclude: boolean;
  isUpdate: boolean;
  leader: boolean;
  open: boolean;
}

function isDrawerLoading(state: DrawerLoadingState) {
  return state.isUpdate ? state.detail || state.exclude || state.leader : state.open && state.createOptions;
}

const DeptEditorDrawer = (props: DeptEditorDrawerProps) => {
  const { deptId, loading, mode, onClose, onSubmit, open, parentId } = props;

  const [form] = Form.useForm<DeptFormValues>();
  const isUpdate = mode === 'update';
  const detailQuery = useDeptDetailQuery(deptId, open && isUpdate);
  const excludeQuery = useDeptListExcludingSubtreeQuery(deptId, open && isUpdate);
  const leaderQuery = useUserOptionsQuery({ deptId }, open && isUpdate);
  const createOptionsQuery = useDeptListQuery({}, { enabled: open && !isUpdate });
  const selectedParentId = Form.useWatch('parentId', form);
  const optionDepartments = isUpdate ? (excludeQuery.data ?? []) : (createOptionsQuery.data ?? []);
  const parentTreeData = useMemo(() => buildDeptSelectTree(optionDepartments), [optionDepartments]);
  const resolvedLeaderOptions = useMemo(
    () => buildLeaderOptions(leaderQuery.data ?? [], detailQuery.data?.leader, detailQuery.data?.leaderName),
    [detailQuery.data?.leader, detailQuery.data?.leaderName, leaderQuery.data]
  );
  const detailLoading = isDrawerLoading({
    createOptions: createOptionsQuery.isLoading,
    detail: detailQuery.isLoading,
    exclude: excludeQuery.isLoading,
    isUpdate,
    leader: leaderQuery.isLoading,
    open
  });
  const parentChanged =
    isUpdate && detailQuery.data !== undefined && String(selectedParentId) !== String(detailQuery.data.parentId);

  useEffect(() => {
    if (!open) return;
    if (!isUpdate) {
      form.resetFields();
      form.setFieldsValue({
        deptCategory: undefined,
        deptName: '',
        email: undefined,
        leader: undefined,
        orderNum: 0,
        parentId: parentId ?? 0,
        phone: undefined,
        status: '0'
      });
      return;
    }
    if (!detailQuery.data) return;

    form.setFieldsValue({
      deptCategory: detailQuery.data.deptCategory ?? undefined,
      deptName: detailQuery.data.deptName,
      email: detailQuery.data.email ?? undefined,
      leader: detailQuery.data.leader ?? undefined,
      orderNum: detailQuery.data.orderNum,
      parentId: detailQuery.data.parentId,
      phone: detailQuery.data.phone ?? undefined,
      status: detailQuery.data.status
    });
  }, [detailQuery.data, form, isUpdate, open, parentId]);

  async function handleFinish(values: DeptFormValues) {
    await onSubmit({
      deptCategory: values.deptCategory?.trim() || null,
      deptName: values.deptName.trim(),
      email: values.email?.trim() || null,
      leader: values.leader ?? null,
      orderNum: values.orderNum,
      parentId: values.parentId,
      phone: values.phone?.trim() || null,
      status: values.status
    });
  }

  async function handleRetry() {
    if (isUpdate) {
      await Promise.all([detailQuery.refetch(), excludeQuery.refetch(), leaderQuery.refetch()]);
      return;
    }

    await createOptionsQuery.refetch();
  }

  const drawerTitle = isUpdate ? '编辑部门' : '新增部门';
  const drawerSubtitle = isUpdate ? '修改部门信息或调整组织归属' : '创建新的组织节点';

  return (
    <Drawer
      destroyOnHidden
      mask={{ closable: !loading }}
      open={open}
      title={
        <div>
          <div className="font-600 text-17px">{drawerTitle}</div>
          <div className="mt-3px text-12px text-tertiary">{drawerSubtitle}</div>
        </div>
      }
      size={560}
      onClose={onClose}
      footer={
        <Flex justify="flex-end" gap={8}>
          <Button disabled={loading} onClick={onClose}>
            取消
          </Button>
          <Button loading={loading} type="primary" onClick={() => form.submit()}>
            保存部门
          </Button>
        </Flex>
      }
    >
      {detailQuery.isError || excludeQuery.isError || leaderQuery.isError || createOptionsQuery.isError ? (
        <Alert
          className="mb-16px"
          title="部门信息加载失败"
          showIcon
          type="error"
          action={
            <Button size="small" onClick={handleRetry}>
              重试
            </Button>
          }
        />
      ) : null}

      <Spin spinning={detailLoading}>
        <Form<DeptFormValues> form={form} layout="vertical" requiredMark onFinish={handleFinish}>
          <Typography.Text className="flex items-center gap-7px" strong>
            <SvgIcon className="text-primary" icon="ph:tree-structure" />
            组织归属
          </Typography.Text>
          <Divider className="my-12px" />

          <Form.Item label="上级部门" name="parentId" rules={[{ message: '请选择上级部门', required: true }]}>
            <TreeSelect
              showSearch={{
                treeNodeFilterProp: "title"
              }}
              treeDefaultExpandAll
              placeholder="请选择上级部门"
              treeData={[
                {
                  children: parentTreeData,
                  key: '0',
                  title: '顶级部门',
                  value: 0
                }
              ]}
            />
          </Form.Item>

          {parentChanged ? (
            <Alert
              className="mb-16px"
              title="移动后，该部门及其全部下级将一起迁移，成员归属不变。"
              showIcon
              type="warning"
            />
          ) : null}

          <Typography.Text className="flex items-center gap-7px" strong>
            <SvgIcon className="text-primary" icon="ph:identification-card" />
            基础信息
          </Typography.Text>
          <Divider className="my-12px" />

          <Form.Item
            label="部门名称"
            name="deptName"
            rules={[
              { message: '请输入部门名称', required: true },
              { max: 30, message: '部门名称最多 30 个字符' }
            ]}
          >
            <Input allowClear placeholder="请输入部门名称" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
            <Form.Item
              extra="当前没有已确认的类别字典，先按编码录入。"
              label="类别编码"
              name="deptCategory"
              rules={[{ max: 100, message: '类别编码最多 100 个字符' }]}
            >
              <Input allowClear placeholder="例如 DEPT" />
            </Form.Item>

            <Form.Item label="显示顺序" name="orderNum" rules={[{ message: '请输入显示顺序', required: true }]}>
              <InputNumber className="w-full" min={0} precision={0} />
            </Form.Item>
          </div>

          <Typography.Text className="flex items-center gap-7px" strong>
            <SvgIcon className="text-primary" icon="ph:user-circle" />
            负责人和联系方式
          </Typography.Text>
          <Divider className="my-12px" />

          <Form.Item label="负责人" name="leader">
            <Select
              allowClear
              disabled={!isUpdate}
              showSearch={{ filterOption: true }}
              options={resolvedLeaderOptions}
              placeholder={isUpdate ? '请选择负责人' : '创建部门并分配成员后可设置'}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
            <Form.Item
              label="联系电话"
              name="phone"
              rules={[
                { len: 11, message: '联系电话应为 11 位手机号码' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
              ]}
            >
              <Input allowClear maxLength={11} placeholder="请输入联系电话" />
            </Form.Item>

            <Form.Item
              label="联系邮箱"
              name="email"
              rules={[
                { max: 50, message: '联系邮箱最多 50 个字符' },
                { message: '请输入正确的邮箱地址', type: 'email' }
              ]}
            >
              <Input allowClear maxLength={50} placeholder="name@example.com" />
            </Form.Item>
          </div>

          <Form.Item extra="停用前后端会校验正常子部门和已分配用户。" label="部门状态" name="status">
            <Radio.Group
              options={[
                { label: '正常', value: '0' },
                { label: '停用', value: '1' }
              ]}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default DeptEditorDrawer;
