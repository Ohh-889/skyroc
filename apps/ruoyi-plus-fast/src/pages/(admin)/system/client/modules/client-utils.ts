import type { DictDataItem } from '@/service/api/system-dict';

export interface ClientOption {
  label: string;
  value: string;
}

export const FALLBACK_GRANT_OPTIONS: ClientOption[] = [
  { label: '密码认证', value: 'password' },
  { label: '短信认证', value: 'sms' },
  { label: '邮件认证', value: 'email' },
  { label: '小程序认证', value: 'xcx' },
  { label: '社交认证', value: 'social' }
];

export const FALLBACK_DEVICE_OPTIONS: ClientOption[] = [
  { label: 'PC', value: 'pc' },
  { label: 'Android', value: 'android' },
  { label: 'iOS', value: 'ios' },
  { label: '小程序', value: 'xcx' }
];

export function createClientOptions(items: DictDataItem[] | undefined, fallback: ClientOption[]) {
  if (!items?.length) return fallback;
  return items.map(item => ({ label: item.dictLabel, value: item.dictValue }));
}

export function getClientOptionLabel(options: ClientOption[], value: null | string) {
  if (!value) return '未指定';
  return options.find(option => option.value === value)?.label ?? value;
}

export function formatClientDuration(seconds: number) {
  if (seconds === -1) return '永不过期';
  if (seconds % 86400 === 0) return `${seconds / 86400} 天`;
  if (seconds % 3600 === 0) return `${seconds / 3600} 小时`;
  if (seconds % 60 === 0) return `${seconds / 60} 分钟`;
  return `${seconds} 秒`;
}
