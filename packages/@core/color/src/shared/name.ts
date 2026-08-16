import { colorNameMap, colorNames } from '../constant';
import { getHex, getHsl, getRgb } from './colord';

/** 色名表条目的预解析形式，避免每次匹配时重复解析 1500+ 条数据 */
type ParsedColorName = {
  b: number;
  g: number;
  h: number;
  l: number;
  name: string;
  r: number;
  s: number;
};

/** 色名匹配结果缓存的容量上限，超出后整体清空（主题色数量有限，不需要 LRU） */
const NAME_CACHE_LIMIT = 512;

let parsedColorNames: ParsedColorName[] | null = null;

const nameCache = new Map<string, string>();

/**
 * 惰性预解析色名表
 *
 * 色名表有 1500+ 条，若每次调用都重新解析 rgb/hsl，单次色名匹配就要构造 3000+ 个 colord 实例——这是调色板生成的主要开销来源。
 * 这里在首次调用时解析一次并常驻，后续匹配只做纯数值运算。
 */
function getParsedColorNames(): ParsedColorName[] {
  if (!parsedColorNames) {
    parsedColorNames = colorNames.map(([hexValue, name]) => {
      const { b, g, r } = getRgb(hexValue);
      const { h, l, s } = getHsl(hexValue);

      return { b, g, h, l, name, r, s };
    });
  }

  return parsedColorNames;
}

/**
 * 获取颜色的自然语言色名
 *
 * 精确命中色名表时直接返回，否则在 RGB + HSL 混合距离下取最近的色名。
 *
 * @param color 任意合法颜色值
 */
export function getColorName(color: string) {
  const hex = getHex(color);

  const cached = nameCache.get(hex);

  if (cached) {
    return cached;
  }

  const exactName = colorNameMap[hex];

  if (exactName) {
    cacheColorName(hex, exactName);

    return exactName;
  }

  const rgb = getRgb(hex);
  const hsl = getHsl(hex);

  let minDistance = Infinity;
  let name = '';

  for (const item of getParsedColorNames()) {
    const rgbDistance = (rgb.r - item.r) ** 2 + (rgb.g - item.g) ** 2 + (rgb.b - item.b) ** 2;
    const hslDistance = (hsl.h - item.h) ** 2 + (hsl.s - item.s) ** 2 + (hsl.l - item.l) ** 2;

    const distance = rgbDistance + hslDistance * 2;

    if (distance < minDistance) {
      minDistance = distance;
      name = item.name;
    }
  }

  cacheColorName(hex, name);

  return name;
}

/** 写入色名缓存，超过容量上限时整体清空 */
function cacheColorName(hex: string, name: string) {
  if (nameCache.size >= NAME_CACHE_LIMIT) {
    nameCache.clear();
  }

  nameCache.set(hex, name);
}
