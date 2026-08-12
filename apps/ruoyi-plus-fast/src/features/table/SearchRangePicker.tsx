import { DatePicker, Form, Input } from 'antd';
import type { FormInstance, FormItemProps } from 'antd';

import {
  formatSearchRangeBegin,
  formatSearchRangeEnd,
  toSearchDateRange
} from './search-params';
import type { SearchDateRange, SearchRangeGranularity } from './search-params';

interface SearchRangePickerProps {
  /** 区间起点对应的表单字段名，默认对齐后端的 beginTime。 */
  beginField?: string;
  /** 区间终点对应的表单字段名，默认对齐后端的 endTime。 */
  endField?: string;
  /** 由表格 Hook 管理的查询表单实例。 */
  form: FormInstance;
  /** 取值口径，见 SearchRangeGranularity。 */
  granularity?: SearchRangeGranularity;
  /** Form.Item 的标签文案。 */
  label: string;
  /** Form.Item 的标签列宽，跟随各页自己的栅格。 */
  labelCol?: FormItemProps['labelCol'];
  /** 是否让用户选到时分。 */
  showTime?: boolean;
}

/**
 * 查询表单里的时间区间。
 *
 * RangePicker 的值是 Dayjs 元组，没法写进 URL；而参数、URL 和接口都用两个字符串字段。 与其在提交前后来回转换，不如让表单直接登记这两个字符串字段，
 * RangePicker 退化成它们之上的一层视图—— 这样「清空区间再查询」提交的是显式 undefined，能正常覆盖掉上一次的值，不会有残留。
 */
const SearchRangePicker = (props: SearchRangePickerProps) => {
  const {
    beginField = 'beginTime',
    endField = 'endTime',
    form,
    granularity = 'second',
    label,
    labelCol,
    showTime = false
  } = props;

  const beginTime = Form.useWatch<string | undefined>(beginField, form);
  const endTime = Form.useWatch<string | undefined>(endField, form);

  function handleChange(value: SearchDateRange) {
    form.setFieldsValue({
      [beginField]: formatSearchRangeBegin(value?.[0], granularity),
      [endField]: formatSearchRangeEnd(value?.[1], granularity)
    });
  }

  return (
    <>
      <Form.Item
        hidden
        name={beginField}
      >
        <Input />
      </Form.Item>
      <Form.Item
        hidden
        name={endField}
      >
        <Input />
      </Form.Item>
      <Form.Item
        className="m-0"
        label={label}
        labelCol={labelCol}
      >
        <DatePicker.RangePicker
          className="w-full"
          showTime={showTime ? { format: 'HH:mm' } : false}
          value={toSearchDateRange(beginTime, endTime)}
          onChange={handleChange}
        />
      </Form.Item>
    </>
  );
};

export default SearchRangePicker;
