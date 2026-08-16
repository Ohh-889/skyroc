// oxlint-disable unicorn/no-array-sort
/**
 * OKLCH Color Palette Generator - Professional Edition
 *
 * A world-class color palette generator inspired by Apple's Human Interface Guidelines. Uses OKLCH color space for
 * perceptually uniform color manipulation.
 *
 * Key features: 1. OKLCH color space - perceptually uniform (unlike HSL) 2. Data-driven lightness curve - based on
 * actual Tailwind analysis 3. Hue-aware chroma compensation - different curves for different hues 4. WCAG contrast
 * checking - ensures accessibility compliance 5. Apple-style hue rotation - warm/cool color temperature shifts 6.
 * Precise gamut mapping - maximizes color vibrancy within sRGB
 */

import { displayable, formatHex, oklch, parse, wcagContrast } from 'culori';
import type { Oklch } from 'culori';
import { getColorName } from '../shared';
import type { ColorPalette, ColorPaletteFamily, ColorPaletteMatch, ColorPaletteNumber } from '../types';

/** 单个档位的生成配置 */
type PaletteStep = {
  /** 档位号 */
  number: ColorPaletteNumber;
  /** 该档位的目标明度 */
  targetL: number;
};

/**
 * Tailwind color palette numbers with their target lightness values Based on actual analysis of Tailwind's official
 * palettes in OKLCH space These values are averaged from Blue, Red, and Green palettes
 */
const PALETTE_CONFIG: PaletteStep[] = [
  { number: 50, targetL: 0.974 },
  { number: 100, targetL: 0.943 },
  { number: 200, targetL: 0.897 },
  { number: 300, targetL: 0.829 },
  { number: 400, targetL: 0.742 },
  { number: 500, targetL: 0.661 },
  { number: 600, targetL: 0.583 },
  { number: 700, targetL: 0.507 },
  { number: 800, targetL: 0.439 },
  { number: 900, targetL: 0.389 },
  { number: 950, targetL: 0.269 }
];

/** 档位总数，用于校验自定义明度曲线 */
const PALETTE_STEP_COUNT = PALETTE_CONFIG.length;

/** Hue ranges for different color families Used for hue-specific chroma and lightness adjustments */
const HUE_FAMILIES = {
  red: { end: 40, peakL: 0.6, start: 0 },
  orange: { end: 70, peakL: 0.7, start: 40 },
  yellow: { end: 110, peakL: 0.85, start: 70 }, // Yellow needs higher L for vibrancy
  green: { end: 170, peakL: 0.65, start: 110 },
  cyan: { end: 210, peakL: 0.75, start: 170 }, // Cyan has limited chroma in sRGB
  blue: { end: 270, peakL: 0.55, start: 210 },
  purple: { end: 320, peakL: 0.55, start: 270 },
  pink: { end: 360, peakL: 0.6, start: 320 }
} as const;

/** 饱和色的最小色度，防止极亮/极暗档位褪成灰色 */
const MIN_CHROMA = 0.015;

/** 触发最小色度保护的输入色度阈值 */
const CHROMATIC_THRESHOLD = 0.05;

/** Get the hue family for a given hue value */
function getHueFamily(hue: number): (typeof HUE_FAMILIES)[keyof typeof HUE_FAMILIES] {
  const normalizedHue = normalizeHue(hue);

  for (const family of Object.values(HUE_FAMILIES)) {
    if (normalizedHue >= family.start && normalizedHue < family.end) {
      return family;
    }
  }
  return HUE_FAMILIES.red; // Default for hue near 360/0
}

/**
 * Calculate hue-aware chroma compensation factor based on lightness Different hues have different optimal lightness
 * ranges for maximum chroma
 *
 * This is based on the actual shape of the sRGB gamut in OKLCH space:
 *
 * - Yellow peaks at high lightness (~0.85)
 * - Blue/Purple peak at lower lightness (~0.55)
 * - Red/Green are in the middle (~0.6-0.65)
 */
