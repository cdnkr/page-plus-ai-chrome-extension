/**
 * DragSelectionHandler - Handles drag box selection functionality
 * Manages drag state, visual drag box, and coordinates
 */

import { dragBoxContainerCSS, dragBoxCSS } from '../styles/css-constants.js';
import { getDragBoxCSS } from '../styles/css-utils.js';
import { MIN_DRAG_SIZE } from '../config.js';

export class DragSelectionHandler {
  constructor(config = {}) {
    // Drag state
    this.dragBox = null;
    this.dragStart = null;
    this.dragEnd = null;
    this.isDragging = false;
    this.dragBoxContainer = null;
    this.dragBoxShadowRoot = null;
    this.fullPageOverlay = null;

    // Configuration
    this.positionManager = config.positionManager;
    this.shouldHandle = config.shouldHandle || (() => true);
    this.onDragComplete = config.onDragComplete || (() => {});
    this.onDragStart = config.onDragStart || (() => {});
    this.minDragSize = config.minDragSize || MIN_DRAG_SIZE;
  }

  /**
   * Handle drag start event
   * @param {MouseEvent} event - The mousedown event
   * @returns {boolean} - Whether drag was started
   */
  handleDragStart(event) {
    console.log('drag starting', event);
    if (!this.shouldHandle() || this.isDragging) {
      console.log('drag not starting', event);
      return false;
    }

    // Don't start drag if clicking on UI elements
    if (event.target.closest('.selection-ai-mode-switcher') ||
        event.target.closest('.selection-ai-buttons') ||
        event.target.closest('.selection-ai-popover')) {
      console.log('drag not starting 2', event);
      return false;
    }

    this.isDragging = true;
    this.dragStart = { x: event.clientX, y: event.clientY };
    this.dragEnd = { x: event.clientX, y: event.clientY };

    this.createFullPageOverlay();
    this.createDragBox();
    
    // Notify parent
    this.onDragStart();

    return true;
  }

  /**
   * Handle drag move event
   * @param {MouseEvent} event - The mousemove event
   * @returns {boolean} - Whether drag was updated
   */
  handleDragMove(event) {
    if (!this.isDragging || !this.shouldHandle()) {
      return false;
    }

    this.dragEnd = { x: event.clientX, y: event.clientY };
    this.updateDragBox();
    
    return true;
  }

  /**
   * Handle drag end event
   * @param {MouseEvent} event - The mouseup event
   * @returns {Object|null} - Drag data or null if drag was too small
   */
  handleDragEnd(event) {
    if (!this.isDragging || !this.shouldHandle()) {
      return null;
    }

    this.isDragging = false;

    // Check if drag box has meaningful size
    const width = Math.abs(this.dragEnd.x - this.dragStart.x);
    const height = Math.abs(this.dragEnd.y - this.dragStart.y);

    if (width > this.minDragSize && height > this.minDragSize) {
      const dragData = {
        start: this.dragStart,
        end: this.dragEnd,
        bounds: this.getDragBounds(),
        width,
        height
      };

      this.hideFullPageOverlay();

      // Notify parent
      this.onDragComplete(dragData);

      return dragData;
    } else {
      // Drag too small, clean up
      this.hideDragBox();
      return null;
    }
  }

  /**
   * Create the drag box visual element
   */
  createDragBox() {
    console.log('creating drag box');
    // Remove any existing drag box first
    this.hideDragBox();

    this.dragBoxContainer = document.createElement('div');
    this.dragBoxContainer.className = 'selection-ai-drag-box-container';
    this.dragBoxContainer.style.cssText = dragBoxContainerCSS;

    // Create shadow root for style isolation
    this.dragBoxShadowRoot = this.dragBoxContainer.attachShadow({ mode: 'open' });
    console.log('shadow root created:', this.dragBoxShadowRoot);

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = dragBoxCSS;
    this.dragBoxShadowRoot.appendChild(style);

    // Create drag box element
    this.dragBox = document.createElement('div');
    this.dragBox.className = 'drag-box';
    console.log('drag box element created:', this.dragBox);
    this.dragBoxShadowRoot.appendChild(this.dragBox);

    // Add to DOM
    document.body.appendChild(this.dragBoxContainer);
    console.log('drag box container added to DOM');

    this.updateDragBox();
  }

