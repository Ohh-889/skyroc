import { SvgIcon } from '@skyroc/web-ui-compose';
import type { TableSearchProps } from '@skyroc/web-ui-compose';
import { Button, Col, Flex, Form, Input, Row, Select } from 'antd';
import { useState } from 'react';

import SearchRangePicker from '@/features/table/SearchRangePicker';
import type { TenantListParams } from '@/service/api/system-tenant';
import type { TenantPackageOption } from '@/service/api/system-tenant-package';

import { TENANT_FIELD_LIMITS, TENANT_STATUS_OPTIONS, hasAdvancedTenantFilters } from './tenant-utils';

interface TenantSearchProps {
  /** 由表格 Hook 管理的查询表单实例。 */
  form: TableSearchProps<TenantListParams>['form'];
  /** 套餐下拉选项，只包含状态正常的套餐。 */
  packageOptions: TenantPackageOption[];
  /** 重置查询表单和已提交参数。 */
  reset: TableSearchProps<TenantListParams>['reset'];
  /** 提交查询表单。 */
  search: TableSearchProps<TenantListParams>['search'];
  /** 当前已经提交的租户查询参数。 */
  searchParams: TableSearchProps<TenantListParams>['searchParams'];
}

const TenantSearch = (props: TenantSearchProps) => {
  const { form, packageOptions, reset, search, searchParams } = props;

  const [expanded, setExpanded] = useState(() => hasAdvancedTenantFilters(searchParams));

  const packageSelectOptions = packageOptions.map(option => ({
    label: option.packageName || `套餐 #${option.packageId}`,
    value: Number(option.packageId)
  }));

  async function handleSearch() {
    await search();
  }

  return (
    <Form
      form={form}
      initialValues={searchParams}
      labelCol={{ md: 8, span: 6 }}
    >
      <Row
        gutter={[16, 16]}
        wrap
      >
        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="租户编号"
            name="tenantId"
          >
            <Input
              allowClear
              maxLength={TENANT_FIELD_LIMITS.tenantId}
              placeholder="等值匹配，如 084216"
              onPressEnter={handleSearch}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="企业名称"
            name="companyName"
          >
            <Input
              allowClear
              maxLength={TENANT_FIELD_LIMITS.companyName}
              placeholder="模糊匹配"
              onPressEnter={handleSearch}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="联系人"
            name="contactUserName"
          >
            <Input
              allowClear
              maxLength={TENANT_FIELD_LIMITS.contactUserName}
              placeholder="模糊匹配"
              onPressEnter={handleSearch}
            />
          </Form.Item>
        </Col>

        <Col
          lg={6}
          md={12}
          span={24}
        >
          <Form.Item
            className="m-0"
            label="状态"
            name="status"
          >
            <Select
              allowClear
              options={[...TENANT_STATUS_OPTIONS]}
              placeholder="全部状态"
            />
          </Form.Item>
        </Col>

        {expanded ? (
          <>
            <Col
              lg={6}
              md={12}
              span={24}
            >
              <Form.Item
                className="m-0"
                label="联系电话"
                name="contactPhone"
              >
                <Input
                  allowClear
                  maxLength={TENANT_FIELD_LIMITS.contactPhone}
                  placeholder="等值匹配"
                  onPressEnter={handleSearch}
                />
              </Form.Item>
            </Col>

            <Col
              lg={6}
              md={12}
              span={24}
            >
              <Form.Item
                className="m-0"
                label="信用代码"
                name="licenseNumber"
              >
                <Input
                  allowClear
                  maxLength={TENANT_FIELD_LIMITS.licenseNumber}
                  placeholder="等值匹配"
                  onPressEnter={handleSearch}
                />
              </Form.Item>
            </Col>

            <Col
              lg={6}
              md={12}
              span={24}
            >
              <Form.Item
                className="m-0"
                label="绑定域名"
                name="domain"
              >
                <Input
                  allowClear
                  maxLength={TENANT_FIELD_LIMITS.domain}
                  placeholder="模糊匹配"
                  onPressEnter={handleSearch}
                />
              </Form.Item>
            </Col>

            <Col
              lg={6}
              md={12}
              span={24}
            >
              <Form.Item
                className="m-0"
                label="租户套餐"
                name="packageId"
              >
                <Select
                  allowClear
                  options={packageSelectOptions}
                  placeholder="全部套餐"
                />
              </Form.Item>
            </Col>

            <Col
              lg={12}
              md={12}
              span={24}
            >
              <SearchRangePicker
                form={form}
                granularity="day"
                label="创建时间"
                labelCol={{ md: 4, span: 6 }}
              />
            </Col>
          </>
        ) : null}

        <Col span={24}>
          <Form.Item className="m-0">
            <Flex
              align="center"
              gap={12}
              justify="end"
              wrap="wrap"
            >
              <Button
                icon={<SvgIcon icon={expanded ? 'ph:caret-up' : 'ph:caret-down'} />}
                type="link"
                onClick={() => setExpanded(value => !value)}
              >
                {expanded ? '收起筛选' : '更多筛选'}
              </Button>
              <Button
                icon={<SvgIcon icon="ic:round-refresh" />}
                onClick={reset}
              >
                重置
              </Button>
              <Button
                ghost
                icon={<SvgIcon icon="ic:round-search" />}
                type="primary"
                onClick={handleSearch}
              >
                查询
              </Button>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default TenantSearch;
