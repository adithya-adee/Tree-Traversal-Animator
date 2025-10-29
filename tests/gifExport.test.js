import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import * as htmlToImage from 'html-to-image';

import {
  createGIFFromTree,
  exportTreeAsPNG,
  exportTreeAsSVG,
  exportTreeAsJPEG,
} from '../src/logic/gifExport';

vi.mock('gif.js', () => ({
  default: class MockGIF {
    constructor() {
      this.frames = [];
      this._handlers = {};
    }

    addFrame(canvas, opts) {
      this.frames.push({ canvas, opts });
    }

    on(evt, cb) {
      this._handlers[evt] = cb;
    }

    render() {
      if (this._handlers.finished) this._handlers.finished(new Blob());
    }
  },
}));

describe('gifExport integration with mocks', () => {
  const ref = { current: document.createElement('div') };

  beforeEach(() => {
    vi.spyOn(htmlToImage, 'toCanvas').mockResolvedValue(
      document.createElement('canvas'),
    );
    vi.spyOn(htmlToImage, 'toSvg').mockResolvedValue(
      'data:image/svg+xml,<svg></svg>',
    );
  });

  it('createGIFFromTree adds frames and finishes', async () => {
    const gif = await createGIFFromTree(ref);
    expect(gif).toBeTruthy();
  });

  it('exportTreeAsPNG triggers download', async () => {
    const append = vi.spyOn(document.body, 'appendChild');
    const remove = vi.spyOn(document.body, 'removeChild');
    await exportTreeAsPNG(ref);
    expect(append).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
  });

  it('exportTreeAsSVG triggers download', async () => {
    const append = vi.spyOn(document.body, 'appendChild');
    const remove = vi.spyOn(document.body, 'removeChild');
    await exportTreeAsSVG(ref);
    expect(append).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
  });

  it('exportTreeAsJPEG triggers download', async () => {
    const append = vi.spyOn(document.body, 'appendChild');
    const remove = vi.spyOn(document.body, 'removeChild');
    await exportTreeAsJPEG(ref);
    expect(append).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
  });
});
