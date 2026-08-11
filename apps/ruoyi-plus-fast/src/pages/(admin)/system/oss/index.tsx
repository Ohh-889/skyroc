import { downloadFileFromBlob } from '@skyroc/utils/web';
import { useAdminState } from '@skyroc/web-admin-layouts';
import { showSuccessMessage } from '@skyroc/web-admin-theme';
import { SvgIcon, TableHeaderOperation, useTable, useTableScroll } from '@skyroc/web-ui-compose';
import type { TableColumn, TableDataWithIndex, TableOnChange } from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router';
import { Alert, Button, Card, Collapse, Empty, Flex, Table, Tag, Tooltip, Typography } from 'antd';
import { Suspense, lazy, useEffect, useState } from 'react';
import type { Key } from 'react';

import { deleteModal } from '@/features/antd/deleteModal';
import {
  SYSTEM_OSS_QUERY_KEYS,
  downloadOssFile,
  useDeleteOssFilesMutation,
  useOssListQuery,
  useUploadOssFileMutation
} from '@/service/api/system-oss';
import type { OssId, OssItem, OssListPage, OssListParams } from '@/service/api/system-oss';

import { formatFileSize, formatSuffixLabel, getFileVisual, isPreviewableImage, parseOssExt } from './modules/oss-utils';
import OssSearch from './modules/OssSearch';
import OssThumbnail from './modules/OssThumbnail';
import {
  OssSearchSchema,
  getOssSearchInitialParams,
  hasOssFilters,
  normalizeOssSearchParams,
  toOssSearchQuery
} from './modules/shared';

const OssPreviewDrawer = lazy(() => import('./modules/OssPreviewDrawer'));
const OssUploadDrawer = lazy(() => import('./modules/OssUploadDrawer'));

const OSS_TABLE_SCROLL_X = 1120;
/** 上传成功后高亮新记录的时长，超时自动褪掉。 */
const HIGHLIGHT_DURATION = 4000;

type OssTableRecord = TableDataWithIndex<OssItem>;

interface OssManagementProps {
  /** 页面首次加载时使用的分页大小。 */
  initialPageSize?: number;
}

