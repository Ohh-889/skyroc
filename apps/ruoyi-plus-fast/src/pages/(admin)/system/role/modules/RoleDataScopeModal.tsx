import { AppTree } from '@skyroc/web-ui-antd';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { Alert, Checkbox, Flex, Input, Modal, Radio, Spin, Typography } from 'antd';
import type { TreeProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { Key } from 'react';

import { useRoleDeptTreeQuery } from '@/service/api/system-role';
import type { RoleDataScope, RoleDataScopePayload, RoleItem } from '@/service/api/system-role';

import { buildRoleTreeData, collectRoleTreeKeys, filterRoleTreeData, normalizeRoleTreeKeys } from './role-tree';

interface RoleDataScopeModalProps {
  /** 保存数据范围请求是否正在执行。 */
  loading: boolean;

  /** 关闭数据范围弹窗。 */
  onClose: () => void;

  /** 提交角色的数据范围配置。 */
  onSubmit: (values: RoleDataScopePayload) => Promise<void>;

  /** 数据范围弹窗是否打开。 */
  open: boolean;

  /** 当前配置数据范围的角色。 */
  role?: RoleItem;
}

const DATA_SCOPE_OPTIONS = [
  { description: '可访问当前租户内全部受约束数据', label: '全部数据权限', value: '1' },
  { description: '仅访问选中的部门范围', label: '自定义数据权限', value: '2' },
  { description: '仅当前用户所属部门', label: '本部门数据权限', value: '3' },
  { description: '当前部门和全部下级部门', label: '本部门及以下', value: '4' },
  { description: '仅与当前用户本人相关的数据', label: '仅本人数据权限', value: '5' },
  { description: '部门范围与本人数据的并集', label: '部门及以下或本人', value: '6' }
] satisfies Array<{ description: string; label: string; value: RoleDataScope }>;

const RoleDataScopeModal = (props: RoleDataScopeModalProps) => {
  const { loading, onClose, onSubmit, open, role } = props;

  const [dataScope, setDataScope] = useState<RoleDataScope>('5');
  const [deptCheckStrictly, setDeptCheckStrictly] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<Key[]>([]);
  const [keyword, setKeyword] = useState('');
  const deptTreeQuery = useRoleDeptTreeQuery(role?.roleId, open);
  const deptTreeData = useMemo(() => buildRoleTreeData(deptTreeQuery.data?.depts ?? []), [deptTreeQuery.data?.depts]);
  const visibleTreeData = useMemo(() => filterRoleTreeData(deptTreeData, keyword), [deptTreeData, keyword]);

  useEffect(() => {
    if (!open || !role) return;
    setDataScope(role.dataScope);
    setDeptCheckStrictly(role.deptCheckStrictly);
    setKeyword('');
    setHalfCheckedKeys([]);
  }, [open, role]);

  useEffect(() => {
    if (!open || !deptTreeQuery.data) return;
    setCheckedKeys(deptTreeQuery.data.checkedKeys.map(String));
  }, [deptTreeQuery.data, open]);

  function handleTreeCheck(value: Parameters<NonNullable<TreeProps['onCheck']>>[0]) {
    if (Array.isArray(value)) {
      setCheckedKeys([...value]);
      setHalfCheckedKeys([]);
      return;
    }
    setCheckedKeys([...value.checked]);
    setHalfCheckedKeys([...(value.halfChecked ?? [])]);
  }

  async function handleSubmit() {
    if (!role) return;
    await onSubmit({
      dataScope,
      deptCheckStrictly,
      deptIds: dataScope === '2' ? normalizeRoleTreeKeys([...checkedKeys, ...halfCheckedKeys]) : [],
      roleId: role.roleId
    });
  }

  return (
    <Modal
      destroyOnHidden
      classNames={{ body: 'px-22px pb-2' }}
      mask={{ closable: !loading }}
      okButtonProps={{ loading }}
      okText="保存数据范围"
      open={open}
      title={
        <div>
          <div className="text-17px font-600">配置数据范围</div>
          <div className="mt-3px text-12px text-tertiary">{role ? `${role.roleName} · ${role.roleKey}` : ''}</div>
        </div>
      }
      width={760}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Alert
        className="mb-16px"
        description="扩大数据范围会影响该角色的全部成员，保存后由后端统一处理权限生效。"
        showIcon
        type="warning"
      />
      <Radio.Group className="w-full" value={dataScope} onChange={event => setDataScope(event.target.value)}>
        <div className="grid grid-cols-2 gap-8px lt-sm:grid-cols-1">
          {DATA_SCOPE_OPTIONS.map(option => (
            <label
              className={`cursor-pointer rounded-8px border p-12px transition-colors ${dataScope === option.value ? 'border-primary bg-primary-50' : 'border-border-secondary'}`}
              key={option.value}
            >
              <Flex align="flex-start" gap={8}>
                <Radio value={option.value} />
                <div>
                  <Typography.Text className="block" strong>
                    {option.label}
                  </Typography.Text>
                  <Typography.Text className="text-12px" type="secondary">
                    {option.description}
                  </Typography.Text>
                </div>
              </Flex>
            </label>
          ))}
        </div>
      </Radio.Group>

      {dataScope === '2' ? (
        <div className="mt-16px rounded-8px border border-border-secondary p-12px">
          <Flex align="center" className="mb-10px" gap={8} justify="space-between" wrap>
            <Input
              allowClear
              className="max-w-320px"
              placeholder="搜索部门"
              prefix={<SvgIcon className="text-tertiary" icon="ph:magnifying-glass" />}
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
            />
            <Checkbox checked={deptCheckStrictly} onChange={event => setDeptCheckStrictly(event.target.checked)}>
              父子联动
            </Checkbox>
          </Flex>
          <Spin spinning={deptTreeQuery.isLoading}>
            <div className="max-h-280px min-h-180px overflow-auto">
              <AppTree
                blockNode
                checkable
                checkStrictly={!deptCheckStrictly}
                checkedKeys={checkedKeys}
                expandedKeys={keyword ? collectRoleTreeKeys(visibleTreeData) : undefined}
                treeData={visibleTreeData}
                onCheck={handleTreeCheck}
              />
            </div>
          </Spin>
        </div>
      ) : null}
    </Modal>
  );
};

export default RoleDataScopeModal;
