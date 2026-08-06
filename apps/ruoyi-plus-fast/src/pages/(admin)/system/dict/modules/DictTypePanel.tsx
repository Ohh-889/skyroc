import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableColumn, TableDataWithIndex } from '@skyroc/web-ui-compose';
import { Alert, Button, Card, Empty, Flex, Input, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

import type { DictTypeItem, DictTypeListParams } from '@/service/api/system-dict';

export type DictTypeTableParams = DictTypeListParams;
export type DictTypeTableRecord = TableDataWithIndex<DictTypeItem>;

interface DictTypePanelProps {
  /** 新增类型回调。 */
  onAdd: () => void;
  /** 删除类型回调。 */
  onDelete: (item: DictTypeItem) => void;
  /** 编辑类型回调。 */
  onEdit: (item: DictTypeItem) => void;
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
  const { onAdd, onDelete, onEdit, onSearch, onSelect, selectedTypeId, tableProps } = props;

  const columns: TableColumn<DictTypeTableRecord>[] = [
    {
      dataIndex: 'dictName',
      key: 'dictName',
      render: (value, item) => (
        <div className="min-w-0" onClick={() => onSelect(item)}>
          <Typography.Text className="block truncate" strong>
            {value}
          </Typography.Text>
          <Typography.Text className="block truncate text-11px" type="secondary">
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
          <Button
            aria-label="编辑字典类型"
            icon={<SvgIcon icon="ph:pencil-simple" />}
            size="small"
            type="text"
            onClick={() => onEdit(item)}
          />
          <Button
            aria-label="删除字典类型"
            danger
            icon={<SvgIcon icon="ph:trash" />}
            size="small"
            type="text"
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
      extra={<Button aria-label="新增字典类型" icon={<SvgIcon icon="ph:plus" />} type="text" onClick={onAdd} />}
      title="字典类型列表"
      variant="borderless"
    >
      <Input
        allowClear
        className="mb-12px"
        placeholder="请输入关键词搜索"
        onChange={event => onSearch(event.target.value)}
      />

      {tableProps.error ? <Alert className="mb-12px" title="字典类型加载失败" showIcon type="error" /> : null}

      <div className="min-h-0 flex-1 overflow-auto">
        <Table<DictTypeTableRecord>
          {...tableProps}
          columns={columns}
          dataSource={tableProps.dataSource ?? []}
          locale={{
            emptyText: <Empty description="暂无字典类型" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }}
          rowClassName={item => (String(item.dictId) === String(selectedTypeId) ? 'bg-primary-1' : '')}
          rowKey={item => String(item.dictId)}
          showHeader={false}
          size="small"
        />
      </div>
    </Card>
  );
};

export default DictTypePanel;
