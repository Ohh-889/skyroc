import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { MessageQuery, MessageType } from '../mock-api';

/** 一种消息类型的图标与配色 */
export interface MessageTypeMeta {
  /** 图标取色，只接受 `accent-*` 工具类 */
  accent: string;

  icon: keyof typeof MaterialCommunityIcons.glyphMap;

  label: string;

  /** 文字色类名 */
  text: string;

  /** 底色类名 */
  tint: string;
}

/**
 * 每种消息类型的图标与配色，头像底色、类型标签、引用块都从这里取。
 *
 * ClassName 一律写成**完整字面量**：uniwind 在构建期扫源码里的字符串，`bg-${type}` 拼出来的 类名它扫不到，运行时就是没有样式。
 */
export const MESSAGE_TYPE_META: Record<MessageType, MessageTypeMeta> = {
  comment: {
    accent: 'accent-info',
    icon: 'comment-text-outline',
    label: '评论',
    text: 'text-info',
    tint: 'bg-info/15'
  },
  like: {
    accent: 'accent-destructive',
    icon: 'heart',
    label: '赞',
    text: 'text-destructive',
    tint: 'bg-destructive/15'
  },
  system: { accent: 'accent-warning', icon: 'shield-check', label: '系统', text: 'text-warning', tint: 'bg-warning/15' }
};

/** 消息类型筛选项 */
export const MESSAGE_FILTERS: { key: MessageQuery['type']; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'comment', label: '评论' },
  { key: 'like', label: '赞' },
  { key: 'system', label: '系统' }
];
