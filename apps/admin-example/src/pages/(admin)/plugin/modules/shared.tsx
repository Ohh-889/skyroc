import { SvgIcon } from '@shell/ui/compose';
import { Card, Space, Tag, Typography } from 'antd';
import type { ReactNode } from 'react';

export interface PluginResource {
  /** 资源名称，通常是插件或文档站点名称。 */
  label: string;

  /** 点击后打开的外部资源地址。 */
  url: string;
}

interface PluginPageHeaderProps {
  /** 标题前展示的 Iconify 图标名称。 */
  icon: string;

  /** 资源链接，帮助开发者追溯插件文档或源码。 */
  resources?: PluginResource[];

  /** 当前示例关联的 React 或浏览器运行能力。 */
  tags?: string[];

  /** 页面主标题，用于说明当前示例覆盖的插件能力。 */
  title: string;
}

interface ExamplePanelProps {
  /** 面板内容，承载具体插件示例。 */
  children: ReactNode;

  /** 标题前展示的 Iconify 图标名称。 */
  icon?: string;

  /** 面板标题，用于区分同一页面内的不同示例。 */
  title: string;
}

export const PluginPageHeader = (props: PluginPageHeaderProps) => {
  const { icon, resources = [], tags = [], title } = props;

  return (
    <Card className="card-wrapper" size="small" variant="borderless">
      <Space className="w-full" orientation="vertical" size={12}>
        <Space align="center" wrap>
          <SvgIcon className="text-28px text-primary" icon={icon} />
          <Typography.Title className="m-0" level={3}>
            {title}
          </Typography.Title>
        </Space>
        {tags.length > 0 && (
          <Space wrap>
            {tags.map(tag => (
              <Tag color="processing" key={tag}>
                {tag}
              </Tag>
            ))}
          </Space>
        )}
        {resources.length > 0 && (
          <Space wrap>
            {resources.map(resource => (
              <Typography.Link href={resource.url} key={resource.url} rel="noreferrer" target="_blank">
                {resource.label}
              </Typography.Link>
            ))}
          </Space>
        )}
      </Space>
    </Card>
  );
};

export const ExamplePanel = (props: ExamplePanelProps) => {
  const { children, icon, title } = props;

  return (
    <Card
      className="card-wrapper"
      size="small"
      title={
        <Space>
          {icon && <SvgIcon className="text-primary" icon={icon} />}
          <span>{title}</span>
        </Space>
      }
      variant="borderless"
    >
      {children}
    </Card>
  );
};
