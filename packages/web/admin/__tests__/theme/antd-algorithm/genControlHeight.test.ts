import genControlHeight from '@shell/theme/antd-algorithm/shared/genControlHeight';
import type { SeedToken } from 'antd/es/theme/internal';
import { describe, expect, it } from 'vitest';

function makeToken(controlHeight: number): SeedToken {
  return { controlHeight } as SeedToken;
}

describe('genControlHeight', () => {
  it('controlHeight=32 时应生成标准三级高度', () => {
    const result = genControlHeight(makeToken(32));

    expect(result.controlHeightSM).toBe(24); // 32 * 0.75
    expect(result.controlHeightXS).toBe(16); // 32 * 0.5
    expect(result.controlHeightLG).toBe(40); // 32 * 1.25
  });

  it('controlHeight=40 时应按比例缩放', () => {
    const result = genControlHeight(makeToken(40));

    expect(result.controlHeightSM).toBe(30);
    expect(result.controlHeightXS).toBe(20);
    expect(result.controlHeightLG).toBe(50);
  });

  it('controlHeight=0 时应全部返回 0', () => {
    const result = genControlHeight(makeToken(0));

    expect(result.controlHeightSM).toBe(0);
    expect(result.controlHeightXS).toBe(0);
    expect(result.controlHeightLG).toBe(0);
  });

  it('SM 始终小于 LG', () => {
    const result = genControlHeight(makeToken(32));

    expect(result.controlHeightSM).toBeLessThan(result.controlHeightLG);
  });
});
