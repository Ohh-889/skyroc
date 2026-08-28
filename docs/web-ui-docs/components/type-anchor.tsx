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
  isLink?: boolean;
  text: string;
}

const BUILTIN_TYPE_NAMES = new Set([
  'Array',
  'Component',
  'Date',
  'DeepPartial',
  'ElementType',
  'Exclude',
  'Extract',
  'HTMLAttributes',
  'HTMLElement',
  'Map',
  'NonNullable',
  'Omit',
  'Partial',
  'Pick',
  'Promise',
  'ReactNode',
  'Readonly',
  'Record',
  'RegExp',
  'Required',
  'Set',
  'StandardSchema',
  'Values',
  'VNode'
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

    const isLink = !BUILTIN_TYPE_NAMES.has(word);
    parts.push({ text: word, isLink });
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
            href={resolveTypeHref(part.text)}
            className="text-fd-primary border-b-2 border-dashed border-fd-primary/30 hover:border-fd-primary duration-200 cursor-pointer no-underline"
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
