// oxlint-disable-next-line import/no-unassigned-import
import '@testing-library/jest-dom/vitest';

class ResizeObserverMock {
  private callback: ResizeObserverCallback | null;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  disconnect() {
    this.callback = null;
  }

  observe(_target: Element) {
    if (this.callback) {
      return undefined;
    }

    return undefined;
  }

  unobserve(_target: Element) {
    if (this.callback) {
      return undefined;
    }

    return undefined;
  }
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverMock;
}

if (!globalThis.PointerEvent) {
  globalThis.PointerEvent = MouseEvent as unknown as typeof PointerEvent;
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}

if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => undefined;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => undefined;
}
