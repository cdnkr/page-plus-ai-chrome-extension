/**
 * ActionButtonsHandler - Manages action buttons for selections
 * Handles button creation, positioning, and click events
 */

import { ICONS } from '../icons.js';
import { selectionActionButtonsCSS } from '../styles/css-constants.js';
import { getButtonContainerCSS } from '../styles/css-utils.js';

export class ActionButtonsHandler {
  constructor(config = {}) {
    this.buttonContainer = null;
    this.buttonShadowRoot = null;
    this.buttonTimeout = null;

    // Configuration
    this.positionManager = config.positionManager;
    this.onButtonClick = config.onButtonClick || (() => {});
    this.getI18n = config.getI18n || (() => null);
    this.getApiAvailability = config.getApiAvailability || (() => ({}));
  }

  /**
   * Show action buttons for text selection
   * @param {Object} position - { x, y } position
   * @param {Array} buttonConfigs - Optional custom button configurations
   */
  showTextSelectionButtons(position, buttonConfigs = null) {
    // Remove existing buttons
    this.hideButtons();

    const t = this.getI18n()?.t || ((k) => k);
    const buttons = buttonConfigs || [
      { id: 'prompt', icon: ICONS.prompt, label: t('button_prompt') },
      { id: 'summarize', icon: ICONS.summarize, label: t('button_summarize') },
      { id: 'write', icon: ICONS.write, label: t('button_write') }
    ];

    this.createButtons(position, buttons);
  }

  /**
   * Show action buttons for drag box selection
   * @param {Object} position - { x, y } position
   */
  showDragBoxButtons(position) {
    // Remove existing buttons
    this.hideButtons();

    const apiAvailability = this.getApiAvailability();
    const buttons = apiAvailability.prompt === 'available' ? [
      { id: 'prompt', icon: ICONS.prompt, label: 'Prompt' },
      { id: 'colors', icon: ICONS.colors, label: 'Colors' }
    ] : [
      { id: 'colors', icon: ICONS.colors, label: 'Colors' }
    ];

    this.createButtons(position, buttons);
  }

  /**
   * Create and show buttons at the specified position
   * @param {Object} position - { x, y } position
   * @param {Array} buttons - Button configurations
   */
  createButtons(position, buttons) {
    // Calculate boundary-aware position
    let safePosition = position;
    if (this.positionManager) {
      safePosition = this.positionManager.calculateSafePosition(position, { width: 200, height: 60 });
    }

    // Create button container with Shadow DOM for style isolation
    this.buttonContainer = document.createElement('div');
    this.buttonContainer.className = 'selection-ai-buttons';

    // Calculate absolute position relative to page content (not viewport)
    let absolutePosition = safePosition;
    if (this.positionManager) {
      absolutePosition = this.positionManager.calculateAbsolutePosition(safePosition);
    } else {
      // Fallback if no position manager
      absolutePosition = {
        x: safePosition.x + window.scrollX,
        y: safePosition.y + window.scrollY
      };
    }

    this.buttonContainer.style.cssText = getButtonContainerCSS(absolutePosition);

    // Create shadow root for complete style isolation
    this.buttonShadowRoot = this.buttonContainer.attachShadow({ mode: 'open' });

    // Add CSS styles to shadow root for complete isolation
    const style = document.createElement('style');
    style.textContent = selectionActionButtonsCSS;
    this.buttonShadowRoot.appendChild(style);

    // Create inner container for glass effect
    const innerContainer = document.createElement('div');
    innerContainer.className = 'selection-ai-buttons-inner';

    // Create button elements
    buttons.forEach(button => {
      const buttonEl = document.createElement('button');
      buttonEl.className = 'selection-ai-button';
      buttonEl.innerHTML = button.icon;
      buttonEl.title = button.label;
      buttonEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleClick(button.id);
      });

      innerContainer.appendChild(buttonEl);
    });

    // Append inner container to shadow root
    this.buttonShadowRoot.appendChild(innerContainer);

    // Add to DOM
    document.body.appendChild(this.buttonContainer);

    // Trigger fade in animation after a brief delay
    requestAnimationFrame(() => {
      if (this.buttonContainer) {
        this.buttonContainer.classList.add('visible');
      }
    });

    // Clear any existing timeout
    if (this.buttonTimeout) {
      clearTimeout(this.buttonTimeout);
    }
  }

  /**
   * Handle button click
   * @param {string} action - Button action ID
   */
  handleClick(action) {
    console.log('Action button clicked:', action);
    
    // Hide buttons
    this.hideButtons();

    // Notify parent
    this.onButtonClick(action);
  }

  /**
   * Hide action buttons with animation
   */
  hideButtons() {
    // Clear any pending timeout
    if (this.buttonTimeout) {
      clearTimeout(this.buttonTimeout);
      this.buttonTimeout = null;
    }

    if (this.buttonContainer) {
      // Remove visible class to trigger fade out
      this.buttonContainer.classList.remove('visible');

      // Wait for transition to complete before removing from DOM
      setTimeout(() => {
        if (this.buttonContainer) {
          this.buttonContainer.remove();
          this.buttonContainer = null;
          this.buttonShadowRoot = null;
        }
      }, 300); // Match the CSS transition duration
    }
  }

  /**
   * Check if buttons are currently visible
   * @returns {boolean}
   */
  isVisible() {
    return this.buttonContainer !== null;
  }

  /**
   * Get the button container element
   * @returns {HTMLElement|null}
   */
  getContainer() {
    return this.buttonContainer;
  }

  /**
   * Set a timeout to auto-hide buttons
   * @param {number} duration - Timeout duration in ms
   */
  setAutoHideTimeout(duration) {
    // Clear any existing timeout
    if (this.buttonTimeout) {
      clearTimeout(this.buttonTimeout);
    }

    this.buttonTimeout = setTimeout(() => {
      this.hideButtons();
    }, duration);
  }

  /**
   * Clear the auto-hide timeout
   */
  clearAutoHideTimeout() {
    if (this.buttonTimeout) {
      clearTimeout(this.buttonTimeout);
      this.buttonTimeout = null;
    }
  }
}

