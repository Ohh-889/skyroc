import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { TypeLink } from './type-link';
import { TYPE_REGISTRY } from './type-registry';

export function toTypeAnchorId(typeName: string) {
  const normalized = typeName
    .trim()
    .replace(/[^A-Za-z0-9_]+/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return `type-${normalized}`;
}

interface TypePart {
  /** 是否渲染成可跳转的类型链接 */
  isLink?: boolean;
  /** 片段文本 */
  text: string;
}

/** 内置 / 三方类型（React、TS 工具类型、React Native 原语），不生成锚点链接 */
const BUILTIN_TYPE_NAMES = new Set([
  'AccessibilityRole',
  'Animated',
  'AnimatedRef',
  'Array',
  'BottomSheetModal',
  'BottomSheetModalProps',
  'Component',
  'ComponentType',
  'Date',
  'Dayjs',
  'DeepPartial',
  'ElementType',
  'Exclude',
  'ExpoImageProps',
  'Extract',
  'FlatList',
  'GestureResponderEvent',
  'ImageErrorEventData',
  'ImageLoadEventData',
  'ImageStyle',
  'ImageTransition',
  'Map',
  'ModalProps',
  'NonNullable',
  'Omit',
  'Partial',
  'Pick',
  'PressableProps',
  'Promise',
  'ReactElement',
  'ReactNode',
  'Readonly',
  'Record',
  'Ref',
  'RefAttributes',
  'RefObject',
  'RegExp',
  'Required',
  'SFSymbol',
  'ScrollView',
  'Set',
  'SharedRefType',
  'SharedValue',
  'Slots',
  'StandardSchemaV1',
  'StandardSchemaV1NormalizedIssue',
  'StyleProp',
  'Text',
  'TextInput',
  'TextInputProps',
  'TextStyle',
  'Values',
  'View',
  'ViewProps',
  'ViewStyle'
]);

function splitTypeParts(typeText: string): TypePart[] {
  if (!typeText) {
    return [{ text: '—' }];
  }

  const parts: TypePart[] = [];
  const re = /\b[A-Z][A-Za-z0-9_]*\b/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(typeText))) {
    const [word] = match;
    const start = match.index;

    if (start > lastIndex) {
      parts.push({ text: typeText.slice(lastIndex, start) });
    }

    parts.push({ isLink: !BUILTIN_TYPE_NAMES.has(word), text: word });
    lastIndex = start + word.length;
  }

  if (lastIndex < typeText.length) {
    parts.push({ text: typeText.slice(lastIndex) });
  }

  return parts.length ? parts : [{ text: typeText }];
}

/**
 * 注册表里的跨页地址，只有目标页面真的存在时才返回。
 *
 * 类型先在注册表登记、对应组件文档还没写的情况很常见（如 ImageProps / InputProps）， 这时候链过去就是 404，不如不链。
 */
function resolveRegistryHref(typeName: string): string | undefined {
  const target = TYPE_REGISTRY[typeName];

  if (!target) return undefined;

  const [pathname] = target.split('#');
  const exists = source.getPages().some(page => page.url === pathname);

  return exists ? target : undefined;
}

export function typeToReactNode(type?: string): ReactNode {
  if (!type) return <>-</>;

  return (
    <>
      {splitTypeParts(type).map((part, idx) =>
        part.isLink ? (
          <TypeLink
            key={idx}
            anchorId={toTypeAnchorId(part.text)}
            name={part.text}
            registryHref={resolveRegistryHref(part.text)}
          />
        ) : (
          <span key={idx}>{part.text}</span>
        )
      )}
    </>
  );
}
