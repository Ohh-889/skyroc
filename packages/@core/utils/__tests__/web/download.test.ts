import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  downloadFileFromBase64,
  downloadFileFromBlob,
  downloadFileFromBlobPart,
  downloadFileFromImageUrl,
  downloadFileFromUrl,
  triggerDownload,
  urlToBase64
} from '../../src/web/download';

// ==================== mock DOM ====================

function createMockLink() {
  const link = {
    click: vi.fn(),
    dispatchEvent: vi.fn(),
    download: '',
    href: '',
    rel: '',
    remove: vi.fn(),
    style: { display: '' }
  };
  return link;
}

function setupLinkMock() {
  const link = createMockLink();
  vi.spyOn(document, 'createElement').mockReturnValue(link as any);
  vi.spyOn(document.body, 'appendChild').mockImplementation(node => node);
  return link;
}

type MockImageInstance = Record<string, any> & {
  __listeners: Map<string, Set<(event: Event) => void>>;
};

function emitMockImageEvent(image: MockImageInstance, type: string) {
  const listeners = image.__listeners.get(type);

  listeners?.forEach(listener => {
    listener.call(image, new Event(type));
  });
}

function addMockImageEventListener(this: MockImageInstance, type: string, listener: (event: Event) => void) {
  const listeners = this.__listeners.get(type) ?? new Set();

  listeners.add(listener);
  this.__listeners.set(type, listeners);
}

function removeMockImageEventListener(this: MockImageInstance, type: string, listener: (event: Event) => void) {
  this.__listeners.get(type)?.delete(listener);
}