const OssManagement = (props: OssManagementProps) => {
  const { initialPageSize = 10 } = props;

  const navigate = useNavigate({ from: '/system/oss/' });
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isMobile } = useAdminState();
  const { scrollConfig, tableWrapperRef } = useTableScroll(OSS_TABLE_SCROLL_X);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<OssItem>();
  const [downloadingId, setDownloadingId] = useState<OssId>();
  const [highlightId, setHighlightId] = useState<OssId>();

  const uploadMutation = useUploadOssFileMutation();
  const deleteMutation = useDeleteOssFilesMutation();
  const {
    columnChecks,
    data,
    getData,
    pageNum,
    query,
    searchProps,
    setColumnChecks,
    tableProps,
    total,
    updateSearchParams
  } = useTable<OssListParams, OssListPage, OssItem>({
    apiParams: getOssSearchInitialParams(initialPageSize),
    columns: createColumns,
    isMobile,
    onChange: handleTableChange,
    onSearchParamsChange: syncSearchParams,
    pagination: {
      pageSizeOptions: [10, 20, 50, 100],
      showQuickJumper: true,
      showTotal: value => `共 ${value} 条`
    },
    queryHook: useOssListQuery,
    // 私有桶的 url 是约 120 秒的签名地址，缓存不能活得比它久
    queryOptions: { staleTime: 30_000 },
    // 查询条件写在 URL 上，刷新和分享链接都能回到同一屏
    routeSearch: location.searchStr,
    rowKey: file => String(file.ossId),
    transformParams: normalizeOssSearchParams
  });

  const files = data;
  const selectedFiles = files.filter(file => selectedRowKeys.map(String).includes(String(file.ossId)));
  const hasActiveFilters = hasOssFilters(searchProps.searchParams);
  const serviceOptions = [...new Set(files.map(file => file.service).filter(Boolean))];

  /** 把提交后的查询条件写回地址栏，刷新后由 routeSearch 原样读回来。 */
  function syncSearchParams(params: Partial<OssListParams>) {
    navigate({ search: () => toOssSearchQuery(params) });
  }

  function createColumns(): TableColumn<OssTableRecord>[] {
    return [
      {
        dataIndex: 'originalName',
        fixed: 'left',
        key: 'originalName',
        render: (_value, file) => renderFileCell(file),
        sorter: true,
        title: '文件',
        width: 340
      },
      {
        dataIndex: 'fileSuffix',
        key: 'fileSuffix',
        render: (_value, file) => renderTypeCell(file),
        sorter: true,
        title: '类型 / 大小',
        width: 170
      },
      {
        dataIndex: 'service',
        key: 'service',
        render: (value: string) =>
          value ? (
            <Tag
              className="m-0"
              color="geekblue"
              variant="filled"
            >
              {value}
            </Tag>
          ) : (
            <span className="text-tertiary">未知配置</span>
          ),
        sorter: true,
        title: '存储配置',
        width: 150
      },
      {
        dataIndex: 'createByName',
        key: 'createByName',
        render: (_value, file) => renderUploaderCell(file),
        title: '上传人',
        width: 140
      },
      {
        dataIndex: 'createTime',
        defaultSortOrder: 'descend',
        key: 'createTime',
        render: value => value || <span className="text-tertiary">—</span>,
        sorter: true,
        title: '创建时间',
        width: 180
      },
      {
        fixed: 'right',
        key: 'actions',
        render: (_value, file) => renderFileActions(file),
        title: '操作',
        width: 190
      }
    ];
  }

  function renderFileActions(file: OssItem) {
    return (
      <Flex
        gap={4}
        justify="center"
      >
        <Button
          size="small"
          onClick={() => setPreviewFile(file)}
        >
          {isPreviewableImage(file) ? '预览' : '查看'}
        </Button>
        <Button
          loading={String(downloadingId) === String(file.ossId)}
          size="small"
          onClick={() => handleDownload(file)}
        >
          下载
        </Button>
        <Button
          danger
          size="small"
          onClick={() => handleDelete([file])}
        >
          删除
        </Button>
      </Flex>
    );
  }

  function handleTableChange(...args: TableOnChange<OssTableRecord>): Partial<OssListParams> {
    const [pagination, , sorter] = args;
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    const field = activeSorter.field;
    const sortField = resolveSortField(field);

    setSelectedRowKeys([]);

    let isAsc: OssListParams['isAsc'];
    if (activeSorter.order === 'ascend') isAsc = 'asc';
    if (activeSorter.order === 'descend') isAsc = 'desc';

    return {
      current: pagination.current ?? 1,
      isAsc: activeSorter.order ? isAsc : 'desc',
      orderByColumn: activeSorter.order ? sortField : 'createTime',
      size: pagination.pageSize ?? initialPageSize
    };
  }

  async function handleUpload(file: File) {
    const result = await uploadMutation.mutateAsync(file);

    setUploadOpen(false);
    setSelectedRowKeys([]);
    updateSearchParams({ current: 1 });
    await invalidateOssData();
    setHighlightId(result.ossId);
    showSuccessMessage(`「${result.fileName}」上传成功`);
  }

  async function handleDownload(file: OssItem) {
    if (downloadingId) return;

    setDownloadingId(file.ossId);

    try {
      const blob = await downloadOssFile(file.ossId);

      // 下载接口返回的是裸文件流，拿不到 content-disposition，直接用列表里的原始名兜底
      downloadFileFromBlob({ fileName: file.originalName || file.fileName, source: blob });
    } catch {
      // 报错文案由请求层统一弹出；这里只负责让列表回到服务端的真实状态
      await getData();
    } finally {
      setDownloadingId(undefined);
    }
  }

  function handleDelete(targetFiles: OssItem[]) {
    const isBatch = targetFiles.length > 1;

    deleteModal({
      content: isBatch
        ? '文件将从各自原存储中删除，且无法恢复。若其中任一记录已变化，本次操作会整批失败并需要刷新列表。'
        : '该操作会同时删除文件记录和对象存储中的真实文件，删除后无法恢复。',
      okText: isBatch ? `删除 ${targetFiles.length} 个文件` : '删除文件',
      title: isBatch
        ? `删除已选择的 ${targetFiles.length} 个文件？`
        : `删除“${targetFiles[0].originalName || targetFiles[0].fileName}”？`,
      onOk: () => deleteOssRecords(targetFiles)
    });
  }

  async function deleteOssRecords(targetFiles: OssItem[]) {
    await deleteMutation.mutateAsync(targetFiles.map(file => file.ossId));

    setSelectedRowKeys([]);
    setPreviewFile(undefined);

    if (pageNum > 1 && targetFiles.length >= files.length) {
      updateSearchParams({ current: pageNum - 1 });
    }

    await invalidateOssData();
    showSuccessMessage(targetFiles.length > 1 ? '所选文件已删除' : '文件已删除');
  }

  async function handleRefresh() {
    await getData();
    setSelectedRowKeys([]);
  }

  async function invalidateOssData() {
    await queryClient.invalidateQueries({ queryKey: SYSTEM_OSS_QUERY_KEYS.ALL });
  }

  useEffect(() => {
    if (!highlightId) return;

    const timer = window.setTimeout(() => setHighlightId(undefined), HIGHLIGHT_DURATION);

    return () => window.clearTimeout(timer);
  }, [highlightId]);

  return (
    <div className="h-full min-h-500px flex flex-col gap-16px overflow-hidden lt-sm:overflow-auto">
      <Collapse
        bordered={false}
        className="shrink-0 card-wrapper"
        defaultActiveKey={isMobile ? undefined : '1'}
        items={[
          {
            children: (
              <OssSearch
                {...searchProps}
                serviceOptions={serviceOptions}
              />
            ),
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
              columns={columnChecks}
              loading={tableProps.loading}
              refresh={handleRefresh}
              setColumnChecks={setColumnChecks}
            >
              <Button
                icon={<SvgIcon icon="ph:gear-six" />}
                size="small"
                onClick={() => navigate({ to: '/system/oss-config' })}
              >
                存储配置
              </Button>
              <Button
                danger
                ghost
                disabled={selectedFiles.length === 0}
                icon={<SvgIcon icon="ph:trash" />}
                size="small"
                onClick={() => handleDelete(selectedFiles)}
              >
                删除所选
              </Button>
              <Button
                ghost
                icon={<SvgIcon icon="ph:upload-simple" />}
                size="small"
                type="primary"
                onClick={() => setUploadOpen(true)}
              >
                上传文件
              </Button>
            </TableHeaderOperation>
          }
          title={
            <Flex
              align="center"
              gap={8}
              wrap="wrap"
            >
              <Typography.Text strong>文件列表</Typography.Text>
              <Typography.Text type="secondary">
                {hasActiveFilters ? '命中' : '共'} {total} 个文件
              </Typography.Text>
              {selectedRowKeys.length > 0 ? (
                <Tag
                  color="geekblue"
                  variant="filled"
                >
                  已选 {selectedRowKeys.length} 项
                </Tag>
              ) : null}
            </Flex>
          }
        >
          {query.isError ? (
            <Alert
              className="mb-12px"
              showIcon
              title="文件列表加载失败"
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

          <Table<OssTableRecord>
            {...tableProps}
            column={{ align: 'center' }}
            rowClassName={file => (String(file.ossId) === String(highlightId) ? 'bg-primary-bg' : '')}
            scroll={scrollConfig}
            size="small"
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    hasActiveFilters
                      ? '没有找到符合条件的文件，试着调整名称、后缀、存储配置或创建时间'
                      : '还没有文件，上传第一份文件后可以在这里统一预览、下载和管理'
                  }
                />
              )
            }}
            rowSelection={{
              align: 'center',
              preserveSelectedRowKeys: false,
              selectedRowKeys,
              onChange: setSelectedRowKeys
            }}
          />
        </Card>
      </div>

      <Suspense fallback={null}>
        <OssUploadDrawer
          loading={uploadMutation.isPending}
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUpload={handleUpload}
        />

        <OssPreviewDrawer
          downloading={Boolean(downloadingId)}
          file={previewFile}
          open={Boolean(previewFile)}
          onClose={() => setPreviewFile(undefined)}
          onDelete={file => handleDelete([file])}
          onDownload={handleDownload}
        />
      </Suspense>
    </div>
  );
};

