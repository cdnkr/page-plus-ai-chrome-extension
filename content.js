// Content script for handling text selection and AI interactions
class SelectionAI {
  constructor() {
    this.selectedText = '';
    this.selectionPosition = null;
    this.buttonContainer = null;
    this.popover = null;
    this.isInitialized = false;
    this.selectionRange = null;
    this.originalSelectionStyle = null;
    this.PopoverAI = null;
    this.buttonTimeout = null;
    this.position = null;
    
    this.loadPopoverModule();
    this.init();
  }

  async loadPopoverModule() {
    try {
      console.log('Attempting to load PopoverAI module...');
      const module = await import(chrome.runtime.getURL('popover.js'));
      console.log('Module loaded:', module);
      this.PopoverAI = module.PopoverAI;
      console.log('PopoverAI class:', this.PopoverAI);
      console.log('PopoverAI module loaded successfully');
    } catch (error) {
      console.error('Failed to load PopoverAI module:', error);
    }
  }

  init() {
    // Check if AI APIs are available
    this.checkAIAvailability();
    
    // Listen for text selection
    document.addEventListener('mouseup', this.handleTextSelection.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Listen for escape key to close popover
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Listen for resize to update positions (not scroll - elements should stay anchored)
    window.addEventListener('resize', this.updatePositions.bind(this), { passive: true });
    
    // Listen for popover closed event
    window.addEventListener('popoverClosed', this.handlePopoverClosed.bind(this));
  }

  async checkAIAvailability() {
    try {
      // Check for Prompt API
      if ('LanguageModel' in self) {
        console.log('Prompt API is available');
      }
      
      // Check for Summarizer API
      if ('Summarizer' in self) {
        console.log('Summarizer API is available');
      }
      
      // Check for Writer API
      if ('Writer' in self) {
        console.log('Writer API is available');
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('AI APIs not available:', error);
    }
  }

  handleTextSelection(event) {
    // Don't show buttons if they're already visible or if popover is open
    if (this.buttonContainer || this.popover) {
      return;
    }

    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };  
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 0) {
      this.selectedText = selectedText;
      this.position = mousePosition;
      this.selectionPosition = mousePosition;
      
      // Store the selection range for anchoring
      this.selectionRange = selection.getRangeAt(0).cloneRange();
      
      // Store selected text in extension storage
      chrome.storage.local.set({ 
        selectedText: this.selectedText,
      });
      
      // Show action buttons
      this.showActionButtons(mousePosition);
    }
  }

