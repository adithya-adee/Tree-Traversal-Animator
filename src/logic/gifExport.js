import * as htmlToImage from 'html-to-image';
import GIF from 'gif.js';
/* eslint-disable no-console */

const GIF_CONFIG = {
  workers: 2,
  quality: 10,
  width: 800,
  height: 600,
  workerScript: '/node_modules/gif.js/dist/gif.worker.js',
};

const CAPTURE_CONFIG = {
  quality: 0.95,
  pixelRatio: 1,
  backgroundColor: '#ffffff',
  style: {
    transform: 'scale(1)',
    transformOrigin: 'top left',
  },
};

export const createGIFFromAnimation = async (
  captureRef,
  animationSteps,
  options = {},
) => {
  try {
    const config = { ...GIF_CONFIG, ...options };
    const gif = new GIF(config);

    for (let i = 0; i < animationSteps.length; i++) {
      const step = animationSteps[i];

      // eslint-disable-next-line no-await-in-loop
      const canvas = await htmlToImage.toCanvas(
        captureRef.current,
        CAPTURE_CONFIG,
      );

      gif.addFrame(canvas, { delay: step.duration || 1000 });

      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, step.duration || 1000);
      });
    }

    gif.on('finished', (blob) => {
      // eslint-disable-next-line no-use-before-define
      downloadBlob(blob, 'tree-animation.gif');
    });

    gif.render();

    return gif;
  } catch (error) {
    console.error('Error creating GIF:', error);
    throw error;
  }
};

export const createGIFFromTree = async (captureRef, options = {}) => {
  try {
    const config = { ...GIF_CONFIG, ...options };
    const gif = new GIF(config);

    const canvas = await htmlToImage.toCanvas(
      captureRef.current,
      CAPTURE_CONFIG,
    );

    for (let i = 0; i < 10; i++) {
      gif.addFrame(canvas, { delay: 200 });
    }

    gif.on('finished', (blob) => {
      // eslint-disable-next-line no-use-before-define
      downloadBlob(blob, 'tree-state.gif');
    });

    gif.render();

    return gif;
  } catch (error) {
    console.error('Error creating GIF from tree:', error);
    throw error;
  }
};

// Simpler GIF export that captures frames during a replay
export const createGIFFromLiveAnimation = async (
  captureRef,
  onProgressUpdate,
  options = {},
) => {
  try {
    // Get actual canvas dimensions from the rendered element
    const canvasElement = captureRef.current;
    const rect = canvasElement.getBoundingClientRect();

    // Use the larger of actual size or computed size to ensure we capture everything
    const computedStyle = window.getComputedStyle(canvasElement);
    const { scrollWidth, scrollHeight } = canvasElement;

    const actualWidth = Math.max(
      Math.ceil(rect.width),
      scrollWidth,
      parseInt(computedStyle.width, 10) || 0,
    );
    const actualHeight = Math.max(
      Math.ceil(rect.height),
      scrollHeight,
      parseInt(computedStyle.height, 10) || 0,
    );

    // Use actual dimensions for GIF
    const config = {
      ...GIF_CONFIG,
      width: actualWidth,
      height: actualHeight,
      ...options,
    };
    const gif = new GIF(config);

    // Enhanced capture config for full canvas including overflow
    const enhancedCaptureConfig = {
      quality: 0.95,
      pixelRatio: 1,
      backgroundColor: '#ffffff',
      width: actualWidth,
      height: actualHeight,
      cacheBust: true,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
        overflow: 'visible',
      },
    };

    return {
      captureFrame: async (delay = 500) => {
        // Wait for DOM to settle and animations to complete
        await new Promise((resolve) => { setTimeout(resolve, 100); });

        const canvas = await htmlToImage.toCanvas(
          captureRef.current,
          enhancedCaptureConfig,
        );
        gif.addFrame(canvas, { delay });

        if (onProgressUpdate) {
          onProgressUpdate();
        }
      },
      finalize: () => new Promise((resolve, reject) => {
        gif.on('finished', (blob) => {
          // eslint-disable-next-line no-use-before-define
          downloadBlob(blob, `tree-traversal-${Date.now()}.gif`);
          resolve();
        });

        gif.on('error', (error) => {
          reject(error);
        });

        gif.render();
      }),
    };
  } catch (error) {
    console.error('Error creating GIF from live animation:', error);
    throw error;
  }
};