function getHueAwareChromaCompensation(lightness: number, hue: number): number {
  const family = getHueFamily(hue);
  const peakL = family.peakL;

  const distance = Math.abs(lightness - peakL);
  const maxDistance = Math.max(peakL, 1 - peakL);
  const normalized = distance / maxDistance;

  // Asymmetric curve - steeper falloff towards edges
  // This better matches the actual sRGB gamut shape
  if (lightness < peakL) {
    // Darker than peak - moderate falloff
    return 1 - 0.55 * normalized ** 1.8;
  }
  // Lighter than peak - steeper falloff (white kills saturation faster)
  return 1 - 0.7 * normalized ** 1.5;
}

/** Normalize hue to [0, 360) range */
function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

/** Parse any color format to OKLCH */
function toOklch(color: string): Oklch | undefined {
  const parsed = parse(color);
  if (!parsed) return undefined;
  return oklch(parsed);
}

/**
 * 计算两个 OKLCH 颜色的感知距离（ΔEOK）
 *
 * 必须先把极坐标的 (c, h) 投影回 OKLab 的直角坐标 (a, b) 再算欧氏距离：直接对 l / c / h 三个分量做欧氏距离是错的——三者量纲不同（0-1 /
 * 0-0.4 / 0-360），且色相差是环形量，-4° 与 356° 等价。
 */
function getOklchDistance(color1: Oklch, color2: Oklch): number {
  const c1 = color1.c ?? 0;
  const c2 = color2.c ?? 0;

  const h1 = ((color1.h ?? 0) * Math.PI) / 180;
  const h2 = ((color2.h ?? 0) * Math.PI) / 180;

  const deltaL = color1.l - color2.l;
  const deltaA = c1 * Math.cos(h1) - c2 * Math.cos(h2);
  const deltaB = c1 * Math.sin(h1) - c2 * Math.sin(h2);

  return Math.hypot(deltaL, deltaA, deltaB);
}

/**
 * Convert OKLCH to hex with advanced gamut mapping Uses binary search to find the maximum displayable chroma This
 * preserves more color vibrancy than simple clamping
 */
function oklchToHex(color: Oklch): string {
  // First check if already displayable
  if (displayable(color)) {
    return formatHex(color);
  }

  // Binary search for maximum chroma that's displayable
  // This is more accurate than clampChroma for edge cases
  let low = 0;
  let high = color.c ?? 0;
  let bestColor = { ...color, c: 0 };

  // 12 iterations gives us ~0.001 precision
  for (let i = 0; i < 12; i += 1) {
    const mid = (low + high) / 2;
    const testColor = { ...color, c: mid };

    if (displayable(testColor)) {
      bestColor = testColor;
      low = mid;
    } else {
      high = mid;
    }
  }

  return formatHex(bestColor);
}

/**
 * Calculate Apple-style hue rotation Warm colors shift toward yellow when lighter, toward red when darker Cool colors
 * shift toward cyan when lighter, toward deep blue when darker
 *
 * This mimics how colors appear under natural lighting conditions
 */
function getAppleHueShift(hue: number, lightness: number): number {
  const normalizedHue = normalizeHue(hue);

  // Determine if warm or cool
  const isWarm = normalizedHue < 90 || normalizedHue >= 300;
  const isCool = normalizedHue >= 180 && normalizedHue < 300;

  // Calculate shift based on distance from middle lightness
  const lightnessDelta = lightness - 0.5;

  if (isWarm) {
    // Warm: lighter → yellow (increase hue), darker → red (decrease hue)
    // But cap the shift to prevent drastic color changes
    return lightnessDelta * 8; // max ±4 degrees
  }

  if (isCool) {
    // Cool: lighter → cyan, darker → deep blue
    return -lightnessDelta * 6; // max ±3 degrees
  }

  // Neutral zone (greens, teals) - minimal shift
  return -lightnessDelta * 3;
}

/** Format OKLCH values to CSS string e.g. oklch(58.5% 0.204 277.1) */
function formatOklchCss(l: number, c: number, h: number): string {
  const lPercent = (l * 100).toFixed(2).replace(/\.?0+$/, '');
  const cValue = c.toFixed(3).replace(/\.?0+$/, '');
  const hValue = h.toFixed(2).replace(/\.?0+$/, '');
  return `oklch(${lPercent}% ${cValue} ${hValue})`;
}

/** 生成色板时的内部参数 */
type PaletteBuildParams = {
  /** Whether to apply Apple-style hue rotation */
  appleHueShift: boolean;
  /** 输入色的色度 */
  chroma: number;
  /** Whether to apply chroma compensation */
  chromaCompensation: boolean;
  /** 各档位的目标明度 */
  config: PaletteStep[];
  /** 输入色的色相 */
  hue: number;
  /** 反推基准色度时参照的明度 */
  referenceL: number;
};