function createMockImage(overrides: Record<string, any> = {}) {
  const img: Record<string, any> = {
    crossOrigin: '',
    naturalHeight: 100,
    naturalWidth: 200,
    ...overrides
  };

  function MockImage(this: MockImageInstance) {
    Object.assign(this, img);
    this.__listeners = new Map();
  }

  MockImage.prototype.addEventListener = addMockImageEventListener;
  MockImage.prototype.removeEventListener = removeMockImageEventListener;

  Object.defineProperty(MockImage.prototype, 'src', {
    get() {
      return '';
    },
    set(_: string) {
      const self = this;
      setTimeout(() => {
        if (overrides.failOnLoad) {
          emitMockImageEvent(self, 'error');
        } else {
          emitMockImageEvent(self, 'load');
        }
      }, 0);
    }
  });

  return MockImage;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// ==================== triggerDownload ====================

describe('triggerDownload', () => {
  it('应创建 a 标签并触发点击', () => {
    const link = setupLinkMock();

    triggerDownload('data:text/plain,hello', 'test.txt');

    expect(link.href).toBe('data:text/plain,hello');
    expect(link.download).toBe('test.txt');
    expect(link.click).toHaveBeenCalledTimes(1);
    expect(link.remove).toHaveBeenCalledTimes(1);
  });

  it('未指定文件名应使用默认名', () => {
    const link = setupLinkMock();

    triggerDownload('data:text/plain,hello', undefined);

    expect(link.download).toBe('downloaded_file');
  });

  it('blob: URL 应在延迟后 revokeObjectURL', () => {
    vi.useFakeTimers();
    setupLinkMock();
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    triggerDownload('blob:http://localhost/abc', 'file.pdf');

    expect(revokeSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    expect(revokeSpy).toHaveBeenCalledWith('blob:http://localhost/abc');

    vi.useRealTimers();
  });

  it('非 blob: URL 不应调用 revokeObjectURL', () => {
    vi.useFakeTimers();
    setupLinkMock();
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    triggerDownload('https://example.com/file.pdf', 'file.pdf');

    vi.advanceTimersByTime(500);

    expect(revokeSpy).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('click 抛错时应回退 dispatchEvent', () => {
    const link = setupLinkMock();
    link.click.mockImplementation(() => {
      throw new Error('click failed');
    });

    triggerDownload('data:text/plain,hello', 'test.txt');

    expect(link.dispatchEvent).toHaveBeenCalledTimes(1);
  });
});

// ==================== downloadFileFromBase64 ====================

describe('downloadFileFromBase64', () => {
  it('应触发下载', () => {
    const link = setupLinkMock();

    downloadFileFromBase64({
      fileName: 'test.pdf',
      source: 'data:application/pdf;base64,AAAA'
    });

    expect(link.href).toBe('data:application/pdf;base64,AAAA');
    expect(link.download).toBe('test.pdf');
    expect(link.click).toHaveBeenCalled();
  });

  it('不传 fileName 应使用默认名', () => {
    const link = setupLinkMock();

    downloadFileFromBase64({ source: 'data:text/plain;base64,AA' });

    expect(link.download).toBe('downloaded_file');
  });

  it('无效 source 应抛错', () => {
    expect(() => downloadFileFromBase64({ source: '' })).toThrow('Invalid Base64 data.');
    expect(() => downloadFileFromBase64({ source: null as any })).toThrow('Invalid Base64 data.');
  });
});

// ==================== downloadFileFromBlob ====================

describe('downloadFileFromBlob', () => {
  it('应通过 Blob URL 触发下载', () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const blob = new Blob(['hello'], { type: 'text/plain' });
    downloadFileFromBlob({ fileName: 'test.txt', source: blob });

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(link.download).toBe('test.txt');
    expect(link.click).toHaveBeenCalled();
  });

  it('非 Blob 应抛出 TypeError', () => {
    expect(() => downloadFileFromBlob({ source: 'not a blob' as any })).toThrow('Invalid Blob data.');
  });
});

// ==================== downloadFileFromBlobPart ====================

describe('downloadFileFromBlobPart', () => {
  it('字符串应被包装为 Blob 并下载', () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    downloadFileFromBlobPart({ fileName: 'data.bin', source: 'raw string data' });

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(link.download).toBe('data.bin');
    expect(link.click).toHaveBeenCalled();
  });

  it('Blob 实例应直接使用', () => {
    setupLinkMock();
    const createURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const blob = new Blob(['data']);
    downloadFileFromBlobPart({ fileName: 'test.bin', source: blob });

    expect(createURLSpy).toHaveBeenCalledWith(blob);
  });

  it('ArrayBuffer 应被包装为 Blob', () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const buffer = new ArrayBuffer(8);
    downloadFileFromBlobPart({ fileName: 'test.bin', source: buffer });

    expect(link.click).toHaveBeenCalled();
  });
});

// ==================== downloadFileFromUrl ====================

describe('downloadFileFromUrl', () => {
  it('无效 source 应抛错', async () => {
    await expect(downloadFileFromUrl({ source: '' })).rejects.toThrow('Invalid URL.');
    await expect(downloadFileFromUrl({ source: null as any })).rejects.toThrow('Invalid URL.');
    await expect(downloadFileFromUrl({ source: 123 as any })).rejects.toThrow('Invalid URL.');
  });

  it('fetch 成功时应通过 blob 下载', async () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const mockBlob = new Blob(['content'], { type: 'text/plain' });
    const mockHeaders = new Headers();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
        headers: mockHeaders,
        ok: true,
        type: 'cors'
      })
    );

    await downloadFileFromUrl({ fileName: 'test.txt', source: 'https://example.com/file.txt' });

    expect(fetch).toHaveBeenCalled();
    expect(link.click).toHaveBeenCalled();
  });

  it('fetch 成功且有 Content-Disposition filename* 应使用 header 文件名', async () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const mockBlob = new Blob(['content']);
    const mockHeaders = new Headers({
      'content-disposition': "attachment; filename*=UTF-8''report%202024.pdf"
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
        headers: mockHeaders,
        ok: true,
        type: 'cors'
      })
    );

    await downloadFileFromUrl({ source: 'https://example.com/dl' });

    expect(link.download).toBe('report 2024.pdf');
  });

  it('fetch 成功且有 Content-Disposition filename="xxx" 应使用 header 文件名', async () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const mockBlob = new Blob(['content']);
    const mockHeaders = new Headers({
      'content-disposition': 'attachment; filename="data.csv"'
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
        headers: mockHeaders,
        ok: true,
        type: 'cors'
      })
    );

    await downloadFileFromUrl({ source: 'https://example.com/export' });

    expect(link.download).toBe('data.csv');
  });

  it('fetch 成功且有 Content-Disposition filename=xxx（不带引号）应使用 header 文件名', async () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const mockBlob = new Blob(['content']);
    const mockHeaders = new Headers({
      'content-disposition': 'attachment; filename=report.pdf'
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
        headers: mockHeaders,
        ok: true,
        type: 'cors'
      })
    );

    await downloadFileFromUrl({ source: 'https://example.com/export' });

    expect(link.download).toBe('report.pdf');
  });

  it('无 header/fileName 时应从 URL path 解析文件名', async () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const mockBlob = new Blob(['content']);
    const mockHeaders = new Headers();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
        headers: mockHeaders,
        ok: true,
        type: 'cors'
      })
    );

    await downloadFileFromUrl({ source: 'https://example.com/files/document.pdf?v=2#section' });

    expect(link.download).toBe('document.pdf');
  });

  it('Content-Disposition 无法匹配文件名时应回退到 URL path', async () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const mockBlob = new Blob(['content']);
    const mockHeaders = new Headers({
      'content-disposition': 'inline'
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
        headers: mockHeaders,
        ok: true,
        type: 'cors'
      })
    );

    await downloadFileFromUrl({ source: 'https://example.com/files/report.pdf' });

    expect(link.download).toBe('report.pdf');
  });

  it('res.ok 为 false 时应回退 openWindow', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        type: 'cors'
      })
    );

    await downloadFileFromUrl({ source: 'https://example.com/file.txt' });

    expect(openSpy).toHaveBeenCalled();
  });

  it('res.type 为 opaque 时应回退 openWindow', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        type: 'opaque'
      })
    );

    await downloadFileFromUrl({ source: 'https://example.com/file.txt' });

    expect(openSpy).toHaveBeenCalled();
  });

  it('fetch 抛错时应回退 openWindow', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('CORS')));

    await downloadFileFromUrl({ source: 'https://example.com/file.txt' });

    expect(openSpy).toHaveBeenCalled();
  });

  it('iOS 设备应直接 openWindow 而不 fetch', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
    });

    await downloadFileFromUrl({ source: 'https://example.com/file.txt' });

    expect(openSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();

    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: ''
    });
  });

  it('iPadOS 设备（MacIntel + touch）应直接 openWindow', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    Object.defineProperty(navigator, 'platform', {
      configurable: true,
      value: 'MacIntel'
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      value: 5
    });

    await downloadFileFromUrl({ source: 'https://example.com/file.txt' });

    expect(openSpy).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();

    Object.defineProperty(navigator, 'platform', {
      configurable: true,
      value: ''
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      value: 0
    });
  });
});

