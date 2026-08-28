import { ButtonIcon } from '@shell/ui/antd';
import type { TableColumn, TableDataWithIndex } from '@shell/ui/compose';
import { Alert, Card, Empty, Flex, Input, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

import type { DictTypeItem } from '@/service/api/system-dict';

export type DictTypeTableRecord = TableDataWithIndex<DictTypeItem>;

interface DictTypePanelProps {
  /** 从地址栏还原的关键词，只作为输入框初值。 */
  defaultKeyword?: string;
  /** 导出请求是否进行中。 */
  exportLoading?: boolean;
  /** 新增类型回调。 */
  onAdd: () => void;
  /** 删除类型回调。 */
  onDelete: (item: DictTypeItem) => void;
  /** 编辑类型回调。 */
  onEdit: (item: DictTypeItem) => void;
  /** 导出当前筛选到的字典类型。 */
  onExport: () => Promise<void> | void;
  /** 刷新字典类型列表。 */
  onRefresh: () => Promise<void> | void;
  /** 关键词变化时重新查询字典类型。 */
  onSearch: (dictName?: string) => void;
  /** 类型行点击回调。 */
  onSelect: (item: DictTypeItem) => void;
  /** 当前选中的类型。 */
  selectedTypeId?: string | number;
  /** 字典类型列表表格配置。 */
  tableProps: TableProps<DictTypeTableRecord> & { error?: boolean };
}

const DictTypePanel = (props: DictTypePanelProps) => {
  const {
    defaultKeyword,
    exportLoading = false,
    onAdd,
    onDelete,
    onEdit,
    onExport,
    onRefresh,
    onSearch,
    onSelect,
    selectedTypeId,
    tableProps
  } = props;

  const columns: TableColumn<DictTypeTableRecord>[] = [
    {
      dataIndex: 'dictName',
      key: 'dictName',
      render: (value, item) => (
        <div
          className="min-w-0"
          onClick={() => onSelect(item)}
        >
          <Typography.Text
            className="block truncate"
            strong
          >
            {value}
          </Typography.Text>
          <Typography.Text
            className="block truncate text-11px"
            type="secondary"
          >
            {item.dictType}
          </Typography.Text>
        </div>
      ),
      title: '字典类型'
    },
    {
      key: 'actions',
      render: (_value, item) => (
        <Flex gap={2}>
          <ButtonIcon
            aria-label="编辑字典类型"
            className="h-26px w-26px text-13px"
            icon="ph:pencil-simple"
            tooltipContent="编辑字典类型"
            onClick={() => onEdit(item)}
          />
          <ButtonIcon
            aria-label="删除字典类型"
            className="h-26px w-26px text-13px text-error"
            danger
            icon="ph:trash"
            tooltipContent="删除字典类型"
            onClick={() => onDelete(item)}
          />
        </Flex>
      ),
      title: '操作',
      width: 70
    }
  ];
  return (
    <Card
      className="h-full min-h-0 flex flex-col card-wrapper"
      classNames={{ body: 'min-h-0 flex flex-1 flex-col' }}
      extra={
        <Flex gap={2}>
          <ButtonIcon
            aria-label="新增字典类型"
            className="h-28px w-28px text-15px"
            icon="ph:plus"
            tooltipContent="新增字典类型"
            onClick={onAdd}
          />
          <ButtonIcon
            aria-label="导出字典类型"
            className="h-28px w-28px text-15px"
            icon="mdi:download"
            loading={exportLoading}
            tooltipContent="导出字典类型"
            onClick={onExport}
          />
          <ButtonIcon
            aria-label="刷新字典类型"
            className="h-28px w-28px text-15px"
            hoverAnimation="rotate"
            icon="ph:arrow-clockwise"
            loading={tableProps.loading}
            tooltipContent="刷新字典类型"
            onClick={onRefresh}
          />
        </Flex>
      }
      title="字典类型列表"
      variant="borderless"
    >
      <Input
        allowClear
        className="mb-12px"
        defaultValue={defaultKeyword}
        placeholder="请输入关键词搜索"
        onChange={event => onSearch(event.target.value)}
      />

      {tableProps.error ? (
        <Alert
          className="mb-12px"
          title="字典类型加载失败"
          showIcon
          type="error"
        />
      ) : null}

      <div className="min-h-0 flex-1 overflow-auto">
        <Table<DictTypeTableRecord>
          {...tableProps}
          column={{ align: 'center' }}
          columns={columns}
          dataSource={tableProps.dataSource ?? []}
          locale={{
            emptyText: (
              <Empty
                description="暂无字典类型"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
          rowClassName={item => (String(item.dictId) === String(selectedTypeId) ? 'bg-primary-50' : '')}
          rowKey={item => String(item.dictId)}
          showHeader={false}
          size="small"
        />
      </div>
    </Card>
  );
};

export default DictTypePanel;