export const createGIFFromTraversal = async (
  captureRef,
  traversalSteps,
  options = {},
) => {
  try {
    const config = { ...GIF_CONFIG, ...options };
    const gif = new GIF(config);

    for (let i = 0; i < traversalSteps.length; i++) {
      const step = traversalSteps[i];

      // eslint-disable-next-line no-await-in-loop
      const canvas = await htmlToImage.toCanvas(
        captureRef.current,
        CAPTURE_CONFIG,
      );

      gif.addFrame(canvas, { delay: step.duration || 500 });

      // eslint-disable-next-line no-await-in-loop, block-spacing
      await new Promise((resolve) => {
        setTimeout(resolve, step.duration || 500);
      });
    }

    gif.on('finished', (blob) => {
      // eslint-disable-next-line no-use-before-define
      downloadBlob(blob, 'tree-traversal.gif');
    });

    gif.render();

    return gif;
  } catch (error) {
    console.error('Error creating traversal GIF:', error);
    throw error;
  }
};

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const exportTreeAsPNG = async (captureRef, filename = 'tree.png') => {
  try {
    // Get actual canvas dimensions
    const canvasElement = captureRef.current;
    const rect = canvasElement.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(canvasElement);
    const { scrollWidth, scrollHeight } = canvasElement;

    const actualWidth = Math.max(
      Math.ceil(rect.width),
      scrollWidth,
      parseInt(computedStyle.width, 10) || 0,
    );
    const actualHeight = Math.max(
      Math.ceil(rect.height),
      scrollHeight,
      parseInt(computedStyle.height, 10) || 0,
    );

    // Enhanced capture config for full canvas
    const enhancedConfig = {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      width: actualWidth,
      height: actualHeight,
      cacheBust: true,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
        overflow: 'visible',
      },
    };

    const canvas = await htmlToImage.toCanvas(
      captureRef.current,
      enhancedConfig,
    );
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting PNG:', error);
    throw error;
  }
};

export const exportTreeAsSVG = async (captureRef, filename = 'tree.svg') => {
  try {
    // Get actual canvas dimensions
    const canvasElement = captureRef.current;
    const rect = canvasElement.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(canvasElement);
    const { scrollWidth, scrollHeight } = canvasElement;

    const actualWidth = Math.max(
      Math.ceil(rect.width),
      scrollWidth,
      parseInt(computedStyle.width, 10) || 0,
    );
    const actualHeight = Math.max(
      Math.ceil(rect.height),
      scrollHeight,
      parseInt(computedStyle.height, 10) || 0,
    );

    // Enhanced capture config for full canvas
    const enhancedConfig = {
      quality: 1.0,
      backgroundColor: '#ffffff',
      width: actualWidth,
      height: actualHeight,
      cacheBust: true,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
        overflow: 'visible',
      },
    };

    const svg = await htmlToImage.toSvg(captureRef.current, enhancedConfig);
    const link = document.createElement('a');
    link.download = filename;
    link.href = svg;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting SVG:', error);
    throw error;
  }
};

export const exportTreeAsJPEG = async (captureRef, filename = 'tree.jpg') => {
  try {
    // Get actual canvas dimensions
    const canvasElement = captureRef.current;
    const rect = canvasElement.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(canvasElement);
    const { scrollWidth, scrollHeight } = canvasElement;

    const actualWidth = Math.max(
      Math.ceil(rect.width),
      scrollWidth,
      parseInt(computedStyle.width, 10) || 0,
    );
    const actualHeight = Math.max(
      Math.ceil(rect.height),
      scrollHeight,
      parseInt(computedStyle.height, 10) || 0,
    );

    // Enhanced capture config for full canvas
    const enhancedConfig = {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      width: actualWidth,
      height: actualHeight,
      cacheBust: true,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: `${actualWidth}px`,
        height: `${actualHeight}px`,
        overflow: 'visible',
      },
    };

    const canvas = await htmlToImage.toCanvas(
      captureRef.current,
      enhancedConfig,
    );
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting JPEG:', error);
    throw error;
  }
};

export const getExportOptions = () => ({
  formats: ['PNG', 'JPEG', 'SVG', 'GIF'],
  gifOptions: {
    quality: [1, 10, 20, 30, 40, 50],
    width: [400, 600, 800, 1000, 1200],
    height: [300, 450, 600, 750, 900],
  },
});

export const validateExportOptions = (options) => {
  const errors = [];

  if (options.quality && (options.quality < 1 || options.quality > 50)) {
    errors.push('Quality must be between 1 and 50');
  }

  if (options.width && (options.width < 100 || options.width > 2000)) {
    errors.push('Width must be between 100 and 2000');
  }

  if (options.height && (options.height < 100 || options.height > 2000)) {
    errors.push('Height must be between 100 and 2000');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const createExportProgressCallback = (onProgress) => (progress) => {
  if (onProgress) {
    onProgress(Math.round(progress * 100));
  }
};

export const exportWithProgress = async (exportFunction, onProgress) => {
  try {
    const progressCallback = createExportProgressCallback(onProgress);

    const progressInterval = setInterval(() => {
      progressCallback(Math.random() * 0.9);
    }, 100);

    const result = await exportFunction();

    clearInterval(progressInterval);
    progressCallback(100);

    return result;
  } catch (error) {
    if (onProgress) {
      onProgress(0);
    }
    throw error;
  }
};