/**
 * 色板生成的唯一核心实现
 *
 * 先由「输入色度 + 参考明度」反推出未经补偿的基准色度，再按各档位的目标明度重新施加色度补偿与色相旋转，最后做 sRGB 色域映射。
 */
function buildPaletteStops(params: PaletteBuildParams): ColorPaletteWithOklch[] {
  const { appleHueShift, chroma, chromaCompensation, config, hue, referenceL } = params;

  const referenceCompensation = chromaCompensation ? getHueAwareChromaCompensation(referenceL, hue) : 1;
  const baseChroma = chroma / Math.max(referenceCompensation, 0.1);

  return config.map(({ number, targetL }) => {
    const compensation = chromaCompensation ? getHueAwareChromaCompensation(targetL, hue) : 1;

    let adjustedChroma = baseChroma * compensation;

    // Ensure minimum chroma for saturated colors, prevent graying out
    if (chroma > CHROMATIC_THRESHOLD) {
      adjustedChroma = Math.max(adjustedChroma, MIN_CHROMA);
    }

    const adjustedHue = appleHueShift ? normalizeHue(hue + getAppleHueShift(hue, targetL)) : normalizeHue(hue);

    const hex = oklchToHex({ c: adjustedChroma, h: adjustedHue, l: targetL, mode: 'oklch' });

    // 色域映射后实际落点可能与目标值有偏差，回读一次保证 oklch 字段与 hex 自洽
    const mapped = toOklch(hex);
    const finalL = mapped?.l ?? targetL;
    const finalC = mapped?.c ?? adjustedChroma;
    const finalH = mapped?.h ?? adjustedHue;

    return {
      hex,
      number,
      oklch: { c: finalC, h: finalH, l: finalL },
      oklchCss: formatOklchCss(finalL, finalC, finalH)
    };
  });
}

/** 解析输入色并取出安全的 OKLCH 分量，非法颜色直接抛错 */
function parseInputColor(color: string) {
  const parsed = toOklch(color);

  if (!parsed) {
    throw new Error(`Invalid color: ${color}`);
  }

  return {
    chroma: parsed.c ?? 0,
    hex: formatHex(parse(color)!),
    hue: parsed.h ?? 0,
    lightness: parsed.l
  };
}

/** 生成色族名称（小写、空格转连字符） */
function getPaletteName(color: string): string {
  return getColorName(color).toLowerCase().replace(/\s/g, '-');
}

/** 在给定配置中找到目标明度最接近输入明度的档位 */
function findClosestStep(config: PaletteStep[], lightness: number): PaletteStep {
  let closestStep = config[5];
  let minDiff = Infinity;

  for (const step of config) {
    const diff = Math.abs(step.targetL - lightness);

    if (diff < minDiff) {
      minDiff = diff;
      closestStep = step;
    }
  }

  return closestStep;
}

/** 丢弃 OKLCH 附加字段，还原为基础色板结构 */
function toBasicPalettes(stops: ColorPaletteWithOklch[]): ColorPalette[] {
  return stops.map(({ hex, number }) => ({ hex, number }));
}

/**
 * Generate a complete color palette from a single color
 *
 * Algorithm:
 *
 * 1. Convert input to OKLCH
 * 2. Find the closest palette step based on lightness
 * 3. Calculate the base chroma using hue-aware compensation
 * 4. Generate all 11 steps with:
 *
 *    - Target lightness from PALETTE_CONFIG
 *    - Chroma adjusted per-hue for optimal vibrancy
 *    - Apple-style hue rotation for natural appearance
 *    - Precise gamut mapping via binary search
 *
 * @param color - Any valid CSS color string
 * @returns ColorPaletteFamily with all 11 color stops
 */
export function generateOklchPalette(color: string): ColorPaletteFamily {
  return generateOklchPaletteAdvanced(color);
}

