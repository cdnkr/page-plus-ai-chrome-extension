/**
 * TextSelectionHandler - Handles text selection functionality
 * Manages selection state, highlighting, and position tracking
 */

import { selectionHighlightCSS } from '../styles/css-constants.js';

export class TextSelectionHandler {
  constructor(config = {}) {
    this.selectedText = '';
    this.selectionPosition = null;
    this.selectionRange = null;
    this.originalSelectionStyle = null;
    
    // Configuration
    this.positionManager = config.positionManager;
    this.onSelectionChange = config.onSelectionChange || (() => {});
    this.shouldHandle = config.shouldHandle || (() => true);
  }

  /**
   * Handle text selection event
   * @param {MouseEvent} event - The mouseup event
   * @returns {Object|null} - Selection data or null if no valid selection
   */
  handleTextSelection(event) {
    // Check if selection should be handled
    if (!this.shouldHandle()) {
      return null;
    }

    const mousePosition = {
      x: event.clientX,
      y: event.clientY
    };

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
      this.selectedText = selectedText;
      this.selectionPosition = mousePosition;

      // Store the selection range for anchoring
      this.selectionRange = selection.getRangeAt(0).cloneRange();

      // Store selected text in extension storage
      try {
        chrome.storage.local.set({
          selectedText: this.selectedText,
        });
      } catch (error) {
        console.warn('Failed to store selected text:', error);
      }

      // Notify parent about selection change
      const selectionData = {
        text: this.selectedText,
        position: mousePosition,
        range: this.selectionRange
      };

      this.onSelectionChange(selectionData);

      return selectionData;
    }

    return null;
  }

  /**
   * Highlight the selected text with custom color
   */
  highlightSelection() {
    if (!this.selectionRange) return;

    try {
      // Store original selection style
      this.originalSelectionStyle = document.createElement('style');
      this.originalSelectionStyle.textContent = selectionHighlightCSS;
      document.head.appendChild(this.originalSelectionStyle);

      // Restore the selection
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.selectionRange);
    } catch (error) {
      console.warn('Could not highlight selection:', error);
    }
  }

  /**
   * Remove selection highlighting
   */
  removeSelectionHighlight() {
    if (this.originalSelectionStyle) {
      this.originalSelectionStyle.remove();
      this.originalSelectionStyle = null;
    }
  }

  /**
   * Get position from selection range (anchored to text)
   * @returns {Object} - { x, y } position
   */
  getSelectionPosition() {
    if (!this.positionManager) {
      console.warn('PositionManager not provided to TextSelectionHandler');
      return this.selectionPosition || { x: 0, y: 0 };
    }
    return this.positionManager.getSelectionPosition(this.selectionRange, this.selectionPosition);
  }

  /**
   * Clear all selection state
   */
  clearSelection() {
    this.selectedText = '';
    this.selectionPosition = null;
    this.selectionRange = null;
    this.removeSelectionHighlight();
  }

  /**
   * Get current selection data
   * @returns {Object} - Current selection state
   */
  getSelectionData() {
    return {
      text: this.selectedText,
      position: this.selectionPosition,
      range: this.selectionRange
    };
  }

  /**
   * Check if there is an active selection
   * @returns {boolean}
   */
  hasSelection() {
    return this.selectedText.length > 0 && this.selectionRange !== null;
  }
}

