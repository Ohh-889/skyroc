import { SvgIcon } from '@shell/ui/compose';
import type { GeneralPopupOperationProps, TableDataWithIndex } from '@shell/ui/compose';
import { Button, Col, Divider, Drawer, Flex, Form, Input, InputNumber, Radio, Row, Select, Switch } from 'antd';
import type { FormRule } from 'antd';
import { useTranslation } from 'react-i18next';

import { translateOptions } from '@/utils/common';
import { getLocalIcons } from '@/utils/icon';

import {
  badgeTypeOptions,
  badgeVariantOptions,
  createDefaultBackendRouteFormModel,
  createDefaultBackendRouteQuery,
  routeMenuTypeOptions
} from './shared';
import type { BackendRouteFormModel, BackendRouteTableRecord } from './shared';

type MenuTableRecord = TableDataWithIndex<BackendRouteTableRecord>;

interface MenuOperateDrawerProps {
  /** App-specific menu extra options registered during admin layout setup. */
  extraOptions: Common.Option<Router.Extra>[];
  /** Ant Design form instance shared with table operate hook. */
  form: GeneralPopupOperationProps<MenuTableRecord>['form'];
  /** Submit add or edit form. */
  handleSubmit: GeneralPopupOperationProps<MenuTableRecord>['handleSubmit'];
  /** Available app layout category options. */
  layoutOptions: Common.Option<Router.MenuCategoryKey>[];
  /** Parent backend route options from the current dynamic route tree. */
  menuOptions: Common.Option<string>[];
  /** Close drawer and reset form state. */
  onClose: GeneralPopupOperationProps<MenuTableRecord>['onClose'];
  /** Whether the drawer is visible. */
  open: GeneralPopupOperationProps<MenuTableRecord>['open'];
  /** Current operation type. */
  operateType: GeneralPopupOperationProps<MenuTableRecord>['operateType'];
  /** Route path options used by active menu selection. */
  routePathOptions: Common.Option<string>[];
}

const localIconOptions = getLocalIcons().map(getLocalIconOption);

