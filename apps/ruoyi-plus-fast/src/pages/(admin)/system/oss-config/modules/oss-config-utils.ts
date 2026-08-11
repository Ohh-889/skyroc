import type { OssConfigAccessPolicy, OssConfigId, OssConfigItem } from '@/service/api/system-oss-config';

/** 后端 status 是 RuoYi 口径：0 才是默认。界面上不暴露这个反直觉的数字。 */
export const OSS_CONFIG_STATUS_OPTIONS = [
  { label: '默认', value: '0' },
  { label: '备用', value: '1' }
] as const;

export const ACCESS_POLICY_LABELS: Record<OssConfigAccessPolicy, string> = {
  '0': '私有',
  '1': '公开',
  '2': '自定义'
};

export const ACCESS_POLICY_COLORS: Record<OssConfigAccessPolicy, string> = {
  '0': 'gold',
  '1': 'green',
  '2': 'blue'
};

export const ACCESS_POLICY_OPTIONS = (['0', '1', '2'] as OssConfigAccessPolicy[]).map(value => ({
  label: ACCESS_POLICY_LABELS[value],
  value
}));

/** 种子数据里的四条内置配置，后端拒绝删除，界面也不给入口。 */
const BUILT_IN_CONFIG_IDS = new Set(['1', '2', '3', '4']);

export function isBuiltInConfig(id: OssConfigId) {
  return BUILT_IN_CONFIG_IDS.has(String(id));
}

export function isDefaultConfig(config: OssConfigItem) {
  return config.status === '0';
}

/** endpoint 不含协议，协议由 isHttps 决定，拼起来才是真正的访问地址。 */
export function buildEndpointUrl(config: Pick<OssConfigItem, 'endpoint' | 'isHttps'>) {
  if (!config.endpoint) return '';

  return `${config.isHttps === 'Y' ? 'https' : 'http'}://${config.endpoint}`;
}

/**
 * AccessKey 只留头尾。
 *
 * 接口目前仍然返回完整值，遮罩是前端自己加的一层；它能挡住肩窥和截图外泄， 但拿到列表权限就等于拿到了凭证，真正的收敛得在后端做。
 */
export function maskAccessKey(accessKey: null | string | undefined) {
  const value = (accessKey ?? '').trim();

  if (!value) return '—';
  if (value.length <= 6) return `${value.slice(0, 1)}****`;

  return `${value.slice(0, 2)}****${value.slice(-4)}`;
}

/** 配置名规则：字母开头，往后只允许字母、数字、下划线和连字符。 */
export const CONFIG_KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;

/** endpoint 带协议时后端会返回 422，这里先在字段级拦下来。 */
export function hasProtocolPrefix(endpoint: string) {
  return /^https?:\/\//i.test(endpoint.trim());
}
