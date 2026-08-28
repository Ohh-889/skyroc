import { SvgIcon } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';
import { Card, Select, Space, Typography } from 'antd';
import { useState } from 'react';

import { localIcons, pluginIcons } from './modules/plugin-data';
import { ExamplePanel, PluginPageHeader } from './modules/shared';

interface IconGridProps {
  /** 图标名称集合，支持 Iconify 或本地图标名称。 */
  icons: string[];

  /** 是否按本地图标前缀解析。 */
  local?: boolean;
}

const IconGrid = (props: IconGridProps) => {
  const { icons, local = false } = props;

  return (
    <div className="grid grid-cols-4 gap-3 md:grid-cols-8 lg:grid-cols-10">
      {icons.map(icon => (
        <Card
          className="text-center"
          key={icon}
          size="small"
        >
          <SvgIcon
            className="mx-auto text-28px text-primary"
            icon={local ? undefined : icon}
            localIcon={local ? icon : undefined}
          />
          <Typography.Text
            className="mt-2 block text-xs"
            ellipsis
          >
            {icon}
          </Typography.Text>
        </Card>
      ))}
    </div>
  );
};

const IconDemo = () => {
  const [selectedIcon, setSelectedIcon] = useState(pluginIcons[0]);

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:emoticon"
        resources={[{ label: 'Iconify', url: 'https://icon-sets.iconify.design/' }]}
        tags={['@iconify/react', '@shell/ui/compose']}
        title="图标示例"
      />
      <ExamplePanel
        icon="mdi:emoticon"
        title="Iconify 图标"
      >
        <IconGrid icons={pluginIcons} />
      </ExamplePanel>
      <ExamplePanel
        icon="mdi:form-select"
        title="图标选择器"
      >
        <Space
          className="w-full"
          orientation="vertical"
        >
          <Select
            className="w-full max-w-360px"
            options={pluginIcons.map(icon => ({ label: icon, value: icon }))}
            value={selectedIcon}
            showSearch
            onChange={setSelectedIcon}
          />
          <div className="h-90px flex items-center justify-center rounded-lg bg-layout">
            <SvgIcon
              className="text-52px text-primary"
              icon={selectedIcon}
            />
          </div>
        </Space>
      </ExamplePanel>
      <ExamplePanel
        icon="mdi:image-filter-center-focus"
        title="本地图标"
      >
        <IconGrid
          icons={localIcons}
          local
        />
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/icon')({
  component: IconDemo,
  staticData: {
    i18nKey: 'route.plugin_icon',
    menu: {
      icon: 'mdi:emoticon',
      order: 40
    },
    title: 'plugin_icon'
  }
});
