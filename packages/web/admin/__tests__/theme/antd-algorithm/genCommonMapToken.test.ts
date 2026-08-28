import genCommonMapToken from '@shell/theme/antd-algorithm/shared/genCommonMapToken';
import type { SeedToken } from 'antd/es/theme/internal';
import { describe, expect, it } from 'vitest';

function makeToken(overrides: Partial<SeedToken> = {}): SeedToken {
  return {
    borderRadius: 6,
    lineWidth: 1,
    motionBase: 0,
    motionUnit: 0.1,
    ...overrides
  } as SeedToken;
}

describe('genCommonMapToken', () => {
  describe('motion duration', () => {
    it('motionBase=0, motionUnit=0.1 时应生成三级动画时长', () => {
      const result = genCommonMapToken(makeToken({ motionBase: 0, motionUnit: 0.1 }));

      expect(result.motionDurationFast).toBe('0.1s'); // 0 + 0.1
      expect(result.motionDurationMid).toBe('0.2s'); // 0 + 0.1*2
      expect(result.motionDurationSlow).toBe('0.3s'); // 0 + 0.1*3
    });

    it('fast < mid < slow', () => {
      const result = genCommonMapToken(makeToken());
      const fast = Number.parseFloat(result.motionDurationFast);
      const mid = Number.parseFloat(result.motionDurationMid);
      const slow = Number.parseFloat(result.motionDurationSlow);

      expect(fast).toBeLessThan(mid);
      expect(mid).toBeLessThan(slow);
    });
  });

  describe('lineWidthBold', () => {
    it('lineWidth=1 时 bold 应为 2', () => {
      const result = genCommonMapToken(makeToken({ lineWidth: 1 }));
      expect(result.lineWidthBold).toBe(2);
    });

    it('lineWidth=2 时 bold 应为 3', () => {
      const result = genCommonMapToken(makeToken({ lineWidth: 2 }));
      expect(result.lineWidthBold).toBe(3);
    });
  });

  describe('radius tokens（委托给 genRadiusMapToken）', () => {
    it('borderRadius=6 时应生成正确的圆角', () => {
      const result = genCommonMapToken(makeToken({ borderRadius: 6 }));

      expect(result.borderRadius).toBe(6);
      expect(result.borderRadiusSM).toBe(4);
      expect(result.borderRadiusLG).toBe(8);
      expect(result.borderRadiusXS).toBe(2);
    });

    it('borderRadius=0 时所有圆角应为 0', () => {
      const result = genCommonMapToken(makeToken({ borderRadius: 0 }));

      expect(result.borderRadius).toBe(0);
      expect(result.borderRadiusSM).toBe(0);
      expect(result.borderRadiusLG).toBe(0);
    });
  });
});
