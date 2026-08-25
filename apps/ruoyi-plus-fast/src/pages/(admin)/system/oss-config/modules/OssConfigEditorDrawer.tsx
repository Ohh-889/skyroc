import { showConfirmModal } from '@shell/theme';
import { Alert, Button, Card, Checkbox, Drawer, Flex, Form, Input, Radio, Spin, Typography } from 'antd';
import { useEffect } from 'react';

import { useOssConfigDetailQuery } from '@/service/api/system-oss-config';
import type { OssConfigId, OssConfigSavePayload, OssConfigStatus } from '@/service/api/system-oss-config';

import { ACCESS_POLICY_OPTIONS, CONFIG_KEY_PATTERN, hasProtocolPrefix } from './oss-config-utils';

export type OssConfigEditorMode = 'create' | 'update';

interface OssConfigFormValues extends Omit<OssConfigSavePayload, 'status'> {
  /** 表单里用勾选表达“保存后设为默认”，提交时才翻译成 status。 */
  isDefault?: boolean;
}

interface OssConfigEditorDrawerProps {
  /** 当前编辑的配置主键，新增时为空。 */
  configId?: OssConfigId;
  /** 保存请求是否进行中。 */
  loading: boolean;
  /** 新增或编辑模式。 */
  mode: OssConfigEditorMode;
  /** 关闭抽屉。 */
  onClose: () => void;
  /** 提交配置；失败时抛出，由抽屉映射到具体字段。 */
  onSubmit: (values: OssConfigSavePayload) => Promise<void>;
  /** 抽屉是否打开。 */
  open: boolean;
}

const CREATE_DEFAULTS: OssConfigFormValues = {
  accessKey: '',
  accessPolicy: '0',
  bucketName: '',
  configKey: '',
  domain: '',
  endpoint: '',
  isDefault: false,
  isHttps: 'N',
  prefix: '',
  region: '',
  remark: '',
  secretKey: ''
};

