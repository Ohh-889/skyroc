import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadSettings } from '../src/pages/(app)/settings/modules/settings-config';

const storage = new Map<string, string>();

vi.stubGlobal('localStorage', {
  getItem(key: string) {
    return storage.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    storage.set(key, value);
  }
});

beforeEach(() => storage.clear());

describe('vitest smoke', () => {
  it('runs a normal unit test', () => {
    expect(1 + 1).toBe(2);
  });

  it('has test mode enabled while running tests', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});

describe('desktop settings migration', () => {
  it('fills the complete appearance defaults for an old settings payload', () => {
    localStorage.setItem('skyroc.desktop.settings', JSON.stringify({ accentColor: 'blue', reduceMotion: true }));

    const settings = loadSettings();

    expect(settings.accentColor).toBe('blue');
    expect(settings.motionMode).toBe('reduced');
    expect(settings.density).toBe('standard');
    expect(settings.schemaVersion).toBe(1);
    expect(settings.windowMaterial).toBe('auto');
  });
});
