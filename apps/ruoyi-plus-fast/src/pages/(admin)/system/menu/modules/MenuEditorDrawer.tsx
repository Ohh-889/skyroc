import { SvgIcon } from '@skyroc/web-ui-compose';
import { Button, Col, Divider, Drawer, Flex, Form, Input, InputNumber, Radio, Row, Select } from 'antd';
import { useEffect } from 'react';

import type { MenuId, MenuItem, MenuSavePayload, MenuType } from '@/service/api/system-menu';

import { collectDescendantIds, getMenuPath, getMenuTypeIcon, isSameMenuId } from './menu-utils';

type EditorMode = 'create' | 'update';

interface MenuEditorDrawerProps {
  /** 固定表单类型；按钮权限入口固定为 F。 */
  fixedType?: MenuType;
  /** 保存请求是否正在执行。 */
  loading: boolean;
  /** 当前编辑的菜单；新增时为空。 */
  menu?: MenuItem;
  /** 后端返回的完整菜单资源列表。 */
  menus: MenuItem[];
  /** 当前新增或修改模式。 */
  mode: EditorMode;
  /** 关闭编辑抽屉。 */
  onClose: () => void;
  /** 提交经过表单校验的菜单数据。 */
  onSubmit: (values: MenuSavePayload) => void;
  /** 抽屉是否打开。 */
  open: boolean;
  /** 新增菜单时预设的父菜单。 */
  parentId?: MenuId;
}

const MENU_TYPE_OPTIONS = [
  { label: '目录', value: 'M' },
  { label: '菜单', value: 'C' },
  { label: '按钮', value: 'F' }
] satisfies Array<{ label: string; value: MenuType }>;

