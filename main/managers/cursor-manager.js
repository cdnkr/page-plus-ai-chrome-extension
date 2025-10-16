/**
 * CursorManager - Manages cursor styles based on selection mode
 * Handles cursor CSS injection and body class management
 */

import { cursorCSS } from '../styles/css-constants.js';

export class CursorManager {
  constructor(config = {}) {
    this.styleElementId = config.styleElementId || 'selection-ai-cursor-styles';
    this.textModeClass = config.textModeClass || 'text-mode-active';
    this.dragModeClass = config.dragModeClass || 'drag-mode-active';
    this.currentMode = null;
    this.isInitialized = false;
  }

  /**
   * Initialize cursor styles (inject CSS)
   */
  initialize() {
    if (this.isInitialized) return;

    // Add cursor styles to document head if not already added
    if (!document.getElementById(this.styleElementId)) {
      const style = document.createElement('style');
      style.id = this.styleElementId;
      style.textContent = cursorCSS;
      document.head.appendChild(style);
    }

    this.isInitialized = true;
  }

  /**
   * Update cursor based on current mode
   * @param {string|null} mode - 'text', 'drag', or null
   */
  updateCursor(mode) {
    // Initialize if not already done
    if (!this.isInitialized) {
      this.initialize();
    }

    this.currentMode = mode;

    // Remove all cursor classes
    document.body.classList.remove(this.textModeClass, this.dragModeClass);

    // Add appropriate cursor class based on current mode
    if (mode === 'text') {
      document.body.classList.add(this.textModeClass);
    } else if (mode === 'drag') {
      document.body.classList.add(this.dragModeClass);
    }

    console.log('Cursor updated for mode:', mode);
    console.log('Body classes:', document.body.className);
  }

  /**
   * Set text mode cursor
   */
  setTextMode() {
    this.updateCursor('text');
  }

  /**
   * Set drag mode cursor
   */
  setDragMode() {
    this.updateCursor('drag');
  }

  /**
   * Clear cursor mode (reset to default)
   */
  clearMode() {
    this.updateCursor(null);
  }

  /**
   * Get current cursor mode
   * @returns {string|null} Current mode
   */
  getCurrentMode() {
    return this.currentMode;
  }

  /**
   * Check if cursor manager is initialized
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Remove cursor styles from document
   */
  destroy() {
    // Remove cursor classes from body
    document.body.classList.remove(this.textModeClass, this.dragModeClass);

    // Remove style element
    const styleElement = document.getElementById(this.styleElementId);
    if (styleElement) {
      styleElement.remove();
    }

    this.isInitialized = false;
    this.currentMode = null;
  }
}

