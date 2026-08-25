import { useAdminState } from '@shell/layouts';
import { showConfirmModal, showSuccessMessage } from '@shell/theme';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@shell/ui/compose';
import type { TableColumn, TableDataWithIndex, TableQueryHookOptions } from '@shell/ui/compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Alert, Button, Card, Collapse, Empty, Flex, Table, Tag, Tooltip, Typography } from 'antd';
import { Suspense, lazy, useState } from 'react';

import {
  SYSTEM_OSS_CONFIG_QUERY_KEYS,
  useCreateOssConfigMutation,
  useDeleteOssConfigsMutation,
  useOssConfigListQuery,
  useUpdateOssConfigMutation,
  useUpdateOssConfigStatusMutation
} from '@/service/api/system-oss-config';
import type {
  OssConfigAccessPolicy,
  OssConfigId,
  OssConfigItem,
  OssConfigListPage,
  OssConfigSavePayload
} from '@/service/api/system-oss-config';

import type { OssConfigEditorMode } from './modules/OssConfigEditorDrawer';
import OssConfigSearch from './modules/OssConfigSearch';
import type { OssConfigTableParams } from './modules/OssConfigSearch';
import {
  ACCESS_POLICY_COLORS,
  ACCESS_POLICY_LABELS,
  buildEndpointUrl,
  isBuiltInConfig,
  isDefaultConfig,
  maskAccessKey
} from './modules/oss-config-utils';

const OssConfigDeleteModal = lazy(() => import('./modules/OssConfigDeleteModal'));
const OssConfigEditorDrawer = lazy(() => import('./modules/OssConfigEditorDrawer'));

const OSS_CONFIG_TABLE_SCROLL_X = 1240;
const OSS_CONFIG_SEARCH_INITIAL_PARAMS: Partial<OssConfigTableParams> = {
  bucketName: undefined,
  configKey: undefined,
  status: undefined
};

interface OssConfigEditorState {
  configId?: OssConfigId;
  mode: OssConfigEditorMode;
  open: boolean;
}

interface OssConfigManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const INITIAL_EDITOR_STATE: OssConfigEditorState = { mode: 'create', open: false };

type OssConfigTableRecord = TableDataWithIndex<OssConfigItem>;

