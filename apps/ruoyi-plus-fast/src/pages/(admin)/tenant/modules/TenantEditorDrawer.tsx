import { showConfirmModal } from '@skyroc/web-admin-theme';
import { Alert, Button, Card, DatePicker, Drawer, Flex, Form, Input, InputNumber, Radio, Select, Spin } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect } from 'react';

import { useTenantDetailQuery } from '@/service/api/system-tenant';
import type {
  TenantId,
  TenantProfilePayload,
  TenantSavePayload,
  TenantStatus,
  TenantUpdatePayload
} from '@/service/api/system-tenant';
import type { TenantPackageOption } from '@/service/api/system-tenant-package';

import {
  TENANT_FIELD_LIMITS,
  TENANT_STATUS_OPTIONS,
  UNLIMITED_ACCOUNTS,
  resolveTenantPackageName
} from './tenant-utils';

export type TenantEditorMode = 'create' | 'update';

/** 抽屉按模式产出两种完全不同的请求体，判别联合让消费侧不用再猜哪个字段有值。 */
export type TenantEditorSubmitValues =
  | { mode: 'create'; payload: TenantSavePayload }
  | { mode: 'update'; payload: TenantUpdatePayload };

interface TenantFormValues {
  accountCount: number;
  address?: string;
  companyName: string;
  contactPhone: string;
  contactUserName: string;
  domain?: string;
  expireTime?: Dayjs | null;
  intro?: string;
  licenseNumber?: string;
  /** 只在新增时提交；编辑时是只读回显。 */
  packageId?: number;
  /** 只在新增时存在，用于开通管理员账号。 */
  password?: string;
  remark?: string;
  status: TenantStatus;
  /** 只在新增时存在，用于开通管理员账号。 */
  username?: string;
}

interface TenantEditorDrawerProps {
  /** 保存请求是否进行中。 */
  loading: boolean;
  /** 新增或编辑模式。 */
  mode: TenantEditorMode;
  /** 关闭抽屉。 */
  onClose: () => void;
  /** 提交表单；失败时抛出，由抽屉映射到具体字段。 */
  onSubmit: (values: TenantEditorSubmitValues) => Promise<void>;
  /** 抽屉是否打开。 */
  open: boolean;
  /** 套餐下拉选项，只包含状态正常的套餐。 */
  packageOptions: TenantPackageOption[];
  /** 套餐下拉是否加载失败。它挂在套餐权限点上，可能单独失败。 */
  packageOptionsError: boolean;
  /** 套餐下拉是否仍在加载。 */
  packageOptionsLoading: boolean;
  /** 当前编辑的租户主键，新增时为空。 */
  tenantId?: TenantId;
}

const CREATE_DEFAULTS: TenantFormValues = {
  accountCount: UNLIMITED_ACCOUNTS,
  address: '',
  companyName: '',
  contactPhone: '',
  contactUserName: '',
  domain: '',
  expireTime: null,
  intro: '',
  licenseNumber: '',
  packageId: undefined,
  password: '',
  remark: '',
  status: '0',
  username: ''
};

function toProfilePayload(values: TenantFormValues): TenantProfilePayload {
  return {
    accountCount: values.accountCount,
    address: values.address?.trim() || null,
    companyName: values.companyName.trim(),
    contactPhone: values.contactPhone.trim(),
    contactUserName: values.contactUserName.trim(),
    domain: values.domain?.trim() || null,
    // 留空表示永不过期，所以这里送 null 而不是省略字段
    expireTime: values.expireTime ? values.expireTime.format('YYYY-MM-DD HH:mm:ss') : null,
    intro: values.intro?.trim() || null,
    licenseNumber: values.licenseNumber?.trim() || null,
    remark: values.remark?.trim() || null,
    status: values.status
  };
}

