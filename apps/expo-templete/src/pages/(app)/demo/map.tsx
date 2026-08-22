import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, Cell, CellGroup, Tag, Text } from '@skyroc/native-ui';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { MAP_PROVIDERS, MapLinkButton, getAvailableMapProviders, openMapLink } from '@/feature/map-link';
import type { MapProvider, MapTarget, TravelMode } from '@/feature/map-link';

const Icon = withUniwind(MaterialCommunityIcons);

/** 一个演示目的地 */
interface DemoTarget extends MapTarget {
  /** 列表左侧图标 */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

/**
 * 演示用目的地。
 *
 * 坐标是 GCJ-02（高德坐标拾取器取的近似值），正是 MapTarget 要求的坐标系——
 * 换成后端返回的 WGS-84 会整体偏几百米，这里的取值本身就是一条隐性用例。
 */
const TARGETS: DemoTarget[] = [
  {
    address: '北京市东城区东长安街',
    icon: 'flag-outline',
    lat: 39.908722,
    lng: 116.397499,
    name: '天安门'
  },
  {
    address: '上海市浦东新区世纪大道 1 号',
    icon: 'tower-fire',
    lat: 31.239795,
    lng: 121.499809,
    name: '东方明珠'
  },
  {
    address: '广东省广州市海珠区阅江西路 222 号',
    icon: 'city-variant-outline',
    lat: 23.106389,
    lng: 113.324722,
    name: '广州塔'
  }
];

const MODES: { label: string; value: TravelMode }[] = [
  { label: '驾车', value: 'drive' },
  { label: '公交', value: 'bus' },
  { label: '步行', value: 'walk' },
  { label: '骑行', value: 'bike' }
];

/** 当前平台上有可能出现的地图，Apple 地图在 Android 上压根不该列出来 */
const PLATFORM_PROVIDERS = MAP_PROVIDERS.filter(
  provider => !provider.platforms || provider.platforms.includes(Platform.OS === 'ios' ? 'ios' : 'android')
);

const MapDemoScreen = () => {
  const [mode, setMode] = useState<TravelMode>('drive');
  const [installed, setInstalled] = useState<MapProvider[] | null>(null);
  const [lastResult, setLastResult] = useState('尚未调起');

  const handleOpen = async (target: DemoTarget) => {
    const provider = await openMapLink(target, { mode, title: `导航到${target.name}` });

    setLastResult(provider ? `${target.name} → 已调起 ${provider}` : `${target.name} → 已取消`);
  };

  useEffect(() => {
    // 页面还没卸载才写回 state：探测是异步的，用户可能已经返回上一页
    let active = true;

    getAvailableMapProviders().then(providers => {
      if (active) setInstalled(providers);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 py-5"
    >
      <View className="gap-2">
        <Text
          size="xl"
          weight="semibold"
        >
          调起第三方地图导航
        </Text>

        <Text
          color="muted"
          size="sm"
        >
          openMapLink 先用 canOpenURL 探测装了哪些地图，再用 ActionSheet 让用户选，最后拼 scheme 调起。一个都没装时兜底跳高德 H5 导航页。
        </Text>
      </View>

      <CellGroup
        inset
        title="本机探测结果"
      >
        <Cell
          center
          title="已安装的地图"
          subtitle={
            <Text
              color="muted"
              size="xs"
            >
              探测依赖 iOS 的 LSApplicationQueriesSchemes 与 Android 的 queries，两者由 plugins/with-map-app-links.js 写入，改完要重新 prebuild
            </Text>
          }
          trailing={
            <View className="max-w-40 flex-row flex-wrap justify-end gap-1">
              {installed === null ? (
                <Text
                  color="muted"
                  size="sm"
                >
                  探测中…
                </Text>
              ) : (
                PLATFORM_PROVIDERS.map(provider => {
                  const isInstalled = installed.some(item => item.id === provider.id);

                  return (
                    <Tag
                      color={isInstalled ? 'success' : 'muted'}
                      key={provider.id}
                      variant={isInstalled ? 'tonal' : 'outline'}
                    >
                      {provider.name}
                    </Tag>
                  );
                })
              )}
            </View>
          }
        />
      </CellGroup>

      <View className="gap-2">
        <Text
          size="sm"
          weight="medium"
        >
          出行方式
        </Text>

        <View className="flex-row gap-2">
          {MODES.map(item => (
            <Button
              className="flex-1"
              key={item.value}
              size="sm"
              variant={item.value === mode ? 'solid' : 'outline'}
              onPress={() => setMode(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </View>

        <Text
          color="muted"
          size="xs"
        >
          同一个 mode 会翻译成高德的 t、百度的 mode、腾讯的 type 和 Apple 的 dirflg——Apple 没有骑行档，选骑行时它按步行走。
        </Text>
      </View>

      <CellGroup
        inset
        title="点一条就弹面板"
      >
        {TARGETS.map(target => (
          <Cell
            showArrow
            key={target.name}
            subtitle={target.address}
            title={target.name}
            onPress={() => handleOpen(target)}
            leading={
              <View className="size-9 items-center justify-center rounded-xl bg-primary/10">
                <Icon
                  colorClassName="accent-primary"
                  name={target.icon}
                  size={20}
                />
              </View>
            }
          />
        ))}
      </CellGroup>

      <View className="gap-2">
        <Text
          size="sm"
          weight="medium"
        >
          MapLinkButton
        </Text>

        <MapLinkButton
          block
          mode={mode}
          target={TARGETS[0]}
          title="导航到天安门"
          onOpened={provider => setLastResult(provider ? `按钮 → 已调起 ${provider}` : '按钮 → 已取消')}
        >
          导航到天安门
        </MapLinkButton>

        <Text
          color="muted"
          size="xs"
        >
          上次结果：{lastResult}
        </Text>
      </View>
    </ScrollView>
  );
};

export default MapDemoScreen;
