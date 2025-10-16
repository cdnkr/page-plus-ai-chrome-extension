/**
 * PositionManager - Handles all positioning calculations for UI elements
 * Manages viewport boundaries, scroll positions, and absolute/relative coordinates
 */
export class PositionManager {
  constructor(margin = 20) {
    this.margin = margin; // Minimum margin from viewport edges
  }

  /**
   * Calculate safe position that stays within viewport boundaries
   * @param {Object} position - { x, y } viewport coordinates
   * @param {Object} elementSize - { width, height } of the element
   * @returns {Object} - Safe { x, y } position within viewport
   */
  calculateSafePosition(position, elementSize) {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Calculate safe horizontal position
    let x = position.x;
    if (x + elementSize.width > viewport.width - this.margin) {
      x = viewport.width - elementSize.width - this.margin;
    }
    if (x < this.margin) {
      x = this.margin;
    }

    // Calculate safe vertical position
    let y = position.y;
    if (y + elementSize.height > viewport.height - this.margin) {
      y = viewport.height - elementSize.height - this.margin;
    }
    if (y < this.margin) {
      y = this.margin;
    }

    return { x, y };
  }

  /**
   * Convert viewport coordinates to absolute page coordinates
   * @param {Object} viewportPosition - { x, y } relative to viewport
   * @returns {Object} - { x, y } absolute page coordinates
   */
  calculateAbsolutePosition(viewportPosition) {
    return {
      x: viewportPosition.x + window.scrollX,
      y: viewportPosition.y + window.scrollY
    };
  }

  /**
   * Convert absolute page coordinates to viewport coordinates
   * @param {Object} absolutePosition - { x, y } absolute page coordinates
   * @returns {Object} - { x, y } relative to viewport
   */
  calculateViewportPosition(absolutePosition) {
    return {
      x: absolutePosition.x - window.scrollX,
      y: absolutePosition.y - window.scrollY
    };
  }

  /**
   * Get position from a selection range (anchored to text)
   * @param {Range|null} selectionRange - DOM Range object
   * @param {Object|null} fallbackPosition - Fallback { x, y } position
   * @returns {Object} - { x, y } position
   */
  getSelectionPosition(selectionRange, fallbackPosition = null) {
    if (!selectionRange) {
      return fallbackPosition || { x: 0, y: 0 };
    }

    try {
      const rect = selectionRange.getBoundingClientRect();
      return {
        x: rect.left + (rect.width / 2),
        y: rect.bottom + 10
      };
    } catch (error) {
      console.warn('Could not get selection position:', error);
      return fallbackPosition || { x: 0, y: 0 };
    }
  }

  /**
   * Update element position on window resize to ensure it stays within viewport
   * @param {HTMLElement} element - Element to update
   * @param {Object} elementSize - { width, height } of the element
   * @returns {boolean} - Whether position was updated
   */
  updateElementPosition(element, elementSize) {
    if (!element || !element.style.left || !element.style.top) {
      return false;
    }

    // For absolute positioning, we need to recalculate based on current scroll position
    const currentLeft = parseInt(element.style.left);
    const currentTop = parseInt(element.style.top);

    // Convert absolute position back to viewport coordinates for boundary checking
    const viewportPosition = this.calculateViewportPosition({
      x: currentLeft,
      y: currentTop
    });

    const safePosition = this.calculateSafePosition(viewportPosition, elementSize);
    const absolutePosition = this.calculateAbsolutePosition(safePosition);

    // Only update if position actually changed (due to resize)
    if (absolutePosition.x !== currentLeft || absolutePosition.y !== currentTop) {
      element.style.left = `${absolutePosition.x}px`;
      element.style.top = `${absolutePosition.y}px`;
      return true;
    }

    return false;
  }

  /**
   * Get viewport dimensions
   * @returns {Object} - { width, height } of viewport
   */
  getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  /**
   * Get current scroll position
   * @returns {Object} - { scrollX, scrollY }
   */
  getScrollPosition() {
    return {
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
  }

  /**
   * Check if a position is within viewport bounds
   * @param {Object} position - { x, y } viewport coordinates
   * @param {Object} elementSize - { width, height } of the element
   * @returns {boolean} - Whether element at position fits in viewport
   */
  isWithinViewport(position, elementSize) {
    const viewport = this.getViewportSize();
    
    return (
      position.x >= this.margin &&
      position.y >= this.margin &&
      position.x + elementSize.width <= viewport.width - this.margin &&
      position.y + elementSize.height <= viewport.height - this.margin
    );
  }

  /**
   * Calculate position for an element anchored from bottom
   * Useful for popovers that should appear above a reference element
   * @param {Object} referenceRect - DOMRect or { left, top, width, height, bottom }
   * @param {number} elementWidth - Width of element to position
   * @param {number} elementHeight - Height of element to position
   * @param {number} margin - Margin between reference and element (default: 20)
   * @returns {Object} - { x, bottomY, anchorFromBottom: true }
   */
  calculateBottomAnchoredPosition(referenceRect, elementWidth, elementHeight, margin = 20) {
    return {
      x: referenceRect.left + (referenceRect.width / 2) - (elementWidth / 2),
      bottomY: referenceRect.top - margin,
      anchorFromBottom: true
    };
  }
}

// Export a singleton instance for convenience
export const positionManager = new PositionManager();