const TenantEditorDrawer = (props: TenantEditorDrawerProps) => {
  const {
    loading,
    mode,
    onClose,
    onSubmit,
    open,
    packageOptions,
    packageOptionsError,
    packageOptionsLoading,
    tenantId
  } = props;

  const [form] = Form.useForm<TenantFormValues>();
  const isUpdate = mode === 'update';
  const detailQuery = useTenantDetailQuery(tenantId, open && isUpdate);
  const status = Form.useWatch('status', form);
  const detail = detailQuery.data;

  useEffect(() => {
    if (!open) return;

    if (!isUpdate) {
      form.resetFields();
      form.setFieldsValue(CREATE_DEFAULTS);
      return;
    }

    if (!detail) return;

    form.setFieldsValue({
      accountCount: detail.accountCount,
      address: detail.address ?? '',
      companyName: detail.companyName ?? '',
      contactPhone: detail.contactPhone ?? '',
      contactUserName: detail.contactUserName ?? '',
      domain: detail.domain ?? '',
      expireTime: detail.expireTime ? dayjs(detail.expireTime) : null,
      intro: detail.intro ?? '',
      licenseNumber: detail.licenseNumber ?? '',
      remark: detail.remark ?? '',
      status: detail.status
    });
  }, [detail, form, isUpdate, open]);

  function toSubmitValues(values: TenantFormValues): TenantEditorSubmitValues {
    const profile = toProfilePayload(values);

    if (isUpdate) {
      // 不带 tenantId 和 packageId：编号一辈子不变，换套餐要走 syncTenantPackage
      return { mode: 'update', payload: { ...profile, id: Number(tenantId) } };
    }

    return {
      mode: 'create',
      payload: {
        ...profile,
        packageId: Number(values.packageId),
        // 密码不 trim：首尾空格是用户输入的一部分，改了他就登不进去
        password: values.password ?? '',
        username: values.username?.trim() ?? ''
      }
    };
  }

  async function handleFinish(values: TenantFormValues) {
    try {
      await onSubmit(toSubmitValues(values));
    } catch (error) {
      const httpStatus = (error as { response?: { status?: number } })?.response?.status;

      // 企业名称是全平台唯一的软约束，冲突时聚焦到字段上，输入的其它内容保留
      if (httpStatus === 409) {
        form.setFields([{ errors: ['该企业名称已被其它租户占用'], name: 'companyName' }]);
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
      content: '关闭后当前填写的内容不会保留。',
      okText: '放弃填写',
      title: '放弃未保存的修改？',
      onOk: onClose
    });
  }

  return (
    <Drawer
      destroyOnHidden
      open={open}
      title={isUpdate ? '编辑租户资料' : '新增租户'}
      width={640}
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
            loading={loading}
            type="primary"
            onClick={() => form.submit()}
          >
            {isUpdate ? '保存修改' : '开通租户'}
          </Button>
        </Flex>
      }
      mask={{ closable: !loading }}
      onClose={handleClose}
    >
      {detailQuery.isError ? (
        <Alert
          className="mb-16px"
          showIcon
          title="租户详情加载失败"
          type="error"
          action={
            <Button
              size="small"
              onClick={() => detailQuery.refetch()}
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
              title="企业资料"
            >
              <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
                <Form.Item
                  label="企业名称"
                  name="companyName"
                  rules={[
                    { message: '请输入企业名称', required: true },
                    { max: TENANT_FIELD_LIMITS.companyName, message: `最多 ${TENANT_FIELD_LIMITS.companyName} 个字符` }
                  ]}
                >
                  <Input
                    allowClear
                    maxLength={TENANT_FIELD_LIMITS.companyName}
                    placeholder="全平台唯一"
                  />
                </Form.Item>

                <Form.Item
                  label="社会信用代码"
                  name="licenseNumber"
                  rules={[
                    {
                      max: TENANT_FIELD_LIMITS.licenseNumber,
                      message: `最多 ${TENANT_FIELD_LIMITS.licenseNumber} 个字符`
                    }
                  ]}
                >
                  <Input
                    allowClear
                    maxLength={TENANT_FIELD_LIMITS.licenseNumber}
                    placeholder="选填"
                  />
                </Form.Item>

                <Form.Item
                  label="联系人"
                  name="contactUserName"
                  rules={[
                    { message: '请输入联系人', required: true },
                    {
                      max: TENANT_FIELD_LIMITS.contactUserName,
                      message: `最多 ${TENANT_FIELD_LIMITS.contactUserName} 个字符`
                    }
                  ]}
                >
                  <Input
                    allowClear
                    maxLength={TENANT_FIELD_LIMITS.contactUserName}
                    placeholder="请输入联系人"
                  />
                </Form.Item>

                <Form.Item
                  label="联系电话"
                  name="contactPhone"
                  rules={[
                    { message: '请输入联系电话', required: true },
                    {
                      max: TENANT_FIELD_LIMITS.contactPhone,
                      message: `最多 ${TENANT_FIELD_LIMITS.contactPhone} 个字符`
                    }
                  ]}
                >
                  <Input
                    allowClear
                    maxLength={TENANT_FIELD_LIMITS.contactPhone}
                    placeholder="请输入联系电话"
                  />
                </Form.Item>
              </div>

              <Form.Item
                extra="登录页可能按访问域名筛选可选租户。"
                label="绑定域名"
                name="domain"
                rules={[{ max: TENANT_FIELD_LIMITS.domain, message: `最多 ${TENANT_FIELD_LIMITS.domain} 个字符` }]}
              >
                <Input
                  allowClear
                  maxLength={TENANT_FIELD_LIMITS.domain}
                  placeholder="如 console.example.com"
                />
              </Form.Item>

              <Form.Item
                className="mb-0"
                label="企业地址"
                name="address"
                rules={[{ max: TENANT_FIELD_LIMITS.address, message: `最多 ${TENANT_FIELD_LIMITS.address} 个字符` }]}
              >
                <Input
                  allowClear
                  maxLength={TENANT_FIELD_LIMITS.address}
                  placeholder="选填"
                />
              </Form.Item>
            </Card>

            {isUpdate ? null : (
              <Card
                size="small"
                title="管理员账号"
              >
                <Alert
                  className="mb-16px"
                  showIcon
                  type="info"
                  description="账号密码只用于开通这家租户的管理员用户，不写入租户资料，之后要改密码去用户管理。整个新增请求会加密后发送。"
                  title="只在开通时使用一次"
                />

                <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
                  <Form.Item
                    className="mb-0"
                    label="管理员账号"
                    name="username"
                    rules={[
                      { message: '请输入管理员账号', required: true },
                      {
                        max: TENANT_FIELD_LIMITS.usernameMax,
                        message: `需要 ${TENANT_FIELD_LIMITS.usernameMin}-${TENANT_FIELD_LIMITS.usernameMax} 个字符`,
                        min: TENANT_FIELD_LIMITS.usernameMin
                      }
                    ]}
                  >
                    <Input
                      allowClear
                      autoComplete="off"
                      maxLength={TENANT_FIELD_LIMITS.usernameMax}
                      placeholder={`${TENANT_FIELD_LIMITS.usernameMin}-${TENANT_FIELD_LIMITS.usernameMax} 个字符`}
                    />
                  </Form.Item>

                  <Form.Item
                    className="mb-0"
                    label="管理员密码"
                    name="password"
                    rules={[
                      { message: '请输入管理员密码', required: true },
                      {
                        max: TENANT_FIELD_LIMITS.passwordMax,
                        message: `需要 ${TENANT_FIELD_LIMITS.passwordMin}-${TENANT_FIELD_LIMITS.passwordMax} 个字符`,
                        min: TENANT_FIELD_LIMITS.passwordMin
                      }
                    ]}
                  >
                    <Input.Password
                      autoComplete="new-password"
                      maxLength={TENANT_FIELD_LIMITS.passwordMax}
                      placeholder={`${TENANT_FIELD_LIMITS.passwordMin}-${TENANT_FIELD_LIMITS.passwordMax} 个字符`}
                    />
                  </Form.Item>
                </div>
              </Card>
            )}

            <Card
              size="small"
              title="套餐与生命周期"
            >
              {isUpdate || !packageOptionsError ? null : (
                <Alert
                  className="mb-16px"
                  showIcon
                  type="error"
                  description="套餐下拉来自租户套餐接口，它需要单独的套餐查看权限。取不到选项就没法开通租户，请确认当前账号的套餐权限后重新打开抽屉。"
                  title="套餐列表加载失败"
                />
              )}

              <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
                {isUpdate ? (
                  <Form.Item
                    extra="套餐创建后不可更换；套餐内容变了要用行操作里的“同步套餐”重算授权。"
                    label="租户套餐"
                  >
                    <Input
                      disabled
                      value={resolveTenantPackageName(packageOptions, detail?.packageId) || '—'}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    extra="只能选择状态正常的套餐；创建后普通编辑不能更换。"
                    label="租户套餐"
                    name="packageId"
                    rules={[{ message: '请选择租户套餐', required: true }]}
                  >
                    <Select
                      loading={packageOptionsLoading}
                      placeholder="请选择套餐"
                      options={packageOptions.map(option => ({
                        label: option.packageName || `套餐 #${option.packageId}`,
                        value: Number(option.packageId)
                      }))}
                    />
                  </Form.Item>
                )}

                <Form.Item
                  extra="-1 表示不限制。"
                  label="用户上限"
                  name="accountCount"
                  rules={[{ message: '请输入用户上限', required: true, type: 'number' }]}
                >
                  <InputNumber
                    className="w-full"
                    min={UNLIMITED_ACCOUNTS}
                    placeholder="-1 表示不限制"
                    precision={0}
                  />
                </Form.Item>

                <Form.Item
                  extra="留空表示永不过期。"
                  label="到期时间"
                  name="expireTime"
                >
                  <DatePicker
                    className="w-full"
                    placeholder="留空表示永不过期"
                    showTime={{ format: 'HH:mm' }}
                  />
                </Form.Item>

                <Form.Item
                  label="状态"
                  name="status"
                  rules={[{ message: '请选择状态', required: true }]}
                >
                  <Radio.Group
                    optionType="button"
                    options={[...TENANT_STATUS_OPTIONS]}
                  />
                </Form.Item>
              </div>

              {status === '1' ? (
                <Alert
                  className="mb-16px"
                  showIcon
                  type="warning"
                  description="保存后该租户的用户不能再发起新的登录；已经建立的会话不会立即退出，最长可能持续到刷新令牌失效。"
                  title="停用只挡新登录"
                />
              ) : null}

              <Form.Item
                label="企业简介"
                name="intro"
                rules={[{ max: TENANT_FIELD_LIMITS.intro, message: `最多 ${TENANT_FIELD_LIMITS.intro} 个字符` }]}
              >
                <Input.TextArea
                  maxLength={TENANT_FIELD_LIMITS.intro}
                  placeholder="选填"
                  rows={2}
                  showCount
                />
              </Form.Item>

              <Form.Item
                className="mb-0"
                label="备注"
                name="remark"
                rules={[{ max: TENANT_FIELD_LIMITS.remark, message: `最多 ${TENANT_FIELD_LIMITS.remark} 个字符` }]}
              >
                <Input.TextArea
                  maxLength={TENANT_FIELD_LIMITS.remark}
                  placeholder="记录合同、续费或对接人等信息"
                  rows={2}
                  showCount
                />
              </Form.Item>
            </Card>
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default TenantEditorDrawer;