const MenuEditorDrawer = (props: MenuEditorDrawerProps) => {
  const { fixedType, loading, menu, menus, mode, onClose, onSubmit, open, parentId } = props;

  const [form] = Form.useForm<MenuSavePayload>();
  const menuType = Form.useWatch('menuType', form) ?? fixedType ?? 'M';
  const visible = Form.useWatch('visible', form) ?? '0';
  const isFrame = Form.useWatch('isFrame', form) ?? '1';
  const iconValue = Form.useWatch('icon', form) ?? '#';
  const watchedParentId = Form.useWatch('parentId', form);
  const parentOptions = createParentOptions(menus, menu?.menuId, menuType);
  const drawerTitle = getDrawerTitle();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(createFormValues(menu, parentId, fixedType ?? menu?.menuType));
  }, [fixedType, form, menu, open, parentId]);

  function getDrawerTitle() {
    if (mode === 'update') {
      return menuType === 'F' ? '编辑按钮权限' : '编辑菜单';
    }
    if (menuType === 'F') return '新增按钮权限';
    if (parentId !== undefined && String(parentId) !== '0') return '新增子菜单';
    return '新增根菜单';
  }

  function validatePath(_rule: unknown, value: string | undefined) {
    if (!value?.trim()) return Promise.reject(new Error('请输入路由地址'));
    if (isFrame === '0' && !/^https?:\/\//iu.test(value.trim())) {
      return Promise.reject(new Error('外链地址必须以 http:// 或 https:// 开头'));
    }
    return Promise.resolve();
  }

  function validateParent(_rule: unknown, value: MenuId | undefined) {
    if (value === undefined || value === null) {
      return Promise.reject(new Error('请选择上级菜单'));
    }
    if (!parentOptions.some(option => isSameMenuId(option.value, value))) {
      return Promise.reject(new Error('请选择符合当前菜单类型的上级菜单'));
    }
    return Promise.resolve();
  }

  function handleSubmit(values: MenuSavePayload) {
    onSubmit(values);
  }

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex justify="space-between">
          <span className="text-11px text-tertiary">保存后会刷新菜单列表和动态路由缓存</span>
          <Flex gap={8}>
            <Button onClick={onClose}>取消</Button>
            <Button loading={loading} type="primary" onClick={() => form.submit()}>
              保存
            </Button>
          </Flex>
        </Flex>
      }
      open={open}
      size={720}
      title={
        <div>
          <div>{drawerTitle}</div>
          <div className="mt-2px text-11px text-tertiary font-normal">
            上级：{resolveParentLabel(menus, watchedParentId ?? parentId)}
          </div>
        </div>
      }
      onClose={onClose}
    >
      <Form<MenuSavePayload> form={form} layout="vertical" onFinish={handleSubmit}>
        <Divider plain titlePlacement="start">
          归属与类型
        </Divider>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              dependencies={['menuType']}
              label="上级菜单"
              name="parentId"
              rules={[{ validator: validateParent }]}
            >
              <Select showSearch optionFilterProp="label" options={parentOptions} placeholder="请选择上级菜单" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="菜单类型" name="menuType" rules={[{ message: '请选择菜单类型', required: true }]}>
              <Radio.Group
                buttonStyle="solid"
                disabled={fixedType === 'F'}
                optionType="button"
                options={MENU_TYPE_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider plain titlePlacement="start">
          基础信息
        </Divider>
        <Row gutter={16}>
          <Col md={12} span={24}>
            <Form.Item
              label="菜单名称"
              name="menuName"
              rules={[
                { message: '请输入菜单名称', required: true },
                { max: 50, message: '菜单名称不能超过 50 个字符' }
              ]}
            >
              <Input allowClear placeholder="例如：菜单管理" />
            </Form.Item>
          </Col>
          <Col md={12} span={24}>
            <Form.Item label="显示排序" name="orderNum" rules={[{ message: '请输入显示排序', required: true }]}>
              <InputNumber className="w-full" min={0} precision={0} />
            </Form.Item>
          </Col>
          {menuType !== 'F' ? (
            <Col span={24}>
              <Form.Item label="菜单图标" name="icon">
                <Input
                  allowClear
                  placeholder="Iconify 图标，例如 ph:menu"
                  suffix={
                    <SvgIcon
                      className="text-icon"
                      icon={iconValue.includes(':') ? iconValue : getMenuTypeIcon(menuType)}
                    />
                  }
                />
              </Form.Item>
            </Col>
          ) : null}
        </Row>

        {menuType !== 'F' ? (
          <>
            <Divider plain titlePlacement="start">
              路由配置
            </Divider>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <Form.Item label="打开方式" name="isFrame">
                  <Radio.Group>
                    <Radio value="1">内部路由</Radio>
                    <Radio value="0">外部链接</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col md={12} span={24}>
                <Form.Item label="显示状态" name="visible">
                  <Radio.Group>
                    <Radio value="0">显示</Radio>
                    <Radio value="1">隐藏</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="路由地址" name="path" rules={[{ validator: validatePath }]}>
                  <Input allowClear placeholder="例如 menu；外链需填写完整网址" />
                </Form.Item>
              </Col>
              {menuType === 'C' ? (
                <>
                  <Col md={12} span={24}>
                    <Form.Item
                      label="组件路径"
                      name="component"
                      rules={[
                        { message: '请输入组件路径', required: true },
                        { max: 255, message: '组件路径不能超过 255 个字符' }
                      ]}
                    >
                      <Input allowClear placeholder="system/menu/index" />
                    </Form.Item>
                  </Col>
                  <Col md={12} span={24}>
                    <Form.Item label="路由参数" name="queryParam" rules={[{ validator: validateQueryParam }]}>
                      <Input allowClear placeholder='例如 {"source":"menu"}' />
                    </Form.Item>
                  </Col>
                  <Col md={12} span={24}>
                    <Form.Item label="页面缓存" name="isCache">
                      <Radio.Group>
                        <Radio value="0">缓存</Radio>
                        <Radio value="1">不缓存</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </>
              ) : null}
              {visible === '1' ? (
                <Col md={12} span={24}>
                  <Form.Item label="激活路由" name="remark">
                    <Input allowClear placeholder="例如 /system/menu" />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </>
        ) : null}

        <Divider plain titlePlacement="start">
          权限与状态
        </Divider>
        <Row gutter={16}>
          {menuType !== 'M' ? (
            <Col span={24}>
              <Form.Item
                label="权限字符"
                name="perms"
                rules={[
                  {
                    message: '按钮权限必须填写权限字符',
                    required: menuType === 'F'
                  },
                  {
                    message: '权限字符格式应为 模块:资源:动作',
                    pattern: /^$|^[a-zA-Z0-9_]+:[a-zA-Z0-9_*]+:[a-zA-Z0-9_*]+$/u
                  }
                ]}
              >
                <Input allowClear placeholder="例如 system:menu:add" />
              </Form.Item>
            </Col>
          ) : null}
          <Col span={24}>
            <Form.Item label="节点状态" name="status">
              <Radio.Group>
                <Radio value="0">正常</Radio>
                <Radio value="1">停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

function createFormValues(
  menu: MenuItem | undefined,
  parentId: MenuId | undefined,
  preferredType: MenuType | undefined
): MenuSavePayload {
  if (menu) {
    return {
      component: menu.component,
      icon: menu.icon,
      isCache: menu.isCache,
      isFrame: menu.isFrame,
      menuName: menu.menuName,
      menuType: menu.menuType,
      orderNum: menu.orderNum,
      parentId: menu.parentId,
      path: menu.path,
      perms: menu.perms,
      queryParam: menu.queryParam,
      remark: menu.remark,
      status: menu.status,
      visible: menu.visible
    };
  }

  return {
    component: null,
    icon: '#',
    isCache: '0',
    isFrame: '1',
    menuName: '',
    menuType: preferredType ?? 'M',
    orderNum: 1,
    parentId: parentId ?? 0,
    path: '',
    perms: null,
    queryParam: null,
    remark: '',
    status: '0',
    visible: '0'
  };
}

function createParentOptions(menus: MenuItem[], editingMenuId: MenuId | undefined, menuType: MenuType) {
  const excludedIds = new Set(
    editingMenuId === undefined ? [] : collectDescendantIds(menus, editingMenuId).map(String)
  );
  const options = menus
    .filter(menu => {
      if (excludedIds.has(String(menu.menuId))) return false;
      if (menuType === 'F') return menu.menuType === 'C';
      return menu.menuType === 'M';
    })
    .map(menu => ({
      label: getMenuPath(menus, menu.menuId),
      value: menu.menuId
    }));

  if (menuType !== 'F') options.unshift({ label: '主类目', value: 0 });
  return options;
}

function resolveParentLabel(menus: MenuItem[], parentId: MenuId | undefined) {
  if (parentId === undefined || isSameMenuId(parentId, 0)) return '主类目';
  return getMenuPath(menus, parentId) || '未知菜单';
}

function validateQueryParam(_rule: unknown, value: string | undefined) {
  if (!value?.trim()) return Promise.resolve();

  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return Promise.reject(new Error('路由参数必须是 JSON 对象'));
    }
    return Promise.resolve();
  } catch {
    return Promise.reject(new Error('路由参数必须符合 JSON 格式'));
  }
}

export type { EditorMode };
export default MenuEditorDrawer;
