/** 支持调起的地图 App */
export type MapProviderId = 'amap' | 'apple' | 'baidu' | 'tencent';

/** 跨地图统一的出行方式，各家再各自映射成自己的参数名和取值 */
export type TravelMode = 'bike' | 'bus' | 'drive' | 'walk';

/**
 * 导航目的地。
 *
 * 坐标一律按 GCJ-02（火星坐标）传入：高德 / 腾讯原生就是 GCJ-02，百度靠 coord_type=gcj02 现场换算， Apple 地图在中国区同样是 GCJ-02。后端若给的是 WGS-84（GPS
 * 原始值），必须先转换再传进来， 否则整条链路都会稳定偏移几百米——这类偏移不会报错，只会让用户导到隔壁街。
 */
export interface MapTarget {
  /** 目的地详细地址，目前只有腾讯地图会额外展示 */
  address?: string;

  /** 纬度（GCJ-02） */
  lat: number;

  /** 经度（GCJ-02） */
  lng: number;

  /** 目的地名称，显示在地图的终点气泡上 */
  name: string;
}
