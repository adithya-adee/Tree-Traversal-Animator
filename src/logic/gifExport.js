
import * as htmlToImage from 'html-to-image';
import GIF from 'gif.js';

const GIF_CONFIG = {
  workers: 2,
  quality: 10,
  width: 800,
  height: 600,
  workerScript: '/node_modules/gif.js/dist/gif.worker.js'
};

const CAPTURE_CONFIG = {
  quality: 0.95,
  pixelRatio: 1,
  backgroundColor: '#ffffff',
  style: {
    transform: 'scale(1)',
    transformOrigin: 'top left'
  }
};

export const createGIFFromAnimation = async (captureRef, animationSteps, options = {}) => {
  try {
    const config = { ...GIF_CONFIG, ...options };
    const gif = new GIF(config);
    
    for (let i = 0; i < animationSteps.length; i++) {
      const step = animationSteps[i];
      
      const canvas = await htmlToImage.toCanvas(captureRef.current, CAPTURE_CONFIG);
      
      gif.addFrame(canvas, { delay: step.duration || 1000 });
      
      await new Promise(resolve => setTimeout(resolve, step.duration || 1000));
    }
    
    gif.on('finished', (blob) => {
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
    
    const canvas = await htmlToImage.toCanvas(captureRef.current, CAPTURE_CONFIG);
    
    for (let i = 0; i < 10; i++) {
      gif.addFrame(canvas, { delay: 200 });
    }
    
    gif.on('finished', (blob) => {
      downloadBlob(blob, 'tree-state.gif');
    });
    
    gif.render();
    
    return gif;
  } catch (error) {
    console.error('Error creating GIF from tree:', error);
    throw error;
  }
};

export const createGIFFromTraversal = async (captureRef, traversalSteps, options = {}) => {
  try {
    const config = { ...GIF_CONFIG, ...options };
    const gif = new GIF(config);
    
    for (let i = 0; i < traversalSteps.length; i++) {
      const step = traversalSteps[i];
      
      const canvas = await htmlToImage.toCanvas(captureRef.current, CAPTURE_CONFIG);
      
      gif.addFrame(canvas, { delay: step.duration || 500 });
      
      await new Promise(resolve => setTimeout(resolve, step.duration || 500));
    }
    
    gif.on('finished', (blob) => {
      downloadBlob(blob, 'tree-traversal.gif');
    });
    
    gif.render();
    
    return gif;
  } catch (error) {
    console.error('Error creating traversal GIF:', error);
    throw error;
  }
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportTreeAsPNG = async (captureRef, filename = 'tree.png') => {
  try {
    const canvas = await htmlToImage.toCanvas(captureRef.current, CAPTURE_CONFIG);
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
    const svg = await htmlToImage.toSvg(captureRef.current, CAPTURE_CONFIG);
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
    const canvas = await htmlToImage.toCanvas(captureRef.current, CAPTURE_CONFIG);
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

export const getExportOptions = () => {
  return {
    formats: ['PNG', 'JPEG', 'SVG', 'GIF'],
    gifOptions: {
      quality: [1, 10, 20, 30, 40, 50],
      width: [400, 600, 800, 1000, 1200],
      height: [300, 450, 600, 750, 900]
    }
  };
};

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
    errors
  };
};

export const createExportProgressCallback = (onProgress) => {
  return (progress) => {
    if (onProgress) {
      onProgress(Math.round(progress * 100));
    }
  };
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