// ==================== downloadFileFromImageUrl ====================

describe('downloadFileFromImageUrl', () => {
  it('无效 source 应抛错', async () => {
    await expect(downloadFileFromImageUrl({ source: '' })).rejects.toThrow('Invalid image URL.');
    await expect(downloadFileFromImageUrl({ source: null as any })).rejects.toThrow('Invalid image URL.');
  });

  it('应通过 urlToBase64 转换后下载', async () => {
    const link = setupLinkMock();
    const fakeDataURL = 'data:image/png;base64,FAKE';

    const mockCtx = { drawImage: vi.fn() };

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        return {
          getContext: () => mockCtx,
          height: 0,
          toDataURL: () => fakeDataURL,
          width: 0
        } as any;
      }
      return link as any;
    });

    vi.spyOn(document.body, 'appendChild').mockImplementation(node => node);
    vi.stubGlobal('Image', createMockImage());

    await downloadFileFromImageUrl({
      fileName: 'photo.png',
      source: 'https://example.com/photo.png'
    });

    expect(link.click).toHaveBeenCalled();
    expect(link.download).toBe('photo.png');
  });
});

// ==================== urlToBase64 ====================

describe('urlToBase64', () => {
  it('非浏览器环境应 reject', async () => {
    vi.stubGlobal('window', undefined);

    await expect(urlToBase64('https://example.com/img.png')).rejects.toThrow('Not in browser environment.');
  });

  it('图片加载成功应返回 dataURL', async () => {
    const fakeDataURL = 'data:image/png;base64,ABC123';

    const mockCtx = { drawImage: vi.fn() };

    vi.spyOn(document, 'createElement').mockReturnValue({
      getContext: () => mockCtx,
      height: 0,
      toDataURL: () => fakeDataURL,
      width: 0
    } as any);

    vi.stubGlobal('Image', createMockImage());

    const result = await urlToBase64('https://example.com/img.png');

    expect(result).toBe(fakeDataURL);
    expect(mockCtx.drawImage).toHaveBeenCalled();
  });

  it('自定义 mimeType 应传给 toDataURL', async () => {
    const toDataURLSpy = vi.fn().mockReturnValue('data:image/jpeg;base64,XYZ');

    vi.spyOn(document, 'createElement').mockReturnValue({
      getContext: () => ({ drawImage: vi.fn() }),
      height: 0,
      toDataURL: toDataURLSpy,
      width: 0
    } as any);

    vi.stubGlobal('Image', createMockImage());

    await urlToBase64('https://example.com/img.jpg', 'image/jpeg');

    expect(toDataURLSpy).toHaveBeenCalledWith('image/jpeg');
  });

  it('canvas context 获取失败应 reject', async () => {
    vi.spyOn(document, 'createElement').mockReturnValue({
      getContext: () => null,
      height: 0,
      width: 0
    } as any);

    vi.stubGlobal('Image', createMockImage());

    await expect(urlToBase64('https://example.com/img.png')).rejects.toThrow('Failed to get canvas context.');
  });

  it('图片加载失败应 reject', async () => {
    vi.spyOn(document, 'createElement').mockReturnValue({
      getContext: () => ({}),
      height: 0,
      width: 0
    } as any);

    vi.stubGlobal('Image', createMockImage({ failOnLoad: true }));

    await expect(urlToBase64('https://example.com/broken.png')).rejects.toThrow(
      'Failed to load image (CORS or network error).'
    );
  });

  it('toDataURL 抛非 Error 异常时应包装为 Error', async () => {
    vi.spyOn(document, 'createElement').mockReturnValue({
      getContext: () => ({ drawImage: vi.fn() }),
      height: 0,
      toDataURL: () => {
        throw new Error('canvas tainted');
      },
      width: 0
    } as any);

    vi.stubGlobal('Image', createMockImage());

    await expect(urlToBase64('https://example.com/img.png')).rejects.toThrow('Failed to convert image to base64.');
  });
});

