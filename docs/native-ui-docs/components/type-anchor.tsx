import type { ReactNode } from 'react';
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
  'Array',
  'Component',
  'Date',
  'ElementType',
  'Exclude',
  'Extract',
  'GestureResponderEvent',
  'Map',
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
  'RefObject',
  'RegExp',
  'Required',
  'Set',
  'StyleProp',
  'TextStyle',
  'View',
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

function resolveTypeHref(typeName: string): string {
  if (typeName in TYPE_REGISTRY) {
    return TYPE_REGISTRY[typeName];
  }
  return `#${toTypeAnchorId(typeName)}`;
}

export function typeToReactNode(type?: string): ReactNode {
  if (!type) return <>-</>;

  return (
    <>
      {splitTypeParts(type).map((part, idx) =>
        part.isLink ? (
          <a
            key={idx}
            className="cursor-pointer border-b-2 border-dashed border-fd-primary/30 text-fd-primary no-underline duration-200 hover:border-fd-primary"
            href={resolveTypeHref(part.text)}
          >
            {part.text}
          </a>
        ) : (
          <span key={idx}>{part.text}</span>
        )
      )}
    </>
  );
}