/** Advanced: Generate palette with custom configuration */
export interface OklchPaletteOptions {
  /**
   * Whether to apply Apple-style hue rotation
   *
   * @default true
   */
  appleHueShift?: boolean;
  /**
   * Whether to apply chroma compensation
   *
   * @default true
   */
  chromaCompensation?: boolean;
  /**
   * 反推基准色度时参照的档位
   *
   * 只影响整体色度强度，不会把输入色原样放进该档位——需要精确保留输入色请用 {@link generateOklchPaletteAnchored}。默认取目标明度最接近输入色的档位。
   */
  forceStep?: ColorPaletteNumber;
  /** Custom lightness curve (11 values, ordered from step 50 to step 950) */
  lightnessCurve?: number[];
}

/**
 * Generate palette with custom options
 *
 * @param color - Any valid CSS color string
 * @param options - 生成选项
 */
export function generateOklchPaletteAdvanced(color: string, options: OklchPaletteOptions = {}): ColorPaletteFamily {
  const { appleHueShift = true, chromaCompensation = true, forceStep, lightnessCurve } = options;

  if (lightnessCurve && lightnessCurve.length !== PALETTE_STEP_COUNT) {
    throw new Error(
      `Invalid lightnessCurve: expected ${PALETTE_STEP_COUNT} values, received ${lightnessCurve.length}`
    );
  }

  const { chroma, hue, lightness } = parseInputColor(color);

  const config = lightnessCurve
    ? PALETTE_CONFIG.map((step, index) => ({ ...step, targetL: lightnessCurve[index] }))
    : PALETTE_CONFIG;

  const referenceStep = forceStep
    ? (config.find(step => step.number === forceStep) ?? config[5])
    : findClosestStep(config, lightness);

  const stops = buildPaletteStops({
    appleHueShift,
    chroma,
    chromaCompensation,
    config,
    hue,
    referenceL: referenceStep.targetL
  });

  return { name: getPaletteName(color), palettes: toBasicPalettes(stops) };
}

/**
 * Generate a palette and find the matching color step
 *
 * @param color - Input color
 * @returns Full palette match with colorMap, main (500), and match colors
 */
export function getOklchColorPalette(color: string): ColorPaletteMatch {
  const family = generateOklchPalette(color);

  const colorMap = new Map<ColorPaletteNumber, ColorPalette>();
  family.palettes.forEach(palette => {
    colorMap.set(palette.number, palette);
  });

  // Find the closest match to the original input
  const inputOklch = toOklch(color);
  let matchPalette = family.palettes[5]; // default to 500

  if (inputOklch) {
    let minDelta = Infinity;

    for (const palette of family.palettes) {
      const paletteOklch = toOklch(palette.hex);

      if (paletteOklch) {
        const delta = getOklchDistance(inputOklch, paletteOklch);

        if (delta < minDelta) {
          minDelta = delta;
          matchPalette = palette;
        }
      }
    }
  }

  return {
    ...family,
    colorMap,
    main: colorMap.get(500)!,
    match: matchPalette
  };
}

/**
 * Get a specific palette color by number
 *
 * @param color - Input color
 * @param number - Palette number (50, 100, 200, ..., 950)
 * @returns Hex color string
 */
export function getOklchPaletteColorByNumber(color: string, number: ColorPaletteNumber): string {
  const family = generateOklchPalette(color);

  return family.palettes.find(palette => palette.number === number)!.hex;
}

/** Extended color palette with OKLCH values */
export interface ColorPaletteWithOklch extends ColorPalette {
  /** OKLCH values as numbers */
  oklch: { c: number; h: number; l: number };
  /** CSS oklch() string, e.g. "oklch(58.5% 0.204 277.1)" */
  oklchCss: string;
}

/** Extended palette family with OKLCH values */
export interface ColorPaletteFamilyWithOklch extends Omit<ColorPaletteFamily, 'palettes'> {
  /** Input color's OKLCH values */
  inputOklch: { c: number; h: number; l: number };
  /** Input color's CSS oklch() string */
  inputOklchCss: string;
  /** The step that best matches the input color */
  matchedStep: ColorPaletteNumber;
  palettes: ColorPaletteWithOklch[];
}

