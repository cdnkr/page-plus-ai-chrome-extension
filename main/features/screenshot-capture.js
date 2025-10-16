/**
 * ScreenshotCapture - Handles screenshot capture and cropping
 * Manages communication with background script and image processing
 */

import { SCREENSHOT_BORDER_OFFSET } from '../config.js';

export class ScreenshotCapture {
  constructor(config = {}) {
    this.borderOffset = config.borderOffset || SCREENSHOT_BORDER_OFFSET;
  }

  /**
   * Capture a screenshot of the specified bounds
   * @param {Object} bounds - { left, top, width, height } in viewport coordinates
   * @returns {Promise<string|null>} Data URL of the captured screenshot
   */
  async captureArea(bounds) {
    if (!bounds) {
      console.error('No bounds provided for screenshot');
      return null;
    }

    const { left, top, width, height } = bounds;

    try {
      // For Chrome screenshot API, we need viewport coordinates (not page coordinates)
      // The screenshot captures the visible viewport, so we use the original viewport coordinates
      // Crop out the drag box border (2px) plus 1px extra margin
      const viewportLeft = left + this.borderOffset;
      const viewportTop = top + this.borderOffset;
      const viewportWidth = width - (this.borderOffset * 2);
      const viewportHeight = height - (this.borderOffset * 2);

      // Account for device pixel ratio scaling
      const devicePixelRatio = window.devicePixelRatio || 1;
      const scaledLeft = viewportLeft * devicePixelRatio;
      const scaledTop = viewportTop * devicePixelRatio;
      const scaledWidth = viewportWidth * devicePixelRatio;
      const scaledHeight = viewportHeight * devicePixelRatio;

      console.log('Screenshot coordinates:', {
        original: { left, top, width, height },
        viewport: { viewportLeft, viewportTop, viewportWidth, viewportHeight },
        scaled: { scaledLeft, scaledTop, scaledWidth, scaledHeight },
        devicePixelRatio,
        scrollPosition: { scrollX: window.scrollX, scrollY: window.scrollY }
      });

      // Use Chrome extension API to capture screenshot
      const screenshot = await this.captureVisibleTab({
        x: Math.round(scaledLeft),
        y: Math.round(scaledTop),
        width: Math.round(scaledWidth),
        height: Math.round(scaledHeight)
      });

      return screenshot;
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      this.showError('Failed to capture screenshot');
      return null;
    }
  }

  /**
   * Send message to background script to capture visible tab
   * @param {Object} cropArea - { x, y, width, height } crop coordinates
   * @returns {Promise<string|null>} Data URL of the captured screenshot
   */
  async captureVisibleTab(cropArea) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'captureVisibleTab',
        cropArea: cropArea
      }, async (response) => {
        if (chrome.runtime.lastError) {
          console.error('Chrome screenshot API error:', chrome.runtime.lastError);
          this.showError('Failed to capture screenshot');
          resolve(null);
        } else if (response && response.dataUrl) {
          if (response.cropArea) {
            // Crop the image in content script where DOM APIs are available
            try {
              const croppedImage = await this.cropImage(response.dataUrl, response.cropArea);
              resolve(croppedImage);
            } catch (error) {
              console.error('Cropping failed:', error);
              // Fallback to full screenshot
              resolve(response.dataUrl);
            }
          } else {
            resolve(response.dataUrl);
          }
        } else {
          this.showError('Failed to capture screenshot');
          resolve(null);
        }
      });
    });
  }

  /**
   * Crop an image to the specified area
   * @param {string} dataUrl - Base64 data URL of the image
   * @param {Object} cropArea - { x, y, width, height } crop coordinates
   * @returns {Promise<string>} Data URL of the cropped image
   */
  async cropImage(dataUrl, cropArea) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        console.log('Image loaded for cropping:', {
          imageSize: { width: img.width, height: img.height },
          cropArea: cropArea
        });

        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = cropArea.width;
          canvas.height = cropArea.height;

          // Draw the cropped portion of the image
          ctx.drawImage(
            img,
            cropArea.x, cropArea.y, cropArea.width, cropArea.height, // Source rectangle
            0, 0, cropArea.width, cropArea.height // Destination rectangle
          );

          console.log('Image cropped successfully');
          resolve(canvas.toDataURL('image/png'));
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for cropping'));
      };

      img.src = dataUrl;
    });
  }

  /**
   * Show error message to user
   * @param {string} message - Error message
   */
  showError(message) {
    alert(message);
  }

  /**
   * Set custom border offset
   * @param {number} offset - Border offset in pixels
   */
  setBorderOffset(offset) {
    this.borderOffset = offset;
  }

  /**
   * Get current border offset
   * @returns {number} Current border offset
   */
  getBorderOffset() {
    return this.borderOffset;
  }
}