const OssConfigManagement = (props: OssConfigManagementProps) => {
  const { initialPageSize = 10 } = props;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(OSS_CONFIG_TABLE_SCROLL_X);
  const [editorState, setEditorState] = useState<OssConfigEditorState>(INITIAL_EDITOR_STATE);
  const [deleteTarget, setDeleteTarget] = useState<OssConfigItem>();

  const createMutation = useCreateOssConfigMutation();
  const updateMutation = useUpdateOssConfigMutation();
  const statusMutation = useUpdateOssConfigStatusMutation();
  const deleteMutation = useDeleteOssConfigsMutation();
  const { columnChecks, data, getData, pageNum, query, searchProps, setColumnChecks, tableProps, total } = useTable<
    OssConfigTableParams,
    OssConfigListPage,
    OssConfigItem
  >({
    apiParams: {
      ...OSS_CONFIG_SEARCH_INITIAL_PARAMS,
      size: initialPageSize
    },
    columns: createColumns,
    isChangeURL: false,
    isMobile,
    pagination: {
      pageSizeOptions: [10, 20, 50],
      showQuickJumper: true,
      showTotal: value => `共 ${value} 条`
    },
    queryHook: useOssConfigTableQuery,
    rowKey: config => String(config.ossConfigId),
    transformParams: normalizeOssConfigSearchParams
  });

  const configs = data;
  const saving = createMutation.isPending || updateMutation.isPending;
  const hasActiveFilters = hasOssConfigFilters(searchProps.searchParams);
  // 只能看到当前页，所以这个判断仅在“第一页且没有筛选”时才有意义，避免翻页时误报
  const missingDefault = !hasActiveFilters && pageNum === 1 && configs.length > 0 && !configs.some(isDefaultConfig);

  function createColumns(): TableColumn<OssConfigTableRecord>[] {
    return [
      {
        dataIndex: 'configKey',
        fixed: 'left',
        key: 'configKey',
        render: (value: string, config) => (
          <div className="text-left">
            <Flex
              align="center"
              gap={7}
            >
              <Typography.Text
                className="truncate font-600"
                strong
              >
                {value}
              </Typography.Text>
              {isBuiltInConfig(config.ossConfigId) ? (
                <Tag
                  className="m-0 text-10px"
                  color="gold"
                  variant="filled"
                >
                  系统内置
                </Tag>
              ) : null}
            </Flex>
            <Typography.Text
              className="block text-12px"
              ellipsis={{ tooltip: config.remark }}
              type="secondary"
            >
              {config.remark || '无备注'}
            </Typography.Text>
          </div>
        ),
        title: '配置',
        width: 220
      },
      {
        dataIndex: 'endpoint',
        key: 'endpoint',
        render: (_value, config) => (
          <div className="text-left">
            <Typography.Text
              className="block font-mono text-12px"
              ellipsis={{ tooltip: buildEndpointUrl(config) }}
            >
              {buildEndpointUrl(config) || '—'}
            </Typography.Text>
            <Typography.Text
              className="block text-12px"
              ellipsis={{ tooltip: config.domain }}
              type="secondary"
            >
              {config.domain ? `自定义域名 ${config.domain}` : '未配置自定义域名'}
            </Typography.Text>
          </div>
        ),
        title: '访问地址',
        width: 260
      },
      {
        dataIndex: 'bucketName',
        key: 'bucketName',
        render: (value: string, config) => (
          <div className="text-left">
            <Typography.Text className="block">{value || '—'}</Typography.Text>
            <Typography.Text
              className="block text-12px"
              type="secondary"
            >
              {config.prefix ? `前缀 ${config.prefix}` : '无前缀'}
            </Typography.Text>
          </div>
        ),
        title: '桶 / 前缀',
        width: 190
      },
      {
        dataIndex: 'accessKey',
        key: 'accessKey',
        render: (value: string) => (
          <Tooltip title="出于安全考虑列表不展示完整凭证">
            <Typography.Text className="font-mono text-12px">{maskAccessKey(value)}</Typography.Text>
          </Tooltip>
        ),
        title: 'AccessKey',
        width: 150
      },
      {
        dataIndex: 'accessPolicy',
        key: 'accessPolicy',
        render: (value: OssConfigAccessPolicy) => (
          <Tag
            className="m-0"
            color={ACCESS_POLICY_COLORS[value]}
            variant="filled"
          >
            {ACCESS_POLICY_LABELS[value]}
          </Tag>
        ),
        title: '桶权限',
        width: 110
      },
      {
        dataIndex: 'region',
        key: 'region',
        render: value => value || <span className="text-tertiary">未设置</span>,
        title: '区域',
        width: 130
      },
      {
        dataIndex: 'status',
        key: 'status',
        render: (_value, config) =>
          isDefaultConfig(config) ? (
            <Tag
              className="m-0"
              color="green"
              icon={<SvgIcon icon="ph:check-circle" />}
              variant="filled"
            >
              默认
            </Tag>
          ) : (
            <Tag className="m-0">备用</Tag>
          ),
        title: '状态',
        width: 110
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, config) => renderConfigActions(config),
        title: '操作',
        width: 210
      }
    ];
  }

  function renderConfigActions(config: OssConfigItem) {
    const isDefault = isDefaultConfig(config);
    // 内置配置后端拒删；当前默认删掉之后上传直接失败，两种都不给入口
    const deletable = !isDefault && !isBuiltInConfig(config.ossConfigId);

    return (
      <Flex
        gap={4}
        justify="center"
      >
        <Button
          size="small"
          type="link"
          onClick={() => setEditorState({ configId: config.ossConfigId, mode: 'update', open: true })}
        >
          编辑
        </Button>
        {isDefault ? null : (
          <Button
            size="small"
            type="link"
            onClick={() => handleSetDefault(config)}
          >
            设为默认
          </Button>
        )}
        {deletable ? (
          <Button
            danger
            size="small"
            type="link"
            onClick={() => setDeleteTarget(config)}
          >
            删除
          </Button>
        ) : null}
      </Flex>
    );
  }

  function handleAdd() {
    setEditorState({ mode: 'create', open: true });
  }

  function handleCloseEditor() {
    if (!saving) setEditorState(INITIAL_EDITOR_STATE);
  }

  async function handleSubmit(values: OssConfigSavePayload) {
    const { configId, mode } = editorState;

    if (mode === 'create') {
      await createMutation.mutateAsync(values);
    } else {
      await updateMutation.mutateAsync({ ...values, ossConfigId: configId as OssConfigId });
    }

    setEditorState(INITIAL_EDITOR_STATE);
    await invalidateOssConfigData();
    showSuccessMessage(`存储配置「${values.configKey}」${mode === 'create' ? '已新增' : '已更新'}`);
  }

  function handleSetDefault(config: OssConfigItem) {
    showConfirmModal({
      closable: true,
      content: '之后上传的新文件将写入该配置对应的桶。当前默认配置会自动变为备用，历史文件仍保留在原存储中。',
      okButtonProps: { loading: statusMutation.isPending },
      okText: '设为默认',
      title: `将“${config.configKey}”设为默认存储？`,
      onOk: async () => {
        // 只提交主键和状态，连接信息和凭证一个都不夹带
        await statusMutation.mutateAsync({ ossConfigId: config.ossConfigId, status: '0' });
        await invalidateOssConfigData();
        showSuccessMessage(`默认存储已切换为「${config.configKey}」`);
      }
    });
  }

  async function handleDelete(config: OssConfigItem) {
    await deleteMutation.mutateAsync([config.ossConfigId]);
    setDeleteTarget(undefined);
    await invalidateOssConfigData();
    showSuccessMessage(`存储配置「${config.configKey}」已删除`);
  }

  async function invalidateOssConfigData() {
    await queryClient.invalidateQueries({ queryKey: SYSTEM_OSS_CONFIG_QUERY_KEYS.ALL });
  }

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Alert
        className="shrink-0"
        showIcon
        type="warning"
        action={
          <Button
            icon={<SvgIcon icon="ph:arrow-left" />}
            size="small"
            onClick={() => navigate({ to: '/system/oss' })}
          >
            返回文件管理
          </Button>
        }
        description="存储配置影响文件的上传、预览、下载和删除。SecretKey 保存后不会再次显示，修改配置时需要重新输入；设置默认只影响后续上传，历史文件不会迁移。"
        title="这是基础设施配置"
      />

      {missingDefault ? (
        <Alert
          className="shrink-0"
          description="没有默认配置时文件上传会直接失败。请为其中一条配置点击“设为默认”。"
          showIcon
          title="当前没有默认存储，文件上传不可用"
          type="error"
        />
      ) : null}

      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: <OssConfigSearch {...searchProps} />,
            key: '1',
            label: '查询条件'
          }
        ]}
      />

      <div
        className="min-h-0 flex flex-1 flex-col"
        ref={tableWrapperRef}
      >
        <Card
          className="min-h-0 min-w-0 flex flex-1 flex-col card-wrapper"
          variant="borderless"
          extra={
            <TableHeaderOperation
              add={handleAdd}
              addText="新增配置"
              columns={columnChecks}
              loading={tableProps.loading}
              refresh={getData}
              setColumnChecks={setColumnChecks}
            />
          }
          title={
            <Flex
              align="center"
              gap={8}
              wrap="wrap"
            >
              <Typography.Text strong>存储配置</Typography.Text>
              <Typography.Text type="secondary">
                {hasActiveFilters ? '命中' : '共'} {total} 套配置
              </Typography.Text>
            </Flex>
          }
        >
          {query.isError ? (
            <Alert
              className="mb-12px"
              showIcon
              title="存储配置加载失败"
              type="error"
              action={
                <Button
                  size="small"
                  onClick={getData}
                >
                  重新加载
                </Button>
              }
            />
          ) : null}

          <Table<OssConfigTableRecord>
            {...tableProps}
            column={{ align: 'center' }}
            scroll={scrollConfig}
            size="small"
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    hasActiveFilters
                      ? '没有找到符合条件的存储配置'
                      : '还没有存储配置。至少创建并设置一条默认配置后，文件上传才能正常工作'
                  }
                />
              )
            }}
          />
        </Card>
      </div>

      <Suspense fallback={null}>
        <OssConfigEditorDrawer
          configId={editorState.configId}
          loading={saving}
          mode={editorState.mode}
          open={editorState.open}
          onClose={handleCloseEditor}
          onSubmit={handleSubmit}
        />

        <OssConfigDeleteModal
          config={deleteTarget}
          loading={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(undefined)}
          onConfirm={handleDelete}
        />
      </Suspense>
    </div>
  );
};

function normalizeOssConfigSearchParams(params: OssConfigTableParams): OssConfigTableParams {
  return {
    ...params,
    bucketName: params.bucketName?.trim() || undefined,
    configKey: params.configKey?.trim() || undefined
  };
}

function useOssConfigTableQuery<Data = OssConfigListPage>(
  params: OssConfigTableParams,
  options?: TableQueryHookOptions<OssConfigListPage, Data>
) {
  return useOssConfigListQuery(params, options);
}

function hasOssConfigFilters(params: Partial<OssConfigTableParams>) {
  return Boolean(params.bucketName || params.configKey || params.status);
}

export const Route = createFileRoute('/(admin)/system/oss-config/')({
  component: OssConfigManagement,
  staticData: {
    menu: {
      activeMenu: '/system/oss',
      hide: true,
      icon: 'ph:gear-six'
    },
    title: '存储配置'
  }
});
