import { Button, Drawer, Flex, Form, Input, Radio, Select, Spin, TreeSelect } from 'antd';
import { useEffect } from 'react';

import { useUserDetailQuery, useUserPostOptionsQuery } from '@/service/api/system-user';
import type { DeptTreeNode, UserDetailResponse, UserId, UserSavePayload, UserStatus } from '@/service/api/system-user';

export type UserEditorMode = 'create' | 'update';

interface UserFormValues {
  deptId?: UserId;
  email?: string;
  nickName: string;
  password?: string;
  phonenumber?: string;
  postIds: UserId[];
  remark?: string;
  roleIds: UserId[];
  sex: string;
  status: UserStatus;
  userName: string;
}

interface UserEditorDrawerProps {
  /** 用户可选择的部门树。 */
  departments: DeptTreeNode[];
  /** 保存请求是否执行中。 */
  loading: boolean;
  /** 新增或编辑模式。 */
  mode: UserEditorMode;
  /** 关闭抽屉。 */
  onClose: () => void;
  /** 提交用户资料。 */
  onSubmit: (values: UserSavePayload) => Promise<void>;
  /** 抽屉是否打开。 */
  open: boolean;
  /** 编辑中的用户 ID。 */
  userId?: UserId;
}

const UserEditorDrawer = (props: UserEditorDrawerProps) => {
  const { departments, loading, mode, onClose, onSubmit, open, userId } = props;

  const [form] = Form.useForm<UserFormValues>();
  const isUpdate = mode === 'update';
  const deptId = Form.useWatch('deptId', form);
  const detailQuery = useUserDetailQuery(userId, open);
  const postQuery = useUserPostOptionsQuery(deptId, open && Boolean(deptId));

  useEffect(() => {
    if (!open || !detailQuery.data) return;
    form.setFieldsValue(createFormValues(detailQuery.data));
  }, [detailQuery.data, form, open]);

  function handleDepartmentChange() {
    form.setFieldValue('postIds', []);
  }

  async function handleFinish(values: UserFormValues) {
    await onSubmit({
      deptId: values.deptId ?? null,
      email: values.email?.trim() || null,
      nickName: values.nickName.trim(),
      password: isUpdate ? null : values.password?.trim() || null,
      phonenumber: values.phonenumber?.trim() || null,
      postIds: values.postIds ?? [],
      remark: values.remark?.trim() || null,
      roleIds: values.roleIds ?? [],
      sex: values.sex,
      status: values.status,
      userName: values.userName.trim()
    });
  }

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex gap={8} justify="flex-end">
          <Button disabled={loading} onClick={onClose}>
            取消
          </Button>
          <Button loading={loading} type="primary" onClick={() => form.submit()}>
            保存用户
          </Button>
        </Flex>
      }
      maskClosable={!loading}
      open={open}
      title={isUpdate ? '编辑用户' : '新增用户'}
      width={620}
      onClose={onClose}
    >
      <Spin spinning={detailQuery.isLoading}>
        <Form<UserFormValues> form={form} layout="vertical" onFinish={handleFinish}>
          <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
            <Form.Item label="用户账号" name="userName" rules={[{ required: true, message: '请输入用户账号' }]}>
              <Input disabled={isUpdate} maxLength={30} placeholder="请输入登录账号" />
            </Form.Item>
            <Form.Item label="用户昵称" name="nickName" rules={[{ required: true, message: '请输入用户昵称' }]}>
              <Input maxLength={64} placeholder="请输入用户昵称" />
            </Form.Item>
            {!isUpdate ? (
              <Form.Item
                label="初始密码"
                name="password"
                rules={[{ min: 5, max: 64, message: '密码长度为 5 至 64 位' }]}
              >
                <Input.Password placeholder="不填写则账号暂时无法密码登录" />
              </Form.Item>
            ) : null}
            <Form.Item label="所属部门" name="deptId">
              <TreeSelect
                allowClear
                showSearch
                treeData={toTreeOptions(departments)}
                treeDefaultExpandAll
                onChange={handleDepartmentChange}
              />
            </Form.Item>
            <Form.Item label="手机号码" name="phonenumber">
              <Input maxLength={11} placeholder="请输入手机号码" />
            </Form.Item>
            <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
              <Input maxLength={50} placeholder="name@example.com" />
            </Form.Item>
            <Form.Item label="性别" name="sex">
              <Radio.Group
                options={[
                  { label: '男', value: '0' },
                  { label: '女', value: '1' },
                  { label: '未知', value: '2' }
                ]}
              />
            </Form.Item>
            <Form.Item label="账号状态" name="status">
              <Radio.Group
                options={[
                  { label: '正常', value: '0' },
                  { label: '停用', value: '1' }
                ]}
              />
            </Form.Item>
            <Form.Item label="岗位" name="postIds">
              <Select
                disabled={deptId === undefined}
                loading={postQuery.isFetching}
                mode="multiple"
                options={(postQuery.data ?? detailQuery.data?.posts ?? []).map(post => ({
                  label: post.postName,
                  value: post.postId
                }))}
                placeholder={deptId === undefined ? '请先选择部门' : '请选择岗位'}
              />
            </Form.Item>
            <Form.Item
              extra={isUpdate ? '编辑资料时保留现有角色；请使用独立的分配角色操作调整。' : undefined}
              label="角色"
              name="roleIds"
            >
              <Select
                disabled={isUpdate}
                mode="multiple"
                options={(detailQuery.data?.roles ?? []).map(role => ({
                  disabled: role.superAdmin,
                  label: role.roleName,
                  value: role.roleId
                }))}
                placeholder="请选择角色"
              />
            </Form.Item>
          </div>
          <Form.Item label="备注" name="remark">
            <Input.TextArea maxLength={500} rows={4} showCount />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

function createFormValues(detail: UserDetailResponse): UserFormValues {
  const user = detail.user;

  return {
    deptId: user?.deptId ?? undefined,
    email: user?.email || undefined,
    nickName: user?.nickName ?? '',
    password: undefined,
    phonenumber: user?.phonenumber || undefined,
    postIds: detail.postIds ?? [],
    remark: user?.remark ?? undefined,
    roleIds: detail.roleIds ?? [],
    sex: user?.sex ?? '2',
    status: user?.status ?? '0',
    userName: user?.userName ?? ''
  };
}

function toTreeOptions(
  nodes: DeptTreeNode[]
): Array<{ children?: ReturnType<typeof toTreeOptions>; disabled: boolean; title: string; value: UserId }> {
  return nodes.map(node => ({
    children: node.children ? toTreeOptions(node.children) : undefined,
    disabled: node.disabled,
    title: node.label,
    value: node.id
  }));
}

export default UserEditorDrawer;