// ==================== 边界分支覆盖 ====================

describe('download 边界分支', () => {
  it('downloadFileFromUrl 在 URL 规范化失败时应继续使用原始地址', async () => {
    const link = setupLinkMock();
    const originalURL = globalThis.URL;
    const fetchMock = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['content'])),
      headers: new Headers(),
      ok: true,
      type: 'cors'
    });

    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal(
      'URL',
      class extends originalURL {
        constructor(input: string | URL, base?: string | URL) {
          if (typeof input === 'string' && input.includes('bad-normalize')) {
            throw new Error('Invalid URL');
          }

          super(input, base);
        }

        static override createObjectURL = vi.fn(() => 'blob:http://localhost/mock');
        static override revokeObjectURL = originalURL.revokeObjectURL;
      }
    );

    await downloadFileFromUrl({ source: 'bad-normalize/file.txt' });

    expect(fetchMock).toHaveBeenCalledWith('bad-normalize/file.txt', { mode: 'cors' });
    expect(link.download).toBe('file.txt');
  });

  it('downloadFileFromUrl 传含编码异常字符的 URL 应走 resolveFileName catch 分支', async () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const mockBlob = new Blob(['content']);
    const mockHeaders = new Headers();

    const originalURL = globalThis.URL;
    let callCount = 0;

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
        headers: mockHeaders,
        ok: true,
        type: 'cors'
      })
    );

    vi.stubGlobal(
      'URL',
      class extends originalURL {
        constructor(input: string | URL, base?: string | URL) {
          callCount += 1;
          if (callCount > 1 && typeof input === 'string' && input.includes('bad-path')) {
            throw new Error('Invalid URL');
          }
          super(input, base);
        }
        static override createObjectURL = originalURL.createObjectURL;
        static override revokeObjectURL = originalURL.revokeObjectURL;
      }
    );

    await downloadFileFromUrl({ source: 'https://example.com/bad-path/file.txt' });

    expect(link.click).toHaveBeenCalled();

    vi.stubGlobal('URL', originalURL);
  });

  it('downloadFileFromUrl 含 %ZZ 这类无法 decode 的 Content-Disposition 应安全处理', async () => {
    const link = setupLinkMock();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/mock');

    const mockBlob = new Blob(['content']);
    const mockHeaders = new Headers({
      'content-disposition': "attachment; filename*=UTF-8''%ZZbad%file"
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
        headers: mockHeaders,
        ok: true,
        type: 'cors'
      })
    );

    await downloadFileFromUrl({ source: 'https://example.com/dl' });

    expect(link.click).toHaveBeenCalled();
  });
});