const OssConfigEditorDrawer = (props: OssConfigEditorDrawerProps) => {
  const { configId, loading, mode, onClose, onSubmit, open } = props;

  const [form] = Form.useForm<OssConfigFormValues>();
  const isUpdate = mode === 'update';
  const detailQuery = useOssConfigDetailQuery(configId, open && isUpdate);
  const isHttps = Form.useWatch('isHttps', form);

  useEffect(() => {
    if (!open) return;

    if (!isUpdate) {
      form.resetFields();
      form.setFieldsValue(CREATE_DEFAULTS);
      return;
    }

    const detail = detailQuery.data;

    if (!detail) return;

    form.setFieldsValue({
      accessKey: detail.accessKey ?? '',
      accessPolicy: detail.accessPolicy,
      bucketName: detail.bucketName ?? '',
      configKey: detail.configKey ?? '',
      domain: detail.domain ?? '',
      endpoint: detail.endpoint ?? '',
      isDefault: detail.status === '0',
      isHttps: detail.isHttps === 'Y' ? 'Y' : 'N',
      prefix: detail.prefix ?? '',
      region: detail.region ?? '',
      remark: detail.remark ?? '',
      // SecretKey 读不回来，编辑时必须重新输入，这里保持空白
      secretKey: ''
    });
  }, [detailQuery.data, form, isUpdate, open]);

  function toPayload(values: OssConfigFormValues): OssConfigSavePayload {
    const { isDefault, ...rest } = values;
    const status: OssConfigStatus = isDefault ? '0' : '1';

    return {
      ...rest,
      accessKey: rest.accessKey.trim(),
      bucketName: rest.bucketName.trim(),
      configKey: rest.configKey.trim(),
      domain: rest.domain?.trim() || '',
      endpoint: rest.endpoint.trim(),
      prefix: rest.prefix?.trim() || '',
      region: rest.region?.trim() || '',
      remark: rest.remark?.trim() || '',
      secretKey: rest.secretKey.trim(),
      status
    };
  }

  async function submitPayload(payload: OssConfigSavePayload) {
    try {
      await onSubmit(payload);
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;

      if (status === 409) {
        form.setFields([{ errors: ['配置名称已存在'], name: 'configKey' }]);
        return;
      }

      if (status === 422) {
        form.setFields([{ errors: ['访问站点格式不正确，请检查是否带了协议头'], name: 'endpoint' }]);
      }
    }
  }

  async function handleFinish(values: OssConfigFormValues) {
    const payload = toPayload(values);

    if (payload.status !== '0') {
      await submitPayload(payload);
      return;
    }

    showConfirmModal({
      closable: true,
      content: '保存后，之后上传的新文件将写入该配置对应的桶。原默认配置会自动变为备用，历史文件不会迁移。',
      okText: '保存并设为默认',
      title: `将“${payload.configKey}”设为默认存储？`,
      onOk: () => submitPayload(payload)
    });
  }

  function handleClose() {
    if (loading) return;

    onClose();
  }

  return (
    <Drawer
      destroyOnHidden
      open={open}
      title={isUpdate ? '编辑存储配置' : '新增存储配置'}
      width={720}
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
            保存配置
          </Button>
        </Flex>
      }
      mask={{ closable: !loading }}
      onClose={handleClose}
    >
      {detailQuery.isError ? (
        <Alert
          action={<Button onClick={() => detailQuery.refetch()}>重试</Button>}
          className="mb-16px"
          showIcon
          title="配置详情加载失败"
          type="error"
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
              title="标识与连接"
            >
              <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
                <Form.Item
                  extra="字母开头，可用字母、数字、下划线和连字符；文件记录里保存的就是它。"
                  label="配置名称"
                  name="configKey"
                  rules={[
                    { message: '请输入配置名称', required: true },
                    { max: 20, message: '配置名称需要 2-20 个字符', min: 2 },
                    { message: '只能字母开头，且仅含字母、数字、下划线和连字符', pattern: CONFIG_KEY_PATTERN }
                  ]}
                >
                  <Input
                    allowClear
                    maxLength={20}
                    placeholder="例如 minio"
                  />
                </Form.Item>

                <Form.Item
                  label="访问协议"
                  name="isHttps"
                  rules={[{ message: '请选择访问协议', required: true }]}
                >
                  <Radio.Group
                    optionType="button"
                    options={[
                      { label: 'HTTP', value: 'N' },
                      { label: 'HTTPS', value: 'Y' }
                    ]}
                  />
                </Form.Item>
              </div>

              <Form.Item
                extra="只填主机和端口，协议由上面的选项决定。"
                label="访问站点"
                name="endpoint"
                rules={[
                  { message: '请输入访问站点', required: true },
                  { max: 255, message: '访问站点需要 2-255 个字符', min: 2 },
                  {
                    validator: (_rule, value: string) =>
                      value && hasProtocolPrefix(value)
                        ? Promise.reject(new Error('访问站点不能包含 http:// 或 https://'))
                        : Promise.resolve()
                  }
                ]}
              >
                <Input
                  addonBefore={isHttps === 'Y' ? 'https://' : 'http://'}
                  allowClear
                  maxLength={255}
                  placeholder="例如 oss.example.com:9000"
                />
              </Form.Item>

              <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
                <Form.Item
                  extra="留空时使用访问站点。是否需要带协议以后端连接实现为准。"
                  label="自定义域名"
                  name="domain"
                  rules={[{ max: 255, message: '自定义域名最多 255 个字符' }]}
                >
                  <Input
                    allowClear
                    maxLength={255}
                    placeholder="选填"
                  />
                </Form.Item>

                <Form.Item
                  label="区域"
                  name="region"
                  rules={[{ max: 255, message: '区域最多 255 个字符' }]}
                >
                  <Input
                    allowClear
                    maxLength={255}
                    placeholder="例如 cn-east-1"
                  />
                </Form.Item>
              </div>
            </Card>

            <Card
              size="small"
              title="访问凭证"
            >
              <Alert
                className="mb-16px"
                showIcon
                type="warning"
                description="SecretKey 保存后不会再次显示。修改任何字段都要重新输入当前或新的 SecretKey，留空会被当成清空。"
                title="凭证只进不出"
              />

              <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
                <Form.Item
                  label="AccessKey"
                  name="accessKey"
                  rules={[
                    { message: '请输入 AccessKey', required: true },
                    { max: 255, message: 'AccessKey 长度需要在 2-255 个字符之间', min: 2 }
                  ]}
                >
                  <Input.Password
                    autoComplete="off"
                    maxLength={255}
                    placeholder="请输入 AccessKey"
                  />
                </Form.Item>

                <Form.Item
                  extra={isUpdate ? '编辑时必须重新输入' : undefined}
                  label="SecretKey"
                  name="secretKey"
                  rules={[
                    { message: '请输入 SecretKey', required: true },
                    { max: 255, message: 'SecretKey 长度需要在 2-255 个字符之间', min: 2 }
                  ]}
                >
                  <Input.Password
                    autoComplete="new-password"
                    maxLength={255}
                    placeholder="请输入 SecretKey"
                  />
                </Form.Item>
              </div>
            </Card>

            <Card
              size="small"
              title="桶行为"
            >
              <div className="grid grid-cols-2 gap-x-16px lt-sm:grid-cols-1">
                <Form.Item
                  label="桶名称"
                  name="bucketName"
                  rules={[
                    { message: '请输入桶名称', required: true },
                    { max: 255, message: '桶名称长度需要在 2-255 个字符之间', min: 2 }
                  ]}
                >
                  <Input
                    allowClear
                    maxLength={255}
                    placeholder="例如 skroc-assets"
                  />
                </Form.Item>

                <Form.Item
                  extra="对象 key 会以它开头，其余部分由后端生成。"
                  label="对象前缀"
                  name="prefix"
                  rules={[{ max: 255, message: '对象前缀最多 255 个字符' }]}
                >
                  <Input
                    allowClear
                    maxLength={255}
                    placeholder="选填"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label="桶权限"
                name="accessPolicy"
                rules={[{ message: '请选择桶权限', required: true }]}
                extra={
                  <Typography.Text
                    className="text-12px"
                    type="secondary"
                  >
                    私有：列表地址是短期签名地址；公开：对象 URL 可直接访问；自定义：桶策略由运维自行维护，系统不代为配置。
                  </Typography.Text>
                }
              >
                <Radio.Group
                  optionType="button"
                  options={ACCESS_POLICY_OPTIONS}
                />
              </Form.Item>

              <Form.Item
                name="isDefault"
                valuePropName="checked"
              >
                <Checkbox>保存后设为默认存储（只影响后续上传，历史文件不迁移）</Checkbox>
              </Form.Item>
            </Card>

            <Card
              size="small"
              title="说明"
            >
              <Form.Item
                className="mb-0"
                label="备注"
                name="remark"
                rules={[{ max: 500, message: '备注最多 500 个字符' }]}
              >
                <Input.TextArea
                  maxLength={500}
                  placeholder="记录这套配置的用途、归属团队或注意事项"
                  rows={3}
                  showCount
                />
              </Form.Item>
            </Card>

            <Typography.Text
              className="text-12px"
              type="secondary"
            >
              系统没有连接测试接口，保存成功只代表配置已写入，不代表桶一定可用。
            </Typography.Text>
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default OssConfigEditorDrawer;
