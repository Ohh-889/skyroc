// oxlint-disable import/no-unassigned-import
import { createFileRoute } from '@tanstack/react-router';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import 'leaflet/dist/leaflet.css';
import type { LatLngTuple } from 'leaflet';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';

import { ExamplePanel, PluginPageHeader } from './modules/shared';

interface MapPaneProps {
  /** 地图初始化中心点，使用 Leaflet 的纬度、经度顺序。 */
  center: LatLngTuple;

  /** 地图标记和弹窗展示的地点名称。 */
  label: string;
}

const MapPane = (props: MapPaneProps) => {
  const { center, label } = props;

  return (
    <div className="h-560px overflow-hidden rounded-lg border border-border">
      <MapContainer
        center={center}
        className="h-full w-full"
        scrollWheelZoom
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker
          center={center}
          pathOptions={{ color: '#1677ff', fillColor: '#1677ff', fillOpacity: 0.24 }}
          radius={12}
        >
          <Popup>{label}</Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
};

const MapDemo = () => {
  const items: TabsProps['items'] = [
    {
      children: (
        <MapPane
          center={[22.546789983033168, 114.05834626586915]}
          label="深圳科技园"
        />
      ),
      key: 'shenzhen',
      label: '深圳'
    },
    {
      children: (
        <MapPane
          center={[39.98412, 116.307484]}
          label="北京中关村"
        />
      ),
      key: 'beijing',
      label: '北京'
    },
    {
      children: (
        <MapPane
          center={[31.2304, 121.4737]}
          label="上海陆家嘴"
        />
      ),
      key: 'shanghai',
      label: '上海'
    }
  ];

  return (
    <div className="space-y-4">
      <PluginPageHeader
        icon="mdi:map-outline"
        resources={[
          { label: 'React Leaflet', url: 'https://react-leaflet.js.org/' },
          { label: 'Leaflet', url: 'https://leafletjs.com/' },
          { label: 'OpenStreetMap', url: 'https://www.openstreetmap.org/' }
        ]}
        tags={['react-leaflet', 'Leaflet', 'OpenStreetMap']}
        title="地图示例"
      />
      <ExamplePanel
        icon="mdi:map-outline"
        title="React 地图容器"
      >
        <Tabs
          destroyOnHidden
          items={items}
        />
      </ExamplePanel>
    </div>
  );
};

export const Route = createFileRoute('/(admin)/plugin/map')({
  component: MapDemo,
  staticData: {
    i18nKey: 'route.plugin_map',
    menu: {
      icon: 'mdi:map-outline',
      order: 50
    },
    title: 'plugin_map'
  }
});