  /**
   * Update the drag box position and size
   */
  updateDragBox() {
    console.log('updating drag box');
    console.log('dragBox:', this.dragBox);
    console.log('dragStart:', this.dragStart);
    console.log('dragEnd:', this.dragEnd);
    if (!this.dragBox || !this.dragStart || !this.dragEnd) {
      console.log('drag box not updating - missing values:', {
        dragBox: this.dragBox,
        dragStart: this.dragStart,
        dragEnd: this.dragEnd
      });
      return;
    }

    const left = Math.min(this.dragStart.x, this.dragEnd.x);
    const top = Math.min(this.dragStart.y, this.dragEnd.y);
    const width = Math.abs(this.dragEnd.x - this.dragStart.x);
    const height = Math.abs(this.dragEnd.y - this.dragStart.y);

    // Convert viewport coordinates to page coordinates
    let absolutePosition = { x: left, y: top };
    if (this.positionManager) {
      console.log('position manager', this.positionManager);
      absolutePosition = this.positionManager.calculateAbsolutePosition({ x: left, y: top });
    } else {
      console.log('no position manager', this.positionManager);
      // Fallback if no position manager
      absolutePosition = {
        x: left + window.scrollX,
        y: top + window.scrollY
      };
    }

    this.dragBox.style.cssText = getDragBoxCSS({
      x: absolutePosition.x,
      y: absolutePosition.y,
      width,
      height
    });
  }

  /**
   * Hide and remove the drag box
   */
  hideDragBox() {
    if (this.dragBoxContainer) {
      this.dragBoxContainer.remove();
      this.dragBoxContainer = null;
      this.dragBox = null;
      this.dragBoxShadowRoot = null;
    }
  }

  createFullPageOverlay() {
    this.fullPageOverlay = document.createElement('div');
    this.fullPageOverlay.className = 'selection-ai-full-page-overlay';
    this.fullPageOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0);
    `;
    document.body.appendChild(this.fullPageOverlay);
  }

  hideFullPageOverlay() {
    if (this.fullPageOverlay) {
      this.fullPageOverlay.remove();
      this.fullPageOverlay = null;
    }
  }

  /**
   * Get the current drag box bounds
   * @returns {Object|null} - Bounds { left, top, right, bottom, width, height }
   */
  getDragBounds() {
    if (!this.dragStart || !this.dragEnd) return null;

    const left = Math.min(this.dragStart.x, this.dragEnd.x);
    const top = Math.min(this.dragStart.y, this.dragEnd.y);
    const right = Math.max(this.dragStart.x, this.dragEnd.x);
    const bottom = Math.max(this.dragStart.y, this.dragEnd.y);
    const width = Math.abs(this.dragEnd.x - this.dragStart.x);
    const height = Math.abs(this.dragEnd.y - this.dragStart.y);

    return { left, top, right, bottom, width, height };
  }

  /**
   * Get current drag state
   * @returns {Object} - Current drag state
   */
  getDragData() {
    return {
      start: this.dragStart,
      end: this.dragEnd,
      isDragging: this.isDragging,
      bounds: this.getDragBounds()
    };
  }

  /**
   * Check if there is an active drag selection
   * @returns {boolean}
   */
  hasDragSelection() {
    return this.dragStart !== null && this.dragEnd !== null;
  }

  /**
   * Clear all drag state and hide drag box
   */
  clearDrag() {
    this.dragStart = null;
    this.dragEnd = null;
    this.isDragging = false;
    this.hideDragBox();
  }

  /**
   * Get the action button position for this drag selection
   * Typically positioned at bottom-right of drag box
   * @param {number} offsetX - X offset from right edge (default: -100)
   * @param {number} offsetY - Y offset from bottom edge (default: 10)
   * @returns {Object|null} - Position { x, y } or null
   */
  getActionButtonPosition(offsetX = -100, offsetY = 10) {
    const bounds = this.getDragBounds();
    if (!bounds) return null;

    return {
      x: bounds.right + offsetX,
      y: bounds.bottom + offsetY
    };
  }

  /**
   * Get the popover position for this drag selection
   * @param {number} offsetX - X offset from right edge (default: -200)
   * @param {number} offsetY - Y offset from bottom edge (default: 20)
   * @returns {Object|null} - Position { x, y } or null
   */
  getPopoverPosition(offsetX = -200, offsetY = 20) {
    const bounds = this.getDragBounds();
    if (!bounds) return null;

    return {
      x: bounds.right + offsetX,
      y: bounds.bottom + offsetY
    };
  }
}