/** 文件列：缩略图 + 原始名 + 对象 key。原始名是用户真正用来认文件的那一份信息。 */
function renderFileCell(file: OssItem) {
  return (
    <Flex
      align="center"
      className="text-left"
      gap={10}
    >
      <OssThumbnail file={file} />
      <div className="min-w-0 flex-1">
        <Typography.Text
          className="block font-600"
          ellipsis={{ tooltip: file.originalName }}
        >
          {file.originalName || '未命名文件'}
        </Typography.Text>
        <Tooltip title={file.fileName}>
          <Typography.Text
            className="block max-w-260px truncate font-mono text-11px"
            type="secondary"
          >
            {file.fileName || '—'}
          </Typography.Text>
        </Tooltip>
      </div>
    </Flex>
  );
}

/**
 * 上传人列：有账号名就显示账号名，只剩 id 时退回 `#id`。
 *
 * 两种情况会只剩 id：账号被彻底删了，或者这条记录是定时任务/脚本写进来的（那种连 id 都没有）。
 * 退回 id 而不是显示“未知”，是因为排查时那个 id 仍然能拿去查。
 */
function renderUploaderCell(file: OssItem) {
  if (file.createByName) {
    return <Typography.Text ellipsis={{ tooltip: file.createByName }}>{file.createByName}</Typography.Text>;
  }

  if (file.createBy) {
    return <Typography.Text className="font-mono text-12px">#{file.createBy}</Typography.Text>;
  }

  return <span className="text-tertiary">未知</span>;
}

function renderTypeCell(file: OssItem) {
  const meta = parseOssExt(file.ext1);
  const visual = getFileVisual(file.fileSuffix);
  const size = formatFileSize(meta.fileSize);

  return (
    <div className="text-center">
      <Typography.Text strong>{formatSuffixLabel(file.fileSuffix)}</Typography.Text>
      <Typography.Text
        className="block text-12px"
        type="secondary"
      >
        {visual.label} · {size || '--'}
      </Typography.Text>
    </div>
  );
}

/** 接口只认白名单里的排序字段，表格列 key 之外的一律回落到创建时间。 */
function resolveSortField(field: unknown): OssListParams['orderByColumn'] {
  if (field === 'originalName' || field === 'fileSuffix' || field === 'service' || field === 'createTime') {
    return field;
  }

  return 'createTime';
}

export const Route = createFileRoute('/(admin)/system/oss/')({
  component: OssManagement,
  staticData: {
    keepAlive: true,
    menu: {
      icon: 'ph:folders',
      order: 12
    },
    title: '文件管理'
  },
  validateSearch: OssSearchSchema
});
