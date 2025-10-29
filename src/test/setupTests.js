/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom/vitest';

if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = () => 'blob://test';
}
if (!window.URL.revokeObjectURL) {
  window.URL.revokeObjectURL = () => {};
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class {
    observe() { return this; }

    unobserve() { return this; }

    disconnect() { return this; }
  };
}

if (!HTMLCanvasElement.prototype.toDataURL) {
  HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,test';
}
