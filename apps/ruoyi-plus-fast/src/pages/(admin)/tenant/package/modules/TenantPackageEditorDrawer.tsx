import { showConfirmModal } from '@skyroc/web-admin-theme';
import { AppTree } from '@skyroc/web-ui-antd';
import { SvgIcon } from '@skyroc/web-ui-compose';
import { Alert, Button, Card, Checkbox, Drawer, Flex, Form, Input, Radio, Spin, Typography } from 'antd';
import type { TreeProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { Key } from 'react';

import { useTenantPackageDetailQuery, useTenantPackageMenuTreeQuery } from '@/service/api/system-tenant-package';
import type {
  TenantPackageId,
  TenantPackageSavePayload,
  TenantPackageStatus,
  TenantPackageUpdatePayload
} from '@/service/api/system-tenant-package';

import {
  buildPackageMenuTreeData,
  collectMatchedExpandKeys,
  collectPackageMenuTreeKeys,
  collectSelectablePackageMenuKeys,
  countPackageMenuMatches,
  countPackageMenuSelection,
  toPackageMenuIds
} from './tenant-package-tree';
import { TENANT_PACKAGE_FIELD_LIMITS, resolvePackageMenuIdsError } from './tenant-package-utils';

export type TenantPackageEditorMode = 'create' | 'update';

export type TenantPackageEditorSubmitValues =
  | { mode: 'create'; payload: TenantPackageSavePayload }
  | { mode: 'update'; payload: TenantPackageUpdatePayload };

interface TenantPackageFormValues {
  /** 菜单树选择项是否父子联动。true 时树按联动勾选，提交要带上半选的父节点。 */
  menuCheckStrictly: boolean;
  packageName: string;
  remark?: string;
  status: TenantPackageStatus;
}

interface TenantPackageEditorDrawerProps {
  /** 保存请求是否进行中。 */
  loading: boolean;
  /** 新增或编辑模式。 */
  mode: TenantPackageEditorMode;
  /** 关闭抽屉。 */
  onClose: () => void;
  /** 提交表单；失败时抛出，由抽屉映射到具体字段。 */
  onSubmit: (values: TenantPackageEditorSubmitValues) => Promise<void>;
  /** 抽屉是否打开。 */
  open: boolean;
  /** 当前编辑的套餐主键，新增时为空。 */
  packageId?: TenantPackageId;
}

const CREATE_DEFAULTS: TenantPackageFormValues = {
  menuCheckStrictly: true,
  packageName: '',
  remark: '',
  status: '0'
};

const TenantPackageEditorDrawer = (props: TenantPackageEditorDrawerProps) => {
  const { loading, mode, onClose, onSubmit, open, packageId } = props;

  const [form] = Form.useForm<TenantPackageFormValues>();
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [keyword, setKeyword] = useState('');

  const isUpdate = mode === 'update';
  const detailQuery = useTenantPackageDetailQuery(packageId, open && isUpdate);
  // 新增时不传 packageId，封装里会退回 0，后端据此只给树不给勾选项
  const menuTreeQuery = useTenantPackageMenuTreeQuery(isUpdate ? packageId : undefined, open);
  const menuCheckStrictly = Form.useWatch('menuCheckStrictly', form) ?? true;

  const rawMenuNodes = menuTreeQuery.data?.menus ?? [];
  const menuTreeData = useMemo(() => buildPackageMenuTreeData(rawMenuNodes, keyword), [rawMenuNodes, keyword]);
  const matchCount = useMemo(() => countPackageMenuMatches(menuTreeData, keyword), [menuTreeData, keyword]);
  // 联动模式下半选的父目录也要提交：只给子菜单不给目录，租户那边菜单树渲染不出来
  const menuIds = useMemo(() => toPackageMenuIds([...checkedKeys, ...halfCheckedKeys]), [checkedKeys, halfCheckedKeys]);
  const menuIdsError = resolvePackageMenuIdsError(menuIds);
  const selectionCount = useMemo(
    () => countPackageMenuSelection(menuTreeData, [...checkedKeys, ...halfCheckedKeys]),
    [checkedKeys, halfCheckedKeys, menuTreeData]
  );

  useEffect(() => {
    if (!open) return;

    setKeyword('');
    setHalfCheckedKeys([]);

    if (!isUpdate) {
      form.resetFields();
      form.setFieldsValue(CREATE_DEFAULTS);
      setCheckedKeys([]);
    }
  }, [form, isUpdate, open]);

  useEffect(() => {
    if (!open || !isUpdate || !detailQuery.data) return;

    form.setFieldsValue({
      menuCheckStrictly: detailQuery.data.menuCheckStrictly,
      packageName: detailQuery.data.packageName ?? '',
      remark: detailQuery.data.remark ?? '',
      status: detailQuery.data.status
    });
  }, [detailQuery.data, form, isUpdate, open]);

  useEffect(() => {
    if (!open || !menuTreeQuery.data) return;

    setCheckedKeys(menuTreeQuery.data.checkedKeys.map(String));
    setHalfCheckedKeys([]);
    setExpandedKeys(collectPackageMenuTreeKeys(buildPackageMenuTreeData(menuTreeQuery.data.menus)));
  }, [menuTreeQuery.data, open]);

  // 搜索时把树展开到命中的位置；树本身不裁剪，否则受控勾选会丢
  useEffect(() => {
    if (!keyword.trim()) return;

    setExpandedKeys(previous => {
      const merged = new Set(previous.map(String));

      collectMatchedExpandKeys(menuTreeData, keyword).forEach(key => merged.add(String(key)));

      return [...merged];
    });
  }, [keyword, menuTreeData]);

  function handleTreeCheck(
    value: Parameters<NonNullable<TreeProps['onCheck']>>[0],
    info: Parameters<NonNullable<TreeProps['onCheck']>>[1]
  ) {
    if (Array.isArray(value)) {
      setCheckedKeys([...value]);
      setHalfCheckedKeys([...((info.halfCheckedKeys as Key[] | undefined) ?? [])]);
      return;
    }

    setCheckedKeys([...value.checked]);
    setHalfCheckedKeys([...(value.halfChecked ?? [])]);
  }

  function handleSelectAll() {
    setCheckedKeys(collectSelectablePackageMenuKeys(menuTreeData));
    setHalfCheckedKeys([]);
  }

  function handleClearAll() {
    setCheckedKeys([]);
    setHalfCheckedKeys([]);
  }

  async function handleFinish(values: TenantPackageFormValues) {
    if (menuIdsError) return;

    const payload: TenantPackageSavePayload = {
      menuCheckStrictly: values.menuCheckStrictly,
      menuIds,
      packageName: values.packageName.trim(),
      remark: values.remark?.trim() || null,
      status: values.status
    };

    try {
      await onSubmit(
        isUpdate
          ? { mode: 'update', payload: { ...payload, packageId: Number(packageId) } }
          : { mode: 'create', payload }
      );
    } catch (error) {
      const httpStatus = (error as { response?: { status?: number } })?.response?.status;

      // 套餐名是全平台唯一的软约束，冲突时聚焦到字段上，菜单勾选保留
      if (httpStatus === 409) {
        form.setFields([{ errors: ['该套餐名称已存在'], name: 'packageName' }]);
      }
      // 其余错误由请求层统一提示，草稿留在抽屉里等用户改
    }
  }

  function handleClose() {
    if (loading) return;

    if (!form.isFieldsTouched()) {
      onClose();
      return;
    }

    showConfirmModal({
      closable: true,
      content: '关闭后当前填写的内容和菜单勾选都不会保留。',
      okText: '放弃填写',
      title: '放弃未保存的修改？',
      onOk: onClose
    });
  }

  return (
    <Drawer
      destroyOnHidden
      open={open}
      title={isUpdate ? '编辑租户套餐' : '新增租户套餐'}
      width={760}
      footer={
        <Flex
          gap={8}
          justify="flex-end"
        >
          <Button
            disabled={loading}
            onClick={handleClose}
          >
            取消
          </Button>
          <Button
            disabled={Boolean(menuIdsError)}
            loading={loading}
            type="primary"
            onClick={() => form.submit()}
          >
            {isUpdate ? '保存修改' : '新增套餐'}
          </Button>
        </Flex>
      }
      mask={{ closable: !loading }}
      onClose={handleClose}
    >
      {detailQuery.isError || menuTreeQuery.isError ? (
        <Alert
          className="mb-16px"
          showIcon
          title="套餐信息加载失败"
          type="error"
          action={
            <Button
              size="small"
              onClick={() => Promise.all([detailQuery.refetch(), menuTreeQuery.refetch()])}
            >
              重试
            </Button>
          }
        />
      ) : null}

      <Spin spinning={isUpdate && detailQuery.isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <div className="flex flex-col gap-16px">
            <Card
              size="small"
              title="基本信息"
            >
              <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
                <Form.Item
                  label="套餐名称"
                  name="packageName"
                  rules={[
                    { message: '请输入套餐名称', required: true },
                    {
                      max: TENANT_PACKAGE_FIELD_LIMITS.packageName,
                      message: `最多 ${TENANT_PACKAGE_FIELD_LIMITS.packageName} 个字符`
                    }
                  ]}
                >
                  <Input
                    allowClear
                    maxLength={TENANT_PACKAGE_FIELD_LIMITS.packageName}
                    placeholder="全平台唯一，如 标准版"
                  />
                </Form.Item>

                <Form.Item
                  extra="停用后新增租户时选不到它，已经挂在它上面的租户不受影响。"
                  label="状态"
                  name="status"
                  rules={[{ message: '请选择状态', required: true }]}
                >
                  <Radio.Group
                    optionType="button"
                    options={[
                      { label: '正常', value: '0' },
                      { label: '停用', value: '1' }
                    ]}
                  />
                </Form.Item>
              </div>

              <Form.Item
                className="mb-0"
                label="备注"
                name="remark"
                rules={[
                  {
                    max: TENANT_PACKAGE_FIELD_LIMITS.remark,
                    message: `最多 ${TENANT_PACKAGE_FIELD_LIMITS.remark} 个字符`
                  }
                ]}
              >
                <Input.TextArea
                  maxLength={TENANT_PACKAGE_FIELD_LIMITS.remark}
                  placeholder="说明这个套餐面向什么客户、包含哪些能力"
                  rows={2}
                  showCount
                />
              </Form.Item>
            </Card>

            <Card
              size="small"
              title="可用菜单"
              extra={
                <Form.Item
                  className="mb-0"
                  name="menuCheckStrictly"
                  valuePropName="checked"
                >
                  <Checkbox>父子联动</Checkbox>
                </Form.Item>
              }
            >
              <Flex
                className="mb-10px"
                gap={8}
                wrap="wrap"
              >
                <Input
                  allowClear
                  className="min-w-200px flex-1"
                  placeholder="搜索菜单或按钮名称"
                  prefix={
                    <SvgIcon
                      className="text-tertiary"
                      icon="ph:magnifying-glass"
                    />
                  }
                  value={keyword}
                  onChange={event => setKeyword(event.target.value)}
                />
                <Button onClick={() => setExpandedKeys(collectPackageMenuTreeKeys(menuTreeData))}>展开</Button>
                <Button onClick={() => setExpandedKeys([])}>折叠</Button>
                <Button onClick={handleSelectAll}>全选</Button>
                <Button onClick={handleClearAll}>清空</Button>
              </Flex>

              {keyword.trim() ? (
                <Typography.Text
                  className="mb-8px block text-12px"
                  type="secondary"
                >
                  命中 {matchCount} 项。搜索只展开定位，不会改变已经勾选的菜单。
                </Typography.Text>
              ) : null}

              {menuIdsError ? (
                <Alert
                  className="mb-12px"
                  description={menuIdsError}
                  showIcon
                  title="所选菜单超出上限"
                  type="error"
                />
              ) : null}

              <Spin spinning={menuTreeQuery.isLoading}>
                <div className="max-h-420px min-h-240px overflow-auto pr-4px">
                  <AppTree
                    blockNode
                    checkable
                    checkedKeys={menuTreeData.length ? checkedKeys : []}
                    // menuCheckStrictly 是 RuoYi 口径的"父子联动开着"，和 antd 的 checkStrictly 正好相反
                    checkStrictly={!menuCheckStrictly}
                    expandedKeys={expandedKeys}
                    treeData={menuTreeData}
                    onCheck={handleTreeCheck}
                    onExpand={keys => setExpandedKeys([...keys])}
                  />
                </div>
              </Spin>

              <Flex
                className="mt-12px"
                gap={16}
                wrap="wrap"
              >
                <Typography.Text type="secondary">
                  菜单 <strong>{selectionCount.menus}</strong> 项
                </Typography.Text>
                <Typography.Text type="secondary">
                  按钮 <strong>{selectionCount.buttons}</strong> 项
                </Typography.Text>
                <Typography.Text type="secondary">
                  实际提交 <strong>{menuIds.length}</strong> 个菜单 ID
                </Typography.Text>
              </Flex>
            </Card>

            <Alert
              showIcon
              type="warning"
              title="保存不会同步存量租户"
              description="套餐改完之后，已经挂在它上面的租户权限不变。要让改动生效，需要到租户管理页对每一家租户执行一次“同步套餐”。树里不含“租户管理”分支，套餐无法把平台控制面授权出去。"
            />
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default TenantPackageEditorDrawer;
