import { showActionSheet, showToast } from '@skyroc/native-ui';
import { Linking } from 'react-native';

import { buildWebFallbackUrl, getAvailableMapProviders } from './map-providers';
import type { MapProviderId, MapTarget, TravelMode } from './types';

/** OpenMapLink 的可选配置 */
export interface OpenMapLinkOptions {
  /** 取消按钮文案，传空串则不显示取消按钮 */
  cancelText?: string;

  /** 出行方式，默认驾车 */
  mode?: TravelMode;

  /** 面板标题 */
  title?: string;
}

/**
 * 调起链接并吞掉异常。
 *
 * openURL 在「scheme 无人接管」时是 reject 而不是返回 false，调用点都拿不住这个 promise，
 * 抛出去就是一条 unhandled rejection 加上用户看不到任何提示。
 */
const openUrl = async (url: string) => {
  try {
    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.warn('[openMapLink] 调起地图失败', error);
    showToast('地图打开失败，请重试');
    return false;
  }
};

/**
 * 弹出地图选择面板，并调起用户选中的地图 App。
 *
 * 写成普通函数而不是 hook：整个流程没有任何 React 状态，面板由 showActionSheet 挂在 Portal 上，
 * 包成 hook 只会平白给调用点加上「必须在组件顶层调用」的限制。
 *
 * @returns 实际被调起的地图 id；用户取消、或调起失败时返回 null。
 */
export const openMapLink = async (
  target: MapTarget,
  options: OpenMapLinkOptions = {}
): Promise<MapProviderId | null> => {
  const { cancelText = '取消', mode = 'drive', title = '选择地图' } = options;

  const providers = await getAvailableMapProviders();

  // 一个地图 App 都没装：弹一个空面板毫无意义，直接把 H5 导航页顶上去
  if (providers.length === 0) {
    await openUrl(buildWebFallbackUrl(target, mode));
    return null;
  }

  const result = await showActionSheet({
    actions: providers.map(provider => ({ name: provider.name, value: provider.id })),
    cancelText,
    description: target.address ?? target.name,
    title
  });

  if (!result) return null;

  const picked = providers.find(provider => provider.id === result.action.value);

  // 面板的 value 就是从 providers 生成的，理论上必中；找不到只可能是列表被并发改过
  if (!picked) return null;

  const opened = await openUrl(picked.buildUrl(target, mode));

  return opened ? picked.id : null;
};