const MenuOperateDrawer = (props: MenuOperateDrawerProps) => {
  const { extraOptions, form, handleSubmit, layoutOptions, menuOptions, onClose, open, operateType, routePathOptions } =
    props;

  const { t } = useTranslation();
  const requiredRule = createRequiredRule(t('form.required'));
  const formValues = Form.useWatch(
    values => createDefaultBackendRouteFormModel(values as Partial<BackendRouteFormModel>),
    form
  );
  const hideInMenu = formValues.hideInMenu;
  const isEditing = operateType === 'edit';
  const drawerTitle = getDrawerTitle();

  function getDrawerTitle() {
    if (isEditing) return t('page.manage.menu.editMenu');
    if (formValues.parentId) return t('page.manage.menu.addChildMenu');

    return t('page.manage.menu.addMenu');
  }

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
          >
            {t('common.confirm')}
          </Button>
        </Flex>
      }
      open={open}
      size={760}
      title={drawerTitle}
      onClose={onClose}
    >
      <Form
        form={form}
        initialValues={createDefaultBackendRouteFormModel()}
        layout="vertical"
      >
        <Divider
          plain
          titlePlacement="start"
        >
          {t('page.manage.menu.routePayload')}
        </Divider>

        <Row gutter={16}>
          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.id')}
              name="id"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.id')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.parent')}
              name="parentId"
            >
              <Select
                allowClear
                showSearch
                options={menuOptions}
                optionFilterProp="label"
                placeholder={t('page.manage.menu.form.parent')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.layout')}
              name="layout"
            >
              <Select
                allowClear
                options={layoutOptions}
                placeholder={t('page.manage.menu.form.layout')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.routePath')}
              name="path"
              rules={[requiredRule]}
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.routePath')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.routeName')}
              name="name"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.routeName')}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={t('page.manage.menu.redirect')}
              name="redirect"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.redirect')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider
          plain
          titlePlacement="start"
        >
          {t('page.manage.menu.handle')}
        </Divider>

        <Row gutter={16}>
          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.menuType')}
              name="type"
              rules={[requiredRule]}
            >
              <Radio.Group options={translateRadioOptions(routeMenuTypeOptions, t)} />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.order')}
              name="order"
            >
              <InputNumber
                className="w-full"
                min={0}
                placeholder={t('page.manage.menu.form.order')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.menuName')}
              name="title"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.title')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.i18nKey')}
              name="i18nKey"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.i18nKey')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.icon')}
              name="icon"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.icon')}
                suffix={
                  formValues.icon ? (
                    <SvgIcon
                      className="text-icon"
                      icon={formValues.icon}
                    />
                  ) : null
                }
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.localIcon')}
              name="localIcon"
            >
              <Select
                allowClear
                showSearch
                options={localIconOptions}
                placeholder={t('page.manage.menu.form.localIcon')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.extra')}
              name="extra"
            >
              <Select
                allowClear
                options={extraOptions}
                placeholder={t('page.manage.menu.form.extra')}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={t('page.manage.menu.roles')}
              name="roles"
            >
              <Select
                mode="tags"
                placeholder={t('page.manage.menu.form.roles')}
                tokenSeparators={[',']}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider
          plain
          titlePlacement="start"
        >
          {t('page.manage.menu.navigation')}
        </Divider>

        <Row gutter={16}>
          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.href')}
              name="href"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.href')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.url')}
              name="url"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.url')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.fixedIndexInTab')}
              name="fixedIndexInTab"
            >
              <InputNumber
                className="w-full"
                min={0}
                placeholder={t('page.manage.menu.form.fixedIndexInTab')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.hideInMenu')}
              name="hideInMenu"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t('common.yesOrNo.yes')}
                unCheckedChildren={t('common.yesOrNo.no')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.keepAlive')}
              name="keepAlive"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t('common.yesOrNo.yes')}
                unCheckedChildren={t('common.yesOrNo.no')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.constant')}
              name="constant"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t('common.yesOrNo.yes')}
                unCheckedChildren={t('common.yesOrNo.no')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.multiTab')}
              name="multiTab"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t('common.yesOrNo.yes')}
                unCheckedChildren={t('common.yesOrNo.no')}
              />
            </Form.Item>
          </Col>

          {hideInMenu && (
            <Col
              md={12}
              span={24}
            >
              <Form.Item
                label={t('page.manage.menu.activeMenu')}
                name="activeMenu"
              >
                <Select
                  allowClear
                  showSearch
                  options={routePathOptions}
                  placeholder={t('page.manage.menu.form.activeMenu')}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Divider
          plain
          titlePlacement="start"
        >
          {t('page.manage.menu.query')}
        </Divider>

        <Form.List name="query">
          {(fields, { add, remove }) => (
            <div className="flex flex-col gap-8px">
              {fields.map((field, index) => (
                <Row
                  gutter={8}
                  key={field.key}
                >
                  <Col
                    md={10}
                    span={24}
                  >
                    <Form.Item name={[field.name, 'key']}>
                      <Input
                        allowClear
                        placeholder={t('page.manage.menu.form.queryKey')}
                      />
                    </Form.Item>
                  </Col>

                  <Col
                    md={10}
                    span={24}
                  >
                    <Form.Item name={[field.name, 'value']}>
                      <Input
                        allowClear
                        placeholder={t('page.manage.menu.form.queryValue')}
                      />
                    </Form.Item>
                  </Col>

                  <Col
                    md={4}
                    span={24}
                  >
                    <Flex gap={8}>
                      <Button
                        icon={<SvgIcon icon="ic:round-plus" />}
                        onClick={() => add(createDefaultBackendRouteQuery(), index + 1)}
                      />
                      <Button
                        icon={<SvgIcon icon="ic:round-remove" />}
                        onClick={() => remove(index)}
                      />
                    </Flex>
                  </Col>
                </Row>
              ))}

              {fields.length === 0 && (
                <Button
                  block
                  icon={<SvgIcon icon="ic:round-plus" />}
                  type="dashed"
                  onClick={() => add(createDefaultBackendRouteQuery())}
                >
                  {t('common.add')}
                </Button>
              )}
            </div>
          )}
        </Form.List>

        <Divider
          plain
          titlePlacement="start"
        >
          {t('page.manage.menu.badge')}
        </Divider>

        <Row gutter={16}>
          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.badgeTypeTitle')}
              name="badgeType"
            >
              <Select
                allowClear
                options={translateOptions(badgeTypeOptions)}
                placeholder={t('page.manage.menu.form.badgeType')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.badgeVariantTitle')}
              name="badgeVariant"
            >
              <Select
                allowClear
                options={translateOptions(badgeVariantOptions)}
                placeholder={t('page.manage.menu.form.badgeVariant')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.badgeValue')}
              name="badgeValue"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.badgeValue')}
              />
            </Form.Item>
          </Col>

          <Col
            md={12}
            span={24}
          >
            <Form.Item
              label={t('page.manage.menu.badgeValueKey')}
              name="badgeValueKey"
            >
              <Input
                allowClear
                placeholder={t('page.manage.menu.form.badgeValueKey')}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={t('page.manage.menu.badgeShowZero')}
              name="badgeShowZero"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t('common.yesOrNo.yes')}
                unCheckedChildren={t('common.yesOrNo.no')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default MenuOperateDrawer;

function createRequiredRule(message: string): FormRule {
  return {
    message,
    required: true
  };
}

function getLocalIconOption(icon: string) {
  return {
    label: (
      <Flex
        align="center"
        gap={12}
      >
        <SvgIcon
          className="text-icon"
          localIcon={icon}
        />
        <span>{icon}</span>
      </Flex>
    ),
    value: icon
  };
}

function translateRadioOptions<T extends string>(
  options: Common.Option<T, I18n.I18nKey>[],
  t: (key: I18n.I18nKey) => string
) {
  return options.map(option => ({
    label: t(option.label),
    value: option.value
  }));
}
