/**
 * NotificationHandler - Manages user notifications and clipboard operations
 * Handles toast notifications, clipboard copy, and Web Share API
 */

import { notificationCSS } from '../../popover/styles/css-constants.js';

export class NotificationHandler {
  constructor(config = {}) {
    this.fadeInDelay = config.fadeInDelay || 100;
    this.displayDuration = config.displayDuration || 2700;
    this.fadeOutDuration = config.fadeOutDuration || 300;
  }

  /**
   * Show a toast notification message
   * @param {string} message - Message to display
   * @param {number} duration - Optional custom display duration in ms
   */
  showNotification(message, duration = null) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = notificationCSS;

    document.body.appendChild(notification);

    // Trigger fade in after a brief delay
    setTimeout(() => {
      requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.filter = 'blur(0px)';
      });
    }, this.fadeInDelay);

    // Schedule fade out and removal
    const totalDuration = duration || this.displayDuration;
    setTimeout(() => {
      // Fade out before removing
      notification.style.opacity = '0';
      notification.style.filter = 'blur(20px)';
      
      setTimeout(() => {
        notification.remove();
      }, this.fadeOutDuration);
    }, totalDuration);

    return notification;
  }

  /**
   * Copy text to clipboard and show notification
   * @param {string} text - Text to copy
   * @param {string} message - Optional custom success message
   * @returns {Promise<boolean>} Success status
   */
  async copyToClipboard(text, message = 'Copied to clipboard!') {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification(message);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      this.showNotification('Failed to copy to clipboard');
      return false;
    }
  }

  /**
   * Share text using Web Share API or fallback to clipboard
   * @param {string} text - Text to share
   * @param {string} title - Optional share title
   * @returns {Promise<boolean>} Success status
   */
  async shareText(text, title = 'AI Generated Content') {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text
        });
        return true;
      } catch (error) {
        // User cancelled share or error occurred
        if (error.name !== 'AbortError') {
          console.error('Failed to share:', error);
          // Fallback to copying
          return await this.copyToClipboard(text);
        }
        return false;
      }
    } else {
      // Fallback to copying if Web Share API not available
      return await this.copyToClipboard(text);
    }
  }

  /**
   * Show an error notification
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.showNotification(`Error: ${message}`);
  }

  /**
   * Show a success notification
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    this.showNotification(message);
  }

  /**
   * Check if Web Share API is available
   * @returns {boolean}
   */
  isShareSupported() {
    return 'share' in navigator;
  }

  /**
   * Check if Clipboard API is available
   * @returns {boolean}
   */
  isClipboardSupported() {
    return 'clipboard' in navigator;
  }

  /**
   * Configure notification timing
   * @param {Object} config - { fadeInDelay, displayDuration, fadeOutDuration }
   */
  configure(config) {
    if (config.fadeInDelay !== undefined) {
      this.fadeInDelay = config.fadeInDelay;
    }
    if (config.displayDuration !== undefined) {
      this.displayDuration = config.displayDuration;
    }
    if (config.fadeOutDuration !== undefined) {
      this.fadeOutDuration = config.fadeOutDuration;
    }
  }
}