  showActionButtons(position) {
    // Remove existing buttons
    this.hideActionButtons();
    
    // Calculate boundary-aware position
    const safePosition = this.calculateSafePosition(position, { width: 200, height: 60 });
    
    // Create button container with Shadow DOM for style isolation
    this.buttonContainer = document.createElement('div');
    this.buttonContainer.className = 'selection-ai-buttons';
    
    // Calculate absolute position relative to page content (not viewport)
    const absolutePosition = this.calculateAbsolutePosition(safePosition);
    
    this.buttonContainer.style.cssText = `
      position: absolute;
      left: ${absolutePosition.x}px;
      top: ${absolutePosition.y}px;
    `;
    
    // Create shadow root for complete style isolation
    this.buttonShadowRoot = this.buttonContainer.attachShadow({ mode: 'open' });
    
    // Add CSS styles to shadow root for complete isolation
    const style = document.createElement('style');
    style.textContent = `
      .selection-ai-buttons {
        background: rgba(255, 255, 255, 1);
        backdrop-filter: blur(10px);
        border-radius: 25px;
        padding: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.1);
        opacity: 0;
        filter: blur(20px);
        transition: opacity 0.3s ease-out, filter 0.3s ease-out;
      }
      
      .selection-ai-buttons.visible {
        opacity: 1;
        filter: blur(0px);
      }
      
      .selection-ai-buttons-inner {
        padding: 8px;
        display: flex;
        gap: 8px;
        border-radius: 25px;
      }
      
      .selection-ai-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        color: black;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        position: relative;
        background: transparent;
      }
      
      .selection-ai-button:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      
      .selection-ai-button svg {
        width: 20px;
        height: 20px;
      }
    `;
    this.buttonShadowRoot.appendChild(style);
    
    // Create inner container for glass effect
    const innerContainer = document.createElement('div');
    innerContainer.className = 'selection-ai-buttons-inner';
    
    // Add to DOM first, then trigger animation
    document.body.appendChild(this.buttonContainer);
    
    // Trigger fade in animation after a brief delay
    requestAnimationFrame(() => {
      this.buttonContainer.classList.add('visible');
    });
    
    // Create buttons
    const buttons = [
      { id: 'prompt', icon: this.getPromptIcon(), label: 'Prompt' },
      { id: 'summarize', icon: this.getSummarizeIcon(), label: 'Summarize' },
      { id: 'write', icon: this.getWriteIcon(), label: 'Write' }
    ];
    
    buttons.forEach(button => {
      const buttonEl = document.createElement('button');
      buttonEl.className = 'selection-ai-button';
      buttonEl.innerHTML = button.icon;
      buttonEl.title = button.label;
      buttonEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleButtonClick(button.id);
      });
      
      innerContainer.appendChild(buttonEl);
    });
    
    // Append inner container to shadow root
    this.buttonShadowRoot.appendChild(innerContainer);
    
    // Clear any existing timeout
    if (this.buttonTimeout) {
      clearTimeout(this.buttonTimeout);
    }
  }

  hideActionButtons() {
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
        }
      }, 300); // Match the CSS transition duration
    }
  }

  handleButtonClick(action) {
    console.log('Button clicked:', action);
    console.log('PopoverAI available:', !!this.PopoverAI);
    
    // Don't clear text selection - we want to keep it highlighted
    // window.getSelection().removeAllRanges();
    
    // Don't hide buttons - keep them visible when popover is open
    this.hideActionButtons();
    
    switch (action) {
      case 'prompt':
        console.log('Creating prompt popover...');
        this.showPopover('prompt').catch(console.error);
        break;
      case 'summarize':
        console.log('Creating summarize popover...');
        this.showPopover('summarize').catch(console.error);
        break;
      case 'write':
        console.log('Creating write popover...');
        this.showPopover('write').catch(console.error);
        break;
    }
  }

  async showPopover(action) {
    console.log('showPopover called with action:', action);
    console.log('Selected text:', this.selectedText);
    console.log('Selection range:', this.selectionRange);
    
    // Apply selection highlighting
    this.highlightSelection();
    
    // Get position from selection range
    const position = this.position;
    console.log('Calculated position:', position);
    
    // Wait for PopoverAI to be loaded
    if (!this.PopoverAI) {
      console.log('Waiting for PopoverAI module to load...');
      // Wait a bit for the module to load
      let attempts = 0;
      while (!this.PopoverAI && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
    }
    
    // Create popover using the PopoverAI class
    if (this.PopoverAI) {
      console.log('Creating popover with PopoverAI class');
      try {
        this.popover = new this.PopoverAI(action, this.selectedText, position, this.selectionRange);
        console.log('Popover created:', this.popover);
        console.log('Popover element:', this.popover?.popoverElement);
        console.log('Shadow root:', this.popover?.shadowRoot);
      } catch (error) {
        console.error('Error creating popover:', error);
      }
    } else {
      console.error('PopoverAI not loaded after waiting. Attempting to load again...');
      // Try to load the module again
      try {
        const module = await import(chrome.runtime.getURL('popover.js'));
        this.PopoverAI = module.PopoverAI;
        if (this.PopoverAI) {
          console.log('PopoverAI loaded on retry');
          this.popover = new this.PopoverAI(action, this.selectedText, position);
        } else {
          console.error('PopoverAI still not available after retry');
        }
      } catch (error) {
        console.error('Failed to load PopoverAI on retry:', error);
      }
    }
  }

  // Remove old message handling since we're not using iframe anymore

  resizePopover(height) {
    if (this.popover) {
      // Add some padding and ensure minimum height
      const minHeight = 200;
      const maxHeight = 600;
      const finalHeight = Math.min(Math.max(height + 20, minHeight), maxHeight);
      
      this.popover.style.height = `${finalHeight}px`;
    }
  }

  closePopover() {
    if (this.popover) {
      this.popover.close();
      this.popover = null;
    }
    // Remove selection highlighting
    this.removeSelectionHighlight();
    // Hide buttons when popover is closed
    this.hideActionButtons();
    
    // Clear any pending timeout
    if (this.buttonTimeout) {
      clearTimeout(this.buttonTimeout);
      this.buttonTimeout = null;
    }
    
    // Reset state to allow new selections
    this.selectionRange = null;
    this.selectedText = '';
    this.selectionPosition = null;
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  async shareText(text) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Content',
          text: text
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      // Fallback to copying
      this.copyToClipboard(text);
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10002;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  handleClick(event) {
    // Close popover if clicking outside (but not on action buttons or popover content)
    if (this.popover && this.popover.popoverElement) {
      const isClickInsidePopover = this.popover.popoverElement.contains(event.target);
      const isClickOnActionButtons = this.buttonContainer?.contains(event.target);
      
      if (!isClickInsidePopover && !isClickOnActionButtons) {
        console.log('Clicking outside popover, closing...');
        this.closePopover();
      }
    }
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      this.closePopover();
      this.hideActionButtons();
    }
  }

  handlePopoverClosed() {
    // Hide action buttons when popover is closed from within
    this.hideActionButtons();
    this.removeSelectionHighlight();
    
    // Clear any pending timeout
    if (this.buttonTimeout) {
      clearTimeout(this.buttonTimeout);
      this.buttonTimeout = null;
    }
    
    // Reset state to allow new selections
    this.popover = null;
    this.selectionRange = null;
    this.selectedText = '';
    this.selectionPosition = null;
  }

  // AI request handling moved to PopoverAI class

  // Get position from selection range (anchored to text)
  getSelectionPosition() {
    if (!this.selectionRange) {
      return this.selectionPosition || { x: 0, y: 0 };
    }
    
    try {
      const rect = this.selectionRange.getBoundingClientRect();
      return {
        x: rect.left + (rect.width / 2),
        y: rect.bottom + 10
      };
    } catch (error) {
      console.warn('Could not get selection position:', error);
      return this.selectionPosition || { x: 0, y: 0 };
    }
  }

  // Highlight the selected text with primary color
  highlightSelection() {
    if (!this.selectionRange) return;
    
    try {
      // Store original selection style
      this.originalSelectionStyle = document.createElement('style');
      this.originalSelectionStyle.textContent = `
        ::selection {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        ::-moz-selection {
          background-color: #3b82f6 !important;
          color: white !important;
        }
      `;
      document.head.appendChild(this.originalSelectionStyle);
      
      // Restore the selection
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.selectionRange);
    } catch (error) {
      console.warn('Could not highlight selection:', error);
    }
  }

  // Remove selection highlighting
  removeSelectionHighlight() {
    if (this.originalSelectionStyle) {
      this.originalSelectionStyle.remove();
      this.originalSelectionStyle = null;
    }
  }

  // Calculate safe position that stays within viewport boundaries
  calculateSafePosition(position, elementSize) {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    const margin = 20; // Minimum margin from viewport edges
    
    // Calculate safe horizontal position
    let x = position.x;
    if (x + elementSize.width > viewport.width - margin) {
      x = viewport.width - elementSize.width - margin;
    }
    if (x < margin) {
      x = margin;
    }
    
    // Calculate safe vertical position
    let y = position.y;
    if (y + elementSize.height > viewport.height - margin) {
      y = viewport.height - elementSize.height - margin;
    }
    if (y < margin) {
      y = margin;
    }
    
    return { x, y };
  }

  // Convert viewport coordinates to absolute page coordinates
  calculateAbsolutePosition(viewportPosition) {
    return {
      x: viewportPosition.x + window.scrollX,
      y: viewportPosition.y + window.scrollY
    };
  }

  // Update positions on window resize only
  updatePositions() {
    // Only update positions on window resize to ensure elements stay within viewport
    // Action buttons and popover should stay anchored to their initial position on scroll
    if (this.buttonContainer) {
      // For absolute positioning, we need to recalculate based on current scroll position
      const currentLeft = parseInt(this.buttonContainer.style.left);
      const currentTop = parseInt(this.buttonContainer.style.top);
      
      // Convert absolute position back to viewport coordinates for boundary checking
      const viewportPosition = {
        x: currentLeft - window.scrollX,
        y: currentTop - window.scrollY
      };
      
      const safePosition = this.calculateSafePosition(viewportPosition, { width: 200, height: 60 });
      const absolutePosition = this.calculateAbsolutePosition(safePosition);
      
      // Only update if position actually changed (due to resize)
      if (absolutePosition.x !== currentLeft || absolutePosition.y !== currentTop) {
        this.buttonContainer.style.left = `${absolutePosition.x}px`;
        this.buttonContainer.style.top = `${absolutePosition.y}px`;
      }
    }
    
    // Popover should stay anchored to its initial position
    // No position updates needed on scroll
  }

  // Icon getters
  getPromptIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>`;
  }

  getSummarizeIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/></svg>`;
  }

  getWriteIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 21h8"/><path d="m15 5 4 4"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>`;
  }
}

// Initialize the extension
new SelectionAI();