/**
 * 生成锚定输入色的色板
 *
 * 与 {@link generateOklchPalette} 的区别：输入色会被原样保留在匹配档位上（而不是被近似），其余档位的明度曲线整体平移以穿过该点。
 *
 * @example
 *   ```ts
 *   // Auto-detect step
 *   const palette = generateOklchPaletteAnchored('#6366F1');
 *   // palette.matchedStep === 500
 *   // palette.palettes[5].hex === '#6366f1' (exact input preserved!)
 *
 *   // Force to 600
 *   const palette600 = generateOklchPaletteAnchored('#6366F1', 600);
 *   // palette600.palettes[6].hex === '#6366f1'
 *   ```;
 *
 * @param color - Input color (will be preserved exactly in output)
 * @param forceStep - Force input to this step (default: auto-detect, prefer 500 for mid-tones)
 * @returns Palette with OKLCH values for each color
 */
export function generateOklchPaletteAnchored(
  color: string,
  forceStep?: ColorPaletteNumber
): ColorPaletteFamilyWithOklch {
  const { chroma, hex: inputHex, hue, lightness } = parseInputColor(color);

  // Determine matched step
  let matchedStep: ColorPaletteNumber;

  if (forceStep) {
    matchedStep = forceStep;
  } else {
    const closestStep = findClosestStep(PALETTE_CONFIG, lightness);

    // If input lightness is close to 500's target (within 0.12), prefer 500
    const step500 = PALETTE_CONFIG.find(step => step.number === 500)!;
    const diffTo500 = Math.abs(step500.targetL - lightness);

    matchedStep = diffTo500 < 0.12 ? 500 : closestStep.number;
  }

  // Build adjusted lightness curve that passes through input at matchedStep
  const matchedStepConfig = PALETTE_CONFIG.find(step => step.number === matchedStep)!;
  const lightnessDelta = lightness - matchedStepConfig.targetL;

  const config = PALETTE_CONFIG.map(step => {
    if (step.number === matchedStep) {
      return { ...step, targetL: lightness };
    }

    // 平移量在远离锚点的档位上逐步衰减，避免整条曲线被输入色带偏。
    // 这里用档位号差（而非索引差）作为距离，与 Tailwind 档位号的疏密分布保持一致。
    const distance = Math.abs(step.number - matchedStep) / 500;
    const adjustedDelta = lightnessDelta * (1 - distance * 0.6);
    const newL = Math.max(0.15, Math.min(0.98, step.targetL + adjustedDelta));

    return { ...step, targetL: newL };
  });

  const stops = buildPaletteStops({
    appleHueShift: true,
    chroma,
    chromaCompensation: true,
    config,
    hue,
    referenceL: lightness
  });

  const palettes = stops.map(stop =>
    stop.number === matchedStep
      ? {
          hex: inputHex,
          number: stop.number,
          oklch: { c: chroma, h: hue, l: lightness },
          oklchCss: formatOklchCss(lightness, chroma, hue)
        }
      : stop
  );

  return {
    inputOklch: { c: chroma, h: hue, l: lightness },
    inputOklchCss: formatOklchCss(lightness, chroma, hue),
    matchedStep,
    name: getPaletteName(color),
    palettes
  };
}

/**
 * Generate palette with OKLCH values included
 *
 * @deprecated 改用语义更清晰的 {@link generateOklchPaletteAnchored}，行为完全一致。
 */
export const generateOklchPaletteEx = generateOklchPaletteAnchored;

// ============================================================================
// WCAG Accessibility & Dark Mode Support
// ============================================================================

/** WCAG contrast level requirements */
export type WcagLevel = 'AA' | 'AAA';

/** Text size for WCAG contrast calculation */
export type TextSize = 'large' | 'normal';

/** Contrast check result for a palette */
export interface PaletteContrastInfo {
  /** Contrast ratios for each step against black (#000000) */
  contrastVsBlack: Map<ColorPaletteNumber, number>;
  /** Contrast ratios for each step against white (#ffffff) */
  contrastVsWhite: Map<ColorPaletteNumber, number>;
  /** The palette with contrast information */
  palette: ColorPaletteFamily;
  /** Steps that pass WCAG AA for normal text on black */
  passAAonBlack: ColorPaletteNumber[];
  /** Steps that pass WCAG AA for normal text on white */
  passAAonWhite: ColorPaletteNumber[];
  /** Recommended text color (white or black) for each step */
  recommendedTextColor: Map<ColorPaletteNumber, '#000000' | '#ffffff'>;
}

