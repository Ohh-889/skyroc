import { AppTree } from '@shell/ui/antd';
import { SvgIcon } from '@shell/ui/compose';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Radio,
  Spin,
  Tabs,
  Tag,
  Typography
} from 'antd';
import type { TreeProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { Key } from 'react';

import { useRoleDetailQuery, useRoleMenuTreeQuery } from '@/service/api/system-role';
import type { RoleDataScope, RoleId, RoleSavePayload, RoleStatus, RoleUpdatePayload } from '@/service/api/system-role';

import {
  buildRoleTreeData,
  collectRoleTreeKeys,
  countRoleTreeSelection,
  filterRoleTreeData,
  normalizeRoleTreeKeys
} from './role-tree';

export type RoleEditorMode = 'create' | 'update';

export type RoleEditorTab = 'basic' | 'permission' | 'review';

interface RoleFormValues {
  menuCheckStrictly: boolean;
  remark?: string;
  roleKey: string;
  roleName: string;
  roleSort: number;
  status: RoleStatus;
}

interface RoleEditorDrawerProps {
  /** 抽屉打开时默认展示的任务分区。 */
  initialTab?: RoleEditorTab;

  /** 保存角色请求是否正在执行。 */
  loading: boolean;

  /** 当前是新增还是编辑角色。 */
  mode: RoleEditorMode;

  /** 关闭角色编辑抽屉。 */
  onClose: () => void;

  /** 提交角色基础信息和菜单授权。 */
  onSubmit: (values: RoleSavePayload | RoleUpdatePayload) => Promise<void>;

  /** 角色编辑抽屉是否打开。 */
  open: boolean;

  /** 编辑角色的 ID；新增模式为空。 */
  roleId?: RoleId;
}

function dataScopeLabel(value: RoleDataScope) {
  return (
    {
      '1': '全部数据',
      '2': '自定义部门',
      '3': '本部门',
      '4': '本部门及以下',
      '5': '仅本人',
      '6': '部门及以下或本人'
    } as const
  )[value];
}

function renderBasicTab() {
  return (
    <div>
      <Typography.Text
        className="flex items-center gap-7px"
        strong
      >
        <SvgIcon
          className="text-primary"
          icon="ph:identification-card"
        />
        角色基本信息
      </Typography.Text>
      <Divider className="my-12px" />
      <Alert
        className="mb-18px"
        description="权限字符用于程序识别。修改后可能影响代码判断和外部集成。"
        showIcon
        type="info"
      />
      <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
        <Form.Item
          label="角色名称"
          name="roleName"
          rules={[
            { message: '请输入角色名称', required: true },
            { max: 30, message: '角色名称最多 30 个字符' }
          ]}
        >
          <Input
            allowClear
            maxLength={30}
            placeholder="例如 部门负责人"
          />
        </Form.Item>
        <Form.Item
          extra="建议使用小写英文、数字、连字符或下划线。"
          label="权限字符"
          name="roleKey"
          rules={[
            { message: '请输入权限字符', required: true },
            { max: 100, message: '权限字符最多 100 个字符' }
          ]}
        >
          <Input
            allowClear
            maxLength={100}
            placeholder="例如 dept-lead"
          />
        </Form.Item>
        <Form.Item
          label="显示顺序"
          name="roleSort"
          rules={[{ message: '请输入显示顺序', required: true }]}
        >
          <InputNumber
            className="w-full"
            min={0}
            precision={0}
          />
        </Form.Item>
        <Form.Item
          label="角色状态"
          name="status"
        >
          <Radio.Group
            options={[
              { label: '正常', value: '0' },
              { label: '停用', value: '1' }
            ]}
          />
        </Form.Item>
      </div>
      <Form.Item
        label="备注"
        name="remark"
        rules={[{ max: 500, message: '备注最多 500 个字符' }]}
      >
        <Input.TextArea
          allowClear
          maxLength={500}
          placeholder="说明角色用途和管理边界"
          rows={4}
          showCount
        />
      </Form.Item>
    </div>
  );
}

const RoleEditorDrawer = (props: RoleEditorDrawerProps) => {
  const { initialTab = 'basic', loading, mode, onClose, onSubmit, open, roleId } = props;

  const [form] = Form.useForm<RoleFormValues>();
  const [activeTab, setActiveTab] = useState<RoleEditorTab>(initialTab);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [permissionKeyword, setPermissionKeyword] = useState('');
  const isUpdate = mode === 'update';
  const detailQuery = useRoleDetailQuery(roleId, open && isUpdate);
  const menuTreeQuery = useRoleMenuTreeQuery(roleId, open);
  const menuCheckStrictly = Form.useWatch('menuCheckStrictly', form) ?? true;
  const roleName = Form.useWatch('roleName', form) ?? '';
  const roleKey = Form.useWatch('roleKey', form) ?? '';
  const status = Form.useWatch('status', form) ?? '0';
  const rawMenuNodes = menuTreeQuery.data?.menus ?? [];
  const menuTreeData = useMemo(() => buildRoleTreeData(rawMenuNodes), [rawMenuNodes]);
  const visibleMenuTreeData = useMemo(
    () => filterRoleTreeData(menuTreeData, permissionKeyword),
    [menuTreeData, permissionKeyword]
  );
  const selectionCount = useMemo(
    () => countRoleTreeSelection(menuTreeData, [...checkedKeys, ...halfCheckedKeys]),
    [checkedKeys, halfCheckedKeys, menuTreeData]
  );
  const detailLoading = isUpdate && detailQuery.isLoading;
  const effectiveDataScope = isUpdate ? (detailQuery.data?.dataScope ?? '5') : '5';

  useEffect(() => {
    if (!open) return;
    setActiveTab(initialTab);
    setPermissionKeyword('');
    setHalfCheckedKeys([]);
    if (!isUpdate) {
      form.resetFields();
      form.setFieldsValue({
        menuCheckStrictly: true,
        remark: undefined,
        roleKey: '',
        roleName: '',
        roleSort: 0,
        status: '0'
      });
      setCheckedKeys([]);
    }
  }, [form, initialTab, isUpdate, open]);

  useEffect(() => {
    if (!open || !isUpdate || !detailQuery.data) return;
    form.setFieldsValue({
      menuCheckStrictly: detailQuery.data.menuCheckStrictly,
      remark: detailQuery.data.remark ?? undefined,
      roleKey: detailQuery.data.roleKey,
      roleName: detailQuery.data.roleName,
      roleSort: detailQuery.data.roleSort,
      status: detailQuery.data.status
    });
  }, [detailQuery.data, form, isUpdate, open]);

  useEffect(() => {
    if (!open || !menuTreeQuery.data) return;
    setCheckedKeys(menuTreeQuery.data.checkedKeys.map(String));
    setExpandedKeys(collectRoleTreeKeys(menuTreeData));
  }, [menuTreeData, menuTreeQuery.data, open]);

  function handleTreeCheck(value: Parameters<NonNullable<TreeProps['onCheck']>>[0]) {
    if (Array.isArray(value)) {
      setCheckedKeys([...value]);
      setHalfCheckedKeys([]);
      return;
    }
    setCheckedKeys([...value.checked]);
    setHalfCheckedKeys([...(value.halfChecked ?? [])]);
  }

  function handleSelectAll() {
    const allKeys = collectRoleTreeKeys(menuTreeData);
    const isAllSelected = allKeys.length > 0 && allKeys.every(key => checkedKeys.map(String).includes(String(key)));
    setCheckedKeys(isAllSelected ? [] : allKeys);
    setHalfCheckedKeys([]);
  }

  async function handleNext() {
    if (activeTab === 'basic') {
      await form.validateFields();
      setActiveTab('permission');
      return;
    }
    setActiveTab('review');
  }

  function handlePrevious() {
    setActiveTab(activeTab === 'review' ? 'permission' : 'basic');
  }

  async function handleFinish(values: RoleFormValues) {
    const payload: RoleSavePayload = {
      dataScope: effectiveDataScope,
      deptCheckStrictly: true,
      menuCheckStrictly: values.menuCheckStrictly,
      menuIds: normalizeRoleTreeKeys([...checkedKeys, ...halfCheckedKeys]),
      remark: values.remark?.trim() || null,
      roleKey: values.roleKey.trim(),
      roleName: values.roleName.trim(),
      roleSort: values.roleSort,
      status: values.status
    };
    await onSubmit(isUpdate && Boolean(roleId) ? { ...payload, roleId } : payload);
  }

  function renderPermissionTab() {
    return (
      <div>
        <Flex
          align="flex-start"
          className="mb-12px"
          justify="space-between"
          wrap
          gap={10}
        >
          <div>
            <Typography.Text
              className="block"
              strong
            >
              菜单与按钮权限
            </Typography.Text>
            <Typography.Text
              className="text-12px"
              type="secondary"
            >
              选择该角色可以访问的页面和操作按钮。
            </Typography.Text>
          </div>
          <Checkbox
            checked={menuCheckStrictly}
            onChange={event => form.setFieldValue('menuCheckStrictly', event.target.checked)}
          >
            父子联动
          </Checkbox>
        </Flex>
        <div className="grid grid-cols-[minmax(0,1fr)_220px] gap-14px lt-md:grid-cols-1">
          <Card
            className="border-border-secondary"
            size="small"
          >
            <Flex
              className="mb-10px"
              gap={8}
            >
              <Input
                allowClear
                placeholder="搜索菜单或按钮名称"
                prefix={
                  <SvgIcon
                    className="text-tertiary"
                    icon="ph:magnifying-glass"
                  />
                }
                value={permissionKeyword}
                onChange={event => setPermissionKeyword(event.target.value)}
              />
              <Button onClick={() => setExpandedKeys(collectRoleTreeKeys(menuTreeData))}>展开</Button>
              <Button onClick={handleSelectAll}>全选</Button>
            </Flex>
            <Spin spinning={menuTreeQuery.isLoading}>
              <div className="max-h-460px min-h-260px overflow-auto pr-4px">
                <AppTree
                  blockNode
                  checkable
                  checkStrictly={!menuCheckStrictly}
                  checkedKeys={menuTreeData.length ? checkedKeys : []}
                  expandedKeys={permissionKeyword ? collectRoleTreeKeys(visibleMenuTreeData) : expandedKeys}
                  treeData={visibleMenuTreeData}
                  onCheck={handleTreeCheck}
                  onExpand={keys => setExpandedKeys([...keys])}
                />
              </div>
            </Spin>
          </Card>
          <Card
            className="h-fit bg-layout"
            size="small"
            title="已选权限摘要"
          >
            <div className="grid gap-12px">
              <Flex justify="space-between">
                <span className="text-secondary">菜单</span>
                <strong>{selectionCount.menus} 项</strong>
              </Flex>
              <Flex justify="space-between">
                <span className="text-secondary">按钮</span>
                <strong>{selectionCount.buttons} 项</strong>
              </Flex>
              <Flex justify="space-between">
                <span className="text-secondary">父子联动</span>
                <strong>{menuCheckStrictly ? '已开启' : '已关闭'}</strong>
              </Flex>
            </div>
            <Alert
              className="mt-16px"
              showIcon
              title="角色与用户、菜单管理权限属于高影响授权，请保存前再次确认。"
              type="warning"
            />
          </Card>
        </div>
      </div>
    );
  }

  function renderReviewTab() {
    return (
      <div>
        <Typography.Title level={5}>保存前确认</Typography.Title>
        <Typography.Paragraph type="secondary">确认角色标识、授权范围和可能受影响的用户会话。</Typography.Paragraph>
        <div className="grid grid-cols-2 gap-12px lt-sm:grid-cols-1">
          <Card
            size="small"
            title="基本信息"
          >
            <div className="grid gap-10px text-13px">
              <Flex justify="space-between">
                <span className="text-secondary">角色名称</span>
                <strong>{roleName || '未填写'}</strong>
              </Flex>
              <Flex justify="space-between">
                <span className="text-secondary">权限字符</span>
                <Tag className="m-0 font-mono">{roleKey || '未填写'}</Tag>
              </Flex>
              <Flex justify="space-between">
                <span className="text-secondary">角色状态</span>
                <strong>{status === '0' ? '正常' : '停用'}</strong>
              </Flex>
            </div>
          </Card>
          <Card
            size="small"
            title="授权摘要"
          >
            <div className="grid gap-10px text-13px">
              <Flex justify="space-between">
                <span className="text-secondary">菜单</span>
                <strong>{selectionCount.menus} 项</strong>
              </Flex>
              <Flex justify="space-between">
                <span className="text-secondary">按钮</span>
                <strong>{selectionCount.buttons} 项</strong>
              </Flex>
              <Flex justify="space-between">
                <span className="text-secondary">数据范围</span>
                <strong>{dataScopeLabel(effectiveDataScope)}</strong>
              </Flex>
            </div>
          </Card>
        </div>
        <Alert
          className="mt-14px"
          description="保存后，后端会更新角色授权关系。已登录成员何时获得新权限，以后端会话策略为准。"
          showIcon
          type="info"
        />
      </div>
    );
  }

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex
          gap={8}
          justify="flex-end"
        >
          <Button
            disabled={loading}
            onClick={onClose}
          >
            取消
          </Button>
          {activeTab !== 'basic' ? (
            <Button
              disabled={loading}
              onClick={handlePrevious}
            >
              上一步
            </Button>
          ) : null}
          {activeTab !== 'review' ? (
            <Button
              type="primary"
              onClick={handleNext}
            >
              下一步
            </Button>
          ) : null}
          {activeTab === 'review' ? (
            <Button
              loading={loading}
              type="primary"
              onClick={() => form.submit()}
            >
              保存角色
            </Button>
          ) : null}
        </Flex>
      }
      mask={{
        closable: !loading
      }}
      open={open}
      title={
        <div>
          <div className="text-17px font-600">{isUpdate ? '编辑角色' : '新增角色'}</div>
          <div className="mt-3px text-12px text-tertiary">分区配置基础信息和功能权限，保存前确认影响。</div>
        </div>
      }
      size={760}
      onClose={onClose}
    >
      {detailQuery.isError || menuTreeQuery.isError ? (
        <Alert
          action={
            <Button
              size="small"
              onClick={() => Promise.all([detailQuery.refetch(), menuTreeQuery.refetch()])}
            >
              重试
            </Button>
          }
          className="mb-16px"
          showIcon
          title="角色信息加载失败"
          type="error"
        />
      ) : null}
      <Spin spinning={detailLoading}>
        <Form<RoleFormValues>
          form={form}
          layout="vertical"
          requiredMark
          onFinish={handleFinish}
        >
          <Tabs
            activeKey={activeTab}
            items={[
              { children: renderBasicTab(), key: 'basic', label: '1 基础信息' },
              { children: renderPermissionTab(), key: 'permission', label: '2 功能权限' },
              { children: renderReviewTab(), key: 'review', label: '3 变更摘要' }
            ]}
            onChange={key => setActiveTab(key as RoleEditorTab)}
          />
        </Form>
      </Spin>
    </Drawer>
  );
};

export default RoleEditorDrawer;
