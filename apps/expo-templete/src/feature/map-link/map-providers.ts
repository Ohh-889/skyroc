import { Linking, Platform } from 'react-native';

import type { MapProviderId, MapTarget, TravelMode } from './types';

/** 调起方名称，显示在高德 / 百度的「来自 xxx」 */
const SOURCE_APP = 'expo-templete';

/**
 * 腾讯地图的 referer，必须是腾讯位置服务后台申请的 key。
 *
 * 没配 key 时腾讯地图会被整个摘掉：调起链接照样能拉起 App，但落地就是「来源未授权」的报错页，
 * 与其给用户一个必然失败的选项，不如当它不存在。
 */
const TENCENT_KEY = process.env.EXPO_PUBLIC_TENCENT_MAP_KEY ?? '';

/** 高德的 t 参数 */
const AMAP_MODE: Record<TravelMode, string> = { bike: '3', bus: '1', drive: '0', walk: '2' };

/** 百度的 mode 参数 */
const BAIDU_MODE: Record<TravelMode, string> = { bike: 'riding', bus: 'transit', drive: 'driving', walk: 'walking' };

/** 腾讯的 type 参数 */
const TENCENT_MODE: Record<TravelMode, string> = { bike: 'bike', bus: 'bus', drive: 'drive', walk: 'walk' };

/** Apple 的 dirflg 只有驾车 / 步行 / 公交三档，骑行归到步行 */
const APPLE_MODE: Record<TravelMode, string> = { bike: 'w', bus: 'r', drive: 'd', walk: 'w' };

/** 高德 H5 导航页的 mode 参数，用于一个地图 App 都没装时的兜底 */
const AMAP_WEB_MODE: Record<TravelMode, string> = { bike: 'ride', bus: 'bus', drive: 'car', walk: 'walk' };

const enc = encodeURIComponent;

/** 一个可调起的地图 App */
export interface MapProvider {
  /** 拼装调起链接 */
  buildUrl: (target: MapTarget, mode: TravelMode) => string;

  /** 未安装时的下载地址，按平台分开 */
  download: Record<'android' | 'ios', string>;

  /** 唯一标识，同时作为 ActionSheet 选项的 value */
  id: MapProviderId;

  /** 展示名称 */
  name: string;

  /** 只在这些平台出现，不写表示两端都有 */
  platforms?: ('android' | 'ios')[];

  /** 系统自带、不需要探测就一定能打开 */
  preinstalled?: boolean;

  /**
   * 仅用于 canOpenURL 探测的裸 scheme。
   *
   * 不拿 buildUrl 的完整链接去探测：iOS 只按 scheme 匹配 LSApplicationQueriesSchemes，
   * Android 反而会因为 query 里的中文和 `|` 让 Intent 解析出意料之外的结果。
   */
  probeScheme: string;
}

const ALL_PROVIDERS: MapProvider[] = [
  {
    // dev=0 声明传入的就是高德自家的 GCJ-02 坐标，不需要它再纠偏一次
    buildUrl: ({ lat, lng, name }, mode) =>
      Platform.OS === 'ios'
        ? `iosamap://path?sourceApplication=${enc(SOURCE_APP)}&dlat=${lat}&dlon=${lng}&dname=${enc(name)}&dev=0&t=${AMAP_MODE[mode]}`
        : `amapuri://route/plan/?sourceApplication=${enc(SOURCE_APP)}&dlat=${lat}&dlon=${lng}&dname=${enc(name)}&dev=0&t=${AMAP_MODE[mode]}`,
    download: {
      android: 'https://mobile.amap.com',
      ios: 'https://apps.apple.com/cn/app/id461703208'
    },
    id: 'amap',
    name: '高德地图',
    probeScheme: Platform.OS === 'ios' ? 'iosamap://' : 'amapuri://'
  },
  {
    // destination 的两段都是 `键:值`，latlng 用冒号不是等号；coord_type 让百度把 GCJ-02 换算成自家的 BD-09
    buildUrl: ({ lat, lng, name }, mode) =>
      `baidumap://map/direction?destination=latlng:${lat},${lng}|name:${enc(name)}&coord_type=gcj02&mode=${BAIDU_MODE[mode]}&src=${enc(SOURCE_APP)}`,
    download: {
      android: 'https://map.baidu.com',
      ios: 'https://apps.apple.com/cn/app/id452186370'
    },
    id: 'baidu',
    name: '百度地图',
    probeScheme: 'baidumap://'
  },
  {
    buildUrl: ({ address, lat, lng, name }, mode) =>
      `qqmap://map/routeplan?type=${TENCENT_MODE[mode]}&to=${enc(name)}&tocoord=${lat},${lng}&toaddr=${enc(address ?? name)}&referer=${enc(TENCENT_KEY)}`,
    download: {
      android: 'https://map.qq.com/mobile',
      ios: 'https://apps.apple.com/cn/app/id481623196'
    },
    id: 'tencent',
    name: '腾讯地图',
    probeScheme: 'qqmap://'
  },
  {
    // 只能给坐标：daddr 一旦是经纬度，Apple 就不再理会 q，终点气泡上显示不了名称。
    // 反过来用 q + ll 倒是能带上名称，但那是「在附近搜索」，dirflg 会被忽略、压根不起导航。
    buildUrl: ({ lat, lng }, mode) => `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=${APPLE_MODE[mode]}`,
    download: {
      android: '',
      ios: 'https://www.apple.com.cn/maps/'
    },
    id: 'apple',
    name: 'Apple 地图',
    platforms: ['ios'],
    preinstalled: true,
    probeScheme: 'maps://'
  }
];

/** 当前构建下真正可选的地图，没配 key 的腾讯地图在这一步就被摘掉 */
export const MAP_PROVIDERS = ALL_PROVIDERS.filter(provider => provider.id !== 'tencent' || Boolean(TENCENT_KEY));

/**
 * 探测本机装了哪些地图 App。
 *
 * canOpenURL 需要预先声明可探测的 scheme，否则一律返回 false：
 * iOS 看 Info.plist 的 LSApplicationQueriesSchemes，Android 11+ 看 AndroidManifest 的 queries，
 * 两边都由 `plugins/with-map-app-links.js` 在 prebuild 时写入。
 */
export const getAvailableMapProviders = async () => {
  const os = Platform.OS === 'ios' ? 'ios' : 'android';

  const candidates = MAP_PROVIDERS.filter(provider => !provider.platforms || provider.platforms.includes(os));

  const results = await Promise.all(
    candidates.map(provider =>
      provider.preinstalled ? Promise.resolve(true) : Linking.canOpenURL(provider.probeScheme).catch(() => false)
    )
  );

  return candidates.filter((_, index) => results[index]);
};

/** 一个地图 App 都没装时的兜底：高德的 H5 导航页，浏览器直接能开 */
export const buildWebFallbackUrl = ({ lat, lng, name }: MapTarget, mode: TravelMode) =>
  `https://uri.amap.com/navigation?to=${lng},${lat},${enc(name)}&mode=${AMAP_WEB_MODE[mode]}&coordinate=gaode&callnative=1`;