/**
 * Get WCAG contrast ratio between two colors
 *
 * @param color1 - First color (any CSS color string)
 * @param color2 - Second color (any CSS color string)
 * @returns Contrast ratio (1 to 21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const c1 = parse(color1);
  const c2 = parse(color2);
  if (!c1 || !c2) return 1;
  return wcagContrast(c1, c2);
}

/**
 * Check if contrast ratio meets WCAG requirements
 *
 * @param ratio - Contrast ratio
 * @param level - WCAG level ('AA' or 'AAA')
 * @param textSize - Text size ('normal' or 'large')
 * @returns Whether the contrast passes
 */
export function meetsWcagContrast(ratio: number, level: WcagLevel = 'AA', textSize: TextSize = 'normal'): boolean {
  const requirements = {
    AA: { large: 3, normal: 4.5 },
    AAA: { large: 4.5, normal: 7 }
  };
  return ratio >= requirements[level][textSize];
}

/**
 * Generate a palette with full WCAG contrast information
 *
 * @param color - Input color
 * @returns Palette with contrast analysis
 */
export function generateOklchPaletteWithContrast(color: string): PaletteContrastInfo {
  const palette = generateOklchPalette(color);

  const contrastVsWhite = new Map<ColorPaletteNumber, number>();
  const contrastVsBlack = new Map<ColorPaletteNumber, number>();
  const passAAonWhite: ColorPaletteNumber[] = [];
  const passAAonBlack: ColorPaletteNumber[] = [];
  const recommendedTextColor = new Map<ColorPaletteNumber, '#000000' | '#ffffff'>();

  for (const { hex, number } of palette.palettes) {
    const vsWhite = getContrastRatio(hex, '#ffffff');
    const vsBlack = getContrastRatio(hex, '#000000');

    contrastVsWhite.set(number, vsWhite);
    contrastVsBlack.set(number, vsBlack);

    if (meetsWcagContrast(vsWhite)) {
      passAAonWhite.push(number);
    }
    if (meetsWcagContrast(vsBlack)) {
      passAAonBlack.push(number);
    }

    // Recommend text color based on higher contrast
    recommendedTextColor.set(number, vsWhite > vsBlack ? '#ffffff' : '#000000');
  }

  return {
    contrastVsBlack,
    contrastVsWhite,
    palette,
    passAAonBlack,
    passAAonWhite,
    recommendedTextColor
  };
}

/**
 * Dark mode optimized lightness curve
 *
 * 明度整体压暗以适配深色背景，但档位语义与 {@link PALETTE_CONFIG} 保持一致——50 依然最亮、950 依然最暗。深色主题中需要深色背景时应取 900/950，
 * 而不是依赖档位号被翻转。
 */
const DARK_MODE_LIGHTNESS: number[] = [
  0.96, // 50 - lightest
  0.91,
  0.85,
  0.78,
  0.7,
  0.6, // 500 - main
  0.5,
  0.4,
  0.32,
  0.25,
  0.18 // 950 - darkest
];

/**
 * Generate a dark mode optimized palette
 *
 * @param color - Input color
 * @returns Dark mode optimized palette
 */
export function generateDarkModePalette(color: string): ColorPaletteFamily {
  return generateOklchPaletteAdvanced(color, {
    appleHueShift: true,
    chromaCompensation: true,
    lightnessCurve: DARK_MODE_LIGHTNESS
  });
}

/**
 * Find the best palette step for text on a given background color Ensures WCAG AA compliance
 *
 * @param paletteColor - Base color for the palette
 * @param backgroundColor - Background color to check against
 * @param preferDark - Prefer darker text colors when possible
 * @returns Best palette number for accessible text, or null if none found
 */
export function findAccessibleTextColor(
  paletteColor: string,
  backgroundColor: string,
  preferDark = true
): ColorPaletteNumber | null {
  const palette = generateOklchPalette(paletteColor);

  // Sort by lightness (darker first if preferDark, lighter first otherwise)
  const sortedPalettes = palette.palettes
    .map(item => ({ ...item, lightness: toOklch(item.hex)?.l ?? 0.5 }))
    .sort((a, b) => (preferDark ? a.lightness - b.lightness : b.lightness - a.lightness));

  for (const { hex, number } of sortedPalettes) {
    const ratio = getContrastRatio(hex, backgroundColor);
    if (meetsWcagContrast(ratio)) {
      return number;
    }
  }

  return null;
}
