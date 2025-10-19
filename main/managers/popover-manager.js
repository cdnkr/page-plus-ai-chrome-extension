/**
 * PopoverManager - Manages popover creation, lifecycle, and interactions
 * Handles PopoverAI module loading and different popover types
 */

export class PopoverManager {
  constructor(config = {}) {
    this.popover = null;
    this.PopoverAI = null;
    this.isModuleLoading = false;
    
    // Configuration callbacks
    this.onPopoverCreated = config.onPopoverCreated || (() => {});
    this.onPopoverClosed = config.onPopoverClosed || (() => {});
    this.getApiAvailability = config.getApiAvailability || (() => ({}));
    this.getLocale = config.getLocale || (() => 'en-US');
    this.setButtonActive = config.setButtonActive || (() => {});
    this.highlightSelection = config.highlightSelection || (() => {});
    this.removeHighlight = config.removeHighlight || (() => {});
  }

  /**
   * Load the PopoverAI module
   * @returns {Promise<Object>} Module and i18n objects
   */
  async loadPopoverModule() {
    if (this.PopoverAI) {
      return { PopoverAI: this.PopoverAI, i18n: null };
    }

    if (this.isModuleLoading) {
      // Wait for existing load to complete
      while (this.isModuleLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return { PopoverAI: this.PopoverAI, i18n: null };
    }

    this.isModuleLoading = true;

    try {
      console.log('Attempting to load PopoverAI module...');
      const [module, i18n] = await Promise.all([
        import(chrome.runtime.getURL('popover/index.js')),
        import(chrome.runtime.getURL('i18n.js')).catch(() => null)
      ]);
      console.log('Module loaded:', module);
      this.PopoverAI = module.PopoverAI;
      console.log('PopoverAI class:', this.PopoverAI);
      console.log('PopoverAI module loaded successfully');
      
      this.isModuleLoading = false;
      return { PopoverAI: this.PopoverAI, i18n };
    } catch (error) {
      console.error('Failed to load PopoverAI module:', error);
      this.isModuleLoading = false;
      return { PopoverAI: null, i18n: null };
    }
  }

  /**
   * Wait for PopoverAI module to be loaded
   * @param {number} maxAttempts - Maximum number of attempts
   * @returns {Promise<boolean>} Success status
   */
  async waitForModule(maxAttempts = 50) {
    if (this.PopoverAI) return true;

    console.log('Waiting for PopoverAI module to load...');
    let attempts = 0;
    while (!this.PopoverAI && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    return !!this.PopoverAI;
  }

  /**
   * Show a text selection popover
   * @param {string} action - Action type (prompt, summarize, write, settings, history)
   * @param {string} text - Selected text or payload
   * @param {Object} position - Position coordinates
   * @param {Range} selectionRange - Selection range object
   * @param {string} selectionType - Type of selection (text, page)
   * @param {string} pageScreenshot - Pre-captured screenshot for page mode
   * @returns {Promise<boolean>} Success status
   */
  async showPopover(action, text, position, selectionRange = null, selectionType = 'text', pageScreenshot = null) {
    console.log('showPopover called with action:', action);
    console.log('Selected text:', text);
    console.log('Selection range:', selectionRange);
    console.log('Calculated position:', position);

    // Wait for PopoverAI to be loaded
    const isLoaded = await this.waitForModule();
    
    if (!isLoaded) {
      console.error('PopoverAI not loaded after waiting. Attempting to load again...');
      // Try to load the module again
      try {
        const module = await import(chrome.runtime.getURL('popover.js'));
        this.PopoverAI = module.PopoverAI;
      } catch (error) {
        console.error('Failed to load PopoverAI on retry:', error);
        return false;
      }
    }

    // Create popover using the PopoverAI class
    if (this.PopoverAI) {
      console.log('Creating popover with PopoverAI class');
      try {
        const payload = action === 'settings'
          ? JSON.stringify({ availability: this.getApiAvailability(), locale: this.getLocale() })
          : text;
        
        this.popover = new this.PopoverAI(action, payload, position, selectionRange, selectionType, pageScreenshot);
        
        // Set active state for special buttons
        if (action === 'settings') {
          this.setButtonActive('selection-ai-settings-btn', true);
        } else if (action === 'history') {
          this.setButtonActive('selection-ai-history-btn', true);
        } else if (selectionType === 'page') {
          this.setButtonActive('selection-ai-current-page-btn', true);
        }
        
        console.log('Popover created:', this.popover);
        console.log('Popover element:', this.popover?.popoverElement);
        console.log('Shadow root:', this.popover?.shadowRoot);
        
        this.onPopoverCreated(this.popover);
        return true;
      } catch (error) {
        console.error('Error creating popover:', error);
        return false;
      }
    }

    console.error('PopoverAI still not available after retry');
    return false;
  }

  /**
   * Show a drag box popover (with screenshot)
   * @param {string} action - Action type
   * @param {string} screenshot - Screenshot data URL
   * @param {Object} position - Position coordinates
   * @returns {Promise<boolean>} Success status
   */
  async showDragBoxPopover(action, screenshot, position) {
    console.log('showDragBoxPopover called with action:', action);

    // Wait for PopoverAI to be loaded
    const isLoaded = await this.waitForModule();
    if (!isLoaded) {
      console.error('PopoverAI not loaded');
      return false;
    }

    // Create popover using the PopoverAI class
    if (this.PopoverAI) {
      console.log('Creating drag box popover with PopoverAI class');
      try {
        this.popover = new this.PopoverAI(action, screenshot, position, null, 'dragbox');
        console.log('Drag box popover created:', this.popover);
        this.onPopoverCreated(this.popover);
        return true;
      } catch (error) {
        console.error('Error creating drag box popover:', error);
        return false;
      }
    }

    return false;
  }

  /**
   * Show colors popover
   * @param {string} screenshot - Screenshot data URL
   * @param {Object} position - Position coordinates
   * @returns {Promise<boolean>} Success status
   */
  async showColorsPopover(screenshot, position) {
    console.log('showColorsPopover called');

    // Wait for PopoverAI to be loaded
    const isLoaded = await this.waitForModule();
    if (!isLoaded) {
      console.error('PopoverAI not loaded');
      return false;
    }

    // Create colors popover using the PopoverAI class
    if (this.PopoverAI) {
      console.log('Creating colors popover with PopoverAI class');
      try {
        this.popover = new this.PopoverAI('colors', screenshot, position, null, 'dragbox');
        console.log('Colors popover created:', this.popover);
        this.onPopoverCreated(this.popover);
        return true;
      } catch (error) {
        console.error('Error creating colors popover:', error);
        return false;
      }
    }

    return false;
  }

  /**
   * Close the current popover
   */
  closePopover() {
    if (this.popover) {
      this.popover.close();
      this.popover = null;
    }
    
    // Remove selection highlighting
    this.removeHighlight();
    
    // Remove active state from buttons
    this.setButtonActive('selection-ai-settings-btn', false);
    this.setButtonActive('selection-ai-current-page-btn', false);
    this.setButtonActive('selection-ai-history-btn', false);
    
    // Notify parent
    this.onPopoverClosed();
  }

  /**
   * Resize the current popover
   * @param {number} height - New height
   */
  resizePopover(height) {
    if (this.popover) {
      // Add some padding and ensure minimum height
      const minHeight = 200;
      const maxHeight = 600;
      const finalHeight = Math.min(Math.max(height + 20, minHeight), maxHeight);

      this.popover.style.height = `${finalHeight}px`;
    }
  }

  /**
   * Check if a popover is currently open
   * @returns {boolean}
   */
  isPopoverOpen() {
    return this.popover !== null;
  }

  /**
   * Get the current popover instance
   * @returns {Object|null}
   */
  getPopover() {
    return this.popover;
  }

  /**
   * Get the popover element
   * @returns {HTMLElement|null}
   */
  getPopoverElement() {
    return this.popover?.popoverElement || null;
  }

  /**
   * Check if click is inside popover
   * @param {Event} event - Click event
   * @returns {boolean}
   */
  isClickInsidePopover(event) {
    const popoverElement = this.getPopoverElement();
    return popoverElement ? popoverElement.contains(event.target) : false;
  }
}

