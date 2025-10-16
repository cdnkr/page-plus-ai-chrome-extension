// Styles

const selectionActionButtonsCSS = `

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
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    position: relative;
    background: transparent;
  }
  
  .selection-ai-button:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 1);
  }
  
  .selection-ai-button svg {
    width: 20px;
    height: 20px;
  }
`;

function getButtonContainerCSS(position) {
  return `
    position: absolute;
    left: ${position.x}px;
    top: ${position.y}px;
  `;
}

const notificationCSS = `
  position: fixed;
  top: 20px;
  right: 20px;
  background: #ffffff;
  color: black;
  padding: 12px 20px;
  border-radius: 50px;
  z-index: 10002;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  opacity: 0;
  filter: blur(20px);
  transition: opacity 0.3s ease-out, filter 0.3s ease-out;
`;

const selectionHighlightCSS = `
  ::selection {
    background-color: #fecf02 !important;
    color: black !important;
  }
  ::-moz-selection {
    background-color: #fecf02 !important;
    color: black !important;
  }
`;

const modeSwitcherCSS = `
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 10000;
`;

const modeSwitcherRootCSS = `
  .mode-switcher {
    display: flex;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 25px 25px 25px 25px;
    padding: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
    transition: all 0.4s ease;
    gap: 4px;
  }

  .mode-switcher.hidden {
    opacity: 0;
    filter: blur(20px);
  }

  .mode-switcher .home-button {
    width: 36px;
    height: 36px;
    /* background: #fecf02; */
    border-radius: 50%;
    flex-shrink: 0;
    cursor: pointer !important;
  }

  .mode-switcher .home-button:active {
    scale: 1.05;
  }
  
  .mode-switcher .mode-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer !important;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.5);
  }

  .mode-btn.hidden {
    display: none;
  }

  .mode-switcher .mode-btn,
   .mode-switcher .mode-btn svg,
   .mode-switcher .mode-btn path,
   .mode-switcher .mode-btn svg rect,
   .mode-switcher .mode-btn svg line,
   .mode-switcher .mode-btn svg polyline,
   .mode-btn canvas {
    cursor: pointer !important;
  }
  
  .mode-btn.active {
    background: rgba(255, 255, 255, 0.07);
    color: white;
  }
  
  .mode-btn:hover:not(.active) {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 1);
  }
  
  /* Override cursor for mode switcher */
  .mode-switcher {
    cursor: default !important;
  }
  
  .mode-switcher * {
    cursor: default !important;
  }
  
  .mode-btn {
    cursor: pointer !important;
  }
`;

const cursorCSS = `
  body.text-mode-active {
    cursor: text !important;
  }
  
  body.drag-mode-active {
    cursor: crosshair !important;
  }
  
  body.drag-mode-active * {
    cursor: crosshair !important;
  }
  
  /* Override cursor for extension UI elements - more specific selectors */
  .selection-ai-popover,
  .selection-ai-popover *,
  .selection-ai-buttons,
  .selection-ai-buttons *,
  .selection-ai-mode-switcher,
  .selection-ai-mode-switcher *,
  .selection-ai-drag-box-container,
  .selection-ai-drag-box-container * {
    cursor: default !important;
  }
  
  /* Additional overrides for shadow DOM elements */
  [class*="selection-ai"] {
    cursor: default !important;
  }
  
  [class*="selection-ai"] * {
    cursor: default !important;
  }
`;

const dragBoxContainerCSS = `
  position: absolute;
  left: 0px;
  top: 0px;
  pointer-events: none;
  z-index: 10000;
`;

const dragBoxCSS = `
  .drag-box {
    position: absolute;
    border: 2px dashed #fecf02;
    pointer-events: none;
  }
`;

function getDragBoxCSS({ x, y, width, height }) {
  return `
  left: ${x}px;
  top: ${y}px;
  width: ${width}px;
  height: ${height}px;
`;
}

// Icons

const ICONS = {
  text: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-italic-icon lucide-italic"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-align-end-icon lucide-text-align-end"><path d="M21 5H3"/><path d="M21 12H9"/><path d="M21 19H7"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="position:absolute; right:-12px; top:-12px; border-radius:50%; background:red;height:18px;width:18px;"><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  dashedBox: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-squircle-dashed-icon lucide-squircle-dashed"><path d="M13.77 3.043a34 34 0 0 0-3.54 0"/><path d="M13.771 20.956a33 33 0 0 1-3.541.001"/><path d="M20.18 17.74c-.51 1.15-1.29 1.93-2.439 2.44"/><path d="M20.18 6.259c-.51-1.148-1.291-1.929-2.44-2.438"/><path d="M20.957 10.23a33 33 0 0 1 0 3.54"/><path d="M3.043 10.23a34 34 0 0 0 .001 3.541"/><path d="M6.26 20.179c-1.15-.508-1.93-1.29-2.44-2.438"/><path d="M6.26 3.82c-1.149.51-1.93 1.291-2.44 2.44"/></svg>`,
  colors: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  prompt: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>`,
  summarize: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/></svg>`,
  write: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 21h8"/><path d="m15 5 4 4"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>`,
  page: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  history: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`
}

// Utils

function extractStructuredTextWithLinks(html) {
  const container = document.createElement('div');
  container.innerHTML = html;
  const origin = window.location.origin;
  function traverse(node) {
    const segments = [];
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) segments.push({ type: 'text', content: text });
      return segments;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node;
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'style' || tagName === 'script' || tagName === 'noscript' || tagName === 'meta' || tagName === 'link') {
        return segments;
      }
      if (tagName === 'a') {
        const hrefAttr = el.getAttribute('href') || '';
        const href = hrefAttr.startsWith('/') ? origin + hrefAttr : hrefAttr;
        const text = el.textContent?.trim() || '';
        segments.push({ type: 'link', text, href });
        return segments;
      }
      for (const child of Array.from(el.childNodes)) {
        segments.push(...traverse(child));
      }
    }
    return segments;
  }
  return traverse(container);
}

function segmentsToMarkdown(segments) {
  const limit = 2000;
  // Simple joiner: links -> [text](href), text -> content; keep spacing
  const parts = [];
  for (const seg of segments) {
    if (seg.type === 'link') {
      if (seg.text) parts.push(`[${seg.text}](${seg.href})`);
      else parts.push(seg.href);
    } else if (seg.type === 'text') {
      parts.push(seg.content);
    }
  }
  const response = parts.join(' ').replace(/\s{2,}/g, ' ').trim();

  console.log('response length', response.length)

  // Collapse excessive whitespace while preserving basic sentence spacing
  return response.slice(0, limit);
}

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

    // Mode switching
    this.currentMode = null; // null, 'text', or 'drag'
    this.modeSwitcher = null;

    // Drag box selection
    this.dragBox = null;
    this.dragStart = null;
    this.dragEnd = null;
    this.isDragging = false;
    this.dragBoxContainer = null;

    // Settings / availability
    this.apiAvailability = {
      prompt: 'unknown',
      summarizer: 'unknown',
      writer: 'unknown'
    };
    this.locale = navigator.language || 'en-US';

    // Listen for overrides from settings popover
    window.addEventListener('selectionAiAvailabilityOverride', (e) => {
      // Merge overrides into availability preview for icon badge
      try {
        const overrides = e.detail || {};
        const effective = { ...this.apiAvailability };
        ['prompt', 'summarizer', 'writer'].forEach(k => {
          if (overrides[k] && overrides[k].state) {
            effective[k] = overrides[k].state;
          }
        });
        this.apiAvailability = effective;
        this.updateSettingsButtonIcon();
      } catch (_) { }
    });

    // Listen for availability refresh (when real API state is re-checked after download)
    window.addEventListener('selectionAiAvailabilityRefresh', (e) => {
      try {
        const { key, status } = e.detail || {};
        if (key && status) {
          this.apiAvailability[key] = status;
          this.updateSettingsButtonIcon();
          
          // If a new API became available, recreate mode switcher to show new buttons
          if (status === 'available') {
            this.recreateModeSwitcher();
          }
        }
      } catch (_) { }
    });

    this.loadPopoverModule();
    this.init();
  }

  async loadPopoverModule() {
    try {
      console.log('Attempting to load PopoverAI module...');
      const [module, i18n] = await Promise.all([
        import(chrome.runtime.getURL('popover.js')),
        import(chrome.runtime.getURL('i18n.js')).catch(() => null)
      ]);
      console.log('Module loaded:', module);
      this.PopoverAI = module.PopoverAI;
      console.log('PopoverAI class:', this.PopoverAI);
      console.log('PopoverAI module loaded successfully');
      if (i18n && i18n.initI18n) {
        try { await i18n.initI18n(); } catch (_) { }
        this.i18n = i18n;
      }
    } catch (error) {
      console.error('Failed to load PopoverAI module:', error);
    }
  }

  async init() {
    // Check if AI APIs are available
    await this.checkAIAvailability();

    // Create mode switcher
    this.createModeSwitcher();

    // Listen for text selection
    document.addEventListener('mouseup', this.handleTextSelection.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));

    // Listen for drag box selection
    document.addEventListener('mousedown', this.handleDragStart.bind(this));
    document.addEventListener('mousemove', this.handleDragMove.bind(this));
    document.addEventListener('mouseup', this.handleDragEnd.bind(this));

    // Listen for escape key to close popover
    document.addEventListener('keydown', this.handleKeydown.bind(this));

    // Listen for resize to update positions (not scroll - elements should stay anchored)
    window.addEventListener('resize', this.updatePositions.bind(this), { passive: true });

    // Listen for popover closed event
    window.addEventListener('popoverClosed', this.handlePopoverClosed.bind(this));

    // Listen for AI streaming events to animate home button
    window.addEventListener('aiStreamingStart', this.handleStreamingStart.bind(this));
    window.addEventListener('aiStreamingEnd', this.handleStreamingEnd.bind(this));
  }

  async checkAIAvailability() {
    try {
      // Load persisted locale
      chrome.storage.local.get(['selection_ai_locale']).then(({ selection_ai_locale }) => {
        if (selection_ai_locale) {
          this.locale = selection_ai_locale;
          try { window.__selection_ai_cached_locale = selection_ai_locale; } catch (_) { }
        }
      }).catch(() => { });

      // Apply stored debug overrides first
      const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
      const overrides = overridesObj.selection_ai_debug_overrides || {};

      // Prompt API
      if ('LanguageModel' in self && typeof LanguageModel.availability === 'function') {
        const status = await LanguageModel.availability();
        this.apiAvailability.prompt = overrides.prompt?.state || status || 'available';
      } else {
        this.apiAvailability.prompt = overrides.prompt?.state || 'unavailable';
      }

      // Summarizer API
      if ('Summarizer' in self && typeof Summarizer.availability === 'function') {
        const status = await Summarizer.availability();
        this.apiAvailability.summarizer = overrides.summarizer?.state || status || 'available';
      } else {
        this.apiAvailability.summarizer = overrides.summarizer?.state || 'unavailable';
      }

      // Writer API
      if ('Writer' in self && typeof Writer.availability === 'function') {
        const status = await Writer.availability();
        this.apiAvailability.writer = overrides.writer?.state || status || 'available';
      } else {
        this.apiAvailability.writer = overrides.writer?.state || 'unavailable';
      }

      this.isInitialized = true;
      // Refresh settings button badge/icon if present
      this.updateSettingsButtonIcon();
    } catch (error) {
      console.error('AI APIs not available:', error);
    }
  }

  handleTextSelection(event) {
    // Only handle text selection in text mode
    if (this.currentMode !== 'text') {
      return;
    }

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

    // Add to DOM first, then trigger animation
    document.body.appendChild(this.buttonContainer);

    // Trigger fade in animation after a brief delay
    requestAnimationFrame(() => {
      this.buttonContainer.classList.add('visible');
    });

    // Create buttons
    const t = this.i18n?.t || ((k) => k);
    const buttons = [
      { id: 'prompt', icon: ICONS.prompt, label: t('button_prompt') },
      { id: 'summarize', icon: ICONS.summarize, label: t('button_summarize') },
      { id: 'write', icon: ICONS.write, label: t('button_write') }
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
      // settings handled from mode switcher
    }
  }

  async showPopover(action, selectionType) {
    console.log('showPopover called with action:', action);
    console.log('Selected text:', this.selectedText);
    console.log('Selection range:', this.selectionRange);

    // Apply selection highlighting (not needed for settings)
    if (action !== 'settings') {
      this.highlightSelection();
    }

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
        const payload = action === 'settings'
          ? JSON.stringify({ availability: this.apiAvailability, locale: this.locale })
          : this.selectedText;
        this.popover = new this.PopoverAI(action, payload, position, this.selectionRange, selectionType || 'text');
        
        // Set active state for settings, history, or current page buttons
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
          const payload = action === 'settings'
            ? JSON.stringify({ availability: this.apiAvailability, locale: this.locale })
            : this.selectedText;
          this.popover = new this.PopoverAI(action, payload, position, this.selectionRange, selectionType || 'text');
          
          // Set active state for settings, history, or current page buttons
          if (action === 'settings') {
            this.setButtonActive('selection-ai-settings-btn', true);
          } else if (action === 'history') {
            this.setButtonActive('selection-ai-history-btn', true);
          } else if (selectionType === 'page') {
            this.setButtonActive('selection-ai-current-page-btn', true);
          }
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
    // Hide drag box when popover is closed
    this.hideDragBox();

    // Remove active state from buttons
    this.setButtonActive('selection-ai-settings-btn', false);
    this.setButtonActive('selection-ai-current-page-btn', false);
    this.setButtonActive('selection-ai-history-btn', false);

    // Clear any pending timeout
    if (this.buttonTimeout) {
      clearTimeout(this.buttonTimeout);
      this.buttonTimeout = null;
    }

    // Reset state to allow new selections
    this.selectionRange = null;
    this.selectedText = '';
    this.selectionPosition = null;
    this.dragStart = null;
    this.dragEnd = null;
    this.isDragging = false;
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
    notification.style.cssText = notificationCSS;

    document.body.appendChild(notification);

    setTimeout(() => {
      // Trigger fade in
      requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.filter = 'blur(0px)';
      });
    }, 100);

    setTimeout(() => {
      // Fade out before removing
      notification.style.opacity = '0';
      notification.style.filter = 'blur(20px)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2700);
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
    // Hide drag box when popover is closed
    this.hideDragBox();

    // Remove active state from buttons
    this.setButtonActive('selection-ai-settings-btn', false);
    this.setButtonActive('selection-ai-current-page-btn', false);
    this.setButtonActive('selection-ai-history-btn', false);

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
    this.dragStart = null;
    this.dragEnd = null;
    this.isDragging = false;
  }

  handleStreamingStart() {
    // Start the home button pulse animation while streaming
    if (this.homeButtonPulse) {
      // Use a long duration - will be stopped when streaming ends
      this.homeButtonPulse.start(60000); // 60 seconds max
      this.isStreaming = true;
    }
  }

  handleStreamingEnd() {
    // Mark streaming as ended and stop the animation
    this.isStreaming = false;
    if (this.homeButtonPulse) {
      this.homeButtonPulse.stop();
    }
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

  // Mode switcher methods
  createModeSwitcher() {
    this.modeSwitcher = document.createElement('div');
    this.modeSwitcher.className = 'selection-ai-mode-switcher';

    this.modeSwitcher.style.cssText = modeSwitcherCSS;

    // Create shadow root for style isolation
    this.modeSwitcherShadowRoot = this.modeSwitcher.attachShadow({ mode: 'open' });

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = modeSwitcherRootCSS;
    this.modeSwitcherShadowRoot.appendChild(style);

    // Create inner container
    const innerContainer = document.createElement('div');
    innerContainer.className = 'mode-switcher';

    const homeButton = document.createElement('button');
    homeButton.className = 'mode-btn';
    homeButton.innerHTML = `<div id="home-button" class="home-button"></div>`;
    homeButton.addEventListener('click', () => {
      if (this.homeButtonPulse) {

        this.homeButtonPulse.start(300);
        setTimeout(() => {
          this.toggleActionButtons();
        }, 300);
      }
    });

    // Create mode buttons
    const t = this.i18n?.t || ((k) => k);

    let textBtn = null;
    let currentPageBtn = null;
    if (this.apiAvailability.prompt === 'available' || this.apiAvailability.summarizer === 'available' || this.apiAvailability.writer === 'available') {
      textBtn = document.createElement('button');
      textBtn.className = 'mode-btn hidden';
      textBtn.innerHTML = ICONS.text;
      textBtn.title = t('mode_text');
      textBtn.addEventListener('click', () => this.toggleMode('text'));
    }

    const dragBtn = document.createElement('button');
    dragBtn.className = 'mode-btn hidden';
    dragBtn.innerHTML = ICONS.dashedBox;
    dragBtn.title = t('mode_drag');
    dragBtn.addEventListener('click', () => this.toggleMode('drag'));

    if (this.apiAvailability.prompt === 'available') {
      currentPageBtn = document.createElement('button');
      currentPageBtn.className = 'mode-btn hidden';
      currentPageBtn.setAttribute('id', 'selection-ai-current-page-btn');
      currentPageBtn.innerHTML = ICONS.page;
      currentPageBtn.title = t('mode_current_page');
      currentPageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        try {
          const rect = this.modeSwitcher.getBoundingClientRect();
          const popoverWidth = 400;
          const margin = 20; // 20px above mode switcher
          const pos = {
            x: rect.left + (rect.width / 2) - (popoverWidth / 2),
            bottomY: rect.top - margin, // Bottom edge should be 20px above mode switcher
            anchorFromBottom: true
          };
          this.position = pos;
          // Build current page context
          const segments = extractStructuredTextWithLinks(document.body.innerHTML);
          const markdown = segmentsToMarkdown(segments);
          this.selectedText = markdown;
          this.selectionRange = null;
          this.showPopover('prompt', 'page').catch(console.error);
        } catch (err) {
          console.error('Failed to open current page prompt', err);
        }
      });
    }

    const historyBtn = document.createElement('button');
    historyBtn.className = 'mode-btn hidden';
    historyBtn.setAttribute('id', 'selection-ai-history-btn');
    historyBtn.innerHTML = ICONS.history;
    historyBtn.title = t('button_history');

    historyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Position above the mode switcher (centered horizontally), wider for history view
      const rect = this.modeSwitcher.getBoundingClientRect();
      const popoverWidth = 800; // Wider for sidebar layout
      const margin = 20; // 20px above mode switcher
      const pos = {
        x: rect.left + (rect.width / 2) - (popoverWidth / 2),
        bottomY: rect.top - margin, // Bottom edge should be 20px above mode switcher
        anchorFromBottom: true
      };
      this.position = pos;
      this.selectedText = ''; // No text selection for history
      this.selectionRange = null;
      this.showPopover('history').catch(console.error);
    });

    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'mode-btn hidden';
    settingsBtn.setAttribute('id', 'selection-ai-settings-btn');
    settingsBtn.innerHTML = ICONS.settings;
    settingsBtn.title = t('button_settings');

    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Position above the mode switcher (centered horizontally)
      const rect = this.modeSwitcher.getBoundingClientRect();
      const popoverWidth = 400;
      const margin = 20; // 20px above mode switcher
      const pos = {
        x: rect.left + (rect.width / 2) - (popoverWidth / 2),
        bottomY: rect.top - margin, // Bottom edge should be 20px above mode switcher
        anchorFromBottom: true
      };
      this.position = pos;
      this.showPopover('settings').catch(console.error);
    });

    // const logoElement = document.createElement('div');
    // logoElement.className = 'logo-element';
    // logoElement.style.cssText = `
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   height: 40px;
    //   width: 40px;
    // `;
    // logoElement.innerHTML = `<img height="40" width="40" src="${chrome.runtime.getURL('icons/icon128.png')}" alt="Selection AI Logo" />`;
    // innerContainer.appendChild(logoElement);

    if (homeButton) innerContainer.appendChild(homeButton);
    if (textBtn) innerContainer.appendChild(textBtn);
    innerContainer.appendChild(dragBtn);
    if (currentPageBtn) innerContainer.appendChild(currentPageBtn);
    innerContainer.appendChild(historyBtn);
    innerContainer.appendChild(settingsBtn);
    this.modeSwitcherShadowRoot.appendChild(innerContainer);

    // Add to DOM
    document.body.appendChild(this.modeSwitcher);

    this.homeButtonPulse = createPulsingShape(homeButton, 40, 'circle');

    // If this is the first time the user is using the extension and api's are not available, show the settings popover which has
    // details on how to enable and download the required api's.
    chrome.storage.local.get(['firstTimeUse']).then(({ firstTimeUse }) => {
      if (!firstTimeUse) {
        chrome.storage.local.set({ firstTimeUse: true });
      }

      if (
        (
          this.apiAvailability.prompt !== 'available' ||
          this.apiAvailability.summarizer !== 'available' ||
          this.apiAvailability.writer !== 'available'
        ) && !firstTimeUse) {
        // Position above the mode switcher (centered horizontally)
        const rect = this.modeSwitcher.getBoundingClientRect();
        const popoverWidth = 400;
        const margin = 20; // 20px above mode switcher
        const pos = {
          x: rect.left + (rect.width / 2) - (popoverWidth / 2),
          bottomY: rect.top - margin, // Bottom edge should be 20px above mode switcher
          anchorFromBottom: true
        };
        this.position = pos;
        this.showPopover('settings').catch(console.error);
      }
    });


    // React to language changes to update tooltips immediately
    window.addEventListener('selectionAiLanguageChanged', async () => {
      try {
        if (!this.i18n) {
          const i18n = await import(chrome.runtime.getURL('i18n.js'));
          this.i18n = i18n;
          if (this.i18n?.initI18n) await this.i18n.initI18n();
        } else if (this.i18n?.initI18n) {
          await this.i18n.initI18n();
        }
        const t = this.i18n?.t || ((k) => k);
        const buttons = this.modeSwitcherShadowRoot.querySelectorAll('.mode-btn');
        if (buttons[0]) buttons[0].title = t('mode_text');
        if (buttons[1]) buttons[1].title = t('mode_drag');
        const currentBtn = this.modeSwitcherShadowRoot.querySelector('#selection-ai-current-page-btn');
        if (currentBtn) currentBtn.title = t('mode_current_page');
        const historyBtn = this.modeSwitcherShadowRoot.querySelector('#selection-ai-history-btn');
        if (historyBtn) historyBtn.title = t('button_history');
        const settingsBtn = this.modeSwitcherShadowRoot.querySelector('#selection-ai-settings-btn');
        if (settingsBtn) settingsBtn.title = t('button_settings');
      } catch (e) {
        console.warn('Failed to update tooltips after language change', e);
      }
    });
  }

  updateSettingsButtonIcon() {
    if (!this.modeSwitcherShadowRoot) return;
    const btn = this.modeSwitcherShadowRoot.querySelector('#selection-ai-settings-btn');
    if (btn) {
      btn.innerHTML = ICONS.settings;
    }
  }

  recreateModeSwitcher() {
    // Remove existing mode switcher
    if (this.modeSwitcher) {
      this.modeSwitcher.remove();
      this.modeSwitcher = null;
      this.modeSwitcherShadowRoot = null;
    }
    
    // Reset current mode
    this.currentMode = null;
    
    // Recreate with updated availability
    this.createModeSwitcher();
  }

  setButtonActive(buttonId, isActive) {
    if (!this.modeSwitcherShadowRoot) return;
    const btn = this.modeSwitcherShadowRoot.querySelector(`#${buttonId}`);
    if (btn) {
      if (isActive) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  }

  toggleActionButtons() {
    const modeSwitcher = this.modeSwitcherShadowRoot.querySelector('.mode-switcher');
    modeSwitcher.classList.add('hidden');

    setTimeout(() => {
      const btns = this.modeSwitcherShadowRoot.querySelectorAll('.mode-btn:not(.mode-btn:first-child)');

      btns.forEach(btn => {
        if (btn.classList.contains('hidden')) {
          btn.classList.remove('hidden');
        } else {
          btn.classList.add('hidden');
        }
      });
      modeSwitcher.classList.remove('hidden');
    }, 200);
  }

  toggleMode(mode) {
    // If clicking the same mode that's already active, deactivate it
    if (this.currentMode === mode) {
      this.currentMode = null;
    } else {
      // Otherwise, switch to the new mode
      this.currentMode = mode;
    }

    // Update button states
    const buttons = this.modeSwitcherShadowRoot.querySelectorAll('.mode-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Only add active class if a mode is selected
    if (this.currentMode) {
      buttons[this.currentMode === 'text' ? 1 : 2].classList.add('active');
    }

    // Update cursor based on active mode
    this.updateCursor();

    // Clear any existing selections
    this.hideActionButtons();
    this.hideDragBox();
    this.closePopover();

    // Clear text selection if switching modes or deactivating
    if (this.currentMode === 'drag' || this.currentMode === null) {
      window.getSelection().removeAllRanges();
    }

    // Reset drag state
    this.isDragging = false;
    this.dragStart = null;
    this.dragEnd = null;
  }

  updateCursor() {
    // Remove all cursor classes
    document.body.classList.remove('text-mode-active', 'drag-mode-active');

    // Add appropriate cursor class based on current mode
    if (this.currentMode === 'text') {
      document.body.classList.add('text-mode-active');
    } else if (this.currentMode === 'drag') {
      document.body.classList.add('drag-mode-active');
    }

    // Add cursor styles to document head if not already added
    if (!document.getElementById('selection-ai-cursor-styles')) {
      const style = document.createElement('style');
      style.id = 'selection-ai-cursor-styles';
      style.textContent = cursorCSS;
      document.head.appendChild(style);
    }

    console.log('Cursor updated for mode:', this.currentMode);
    console.log('Body classes:', document.body.className);
  }

  // Drag box selection methods
  handleDragStart(event) {
    if (this.currentMode !== 'drag' || this.isDragging) return;

    // Don't start drag if clicking on UI elements
    if (event.target.closest('.selection-ai-mode-switcher') ||
      event.target.closest('.selection-ai-buttons') ||
      event.target.closest('.selection-ai-popover')) {
      return;
    }

    // Clean up any existing drag box and action buttons
    this.hideDragBox();
    this.hideActionButtons();

    this.isDragging = true;
    this.dragStart = { x: event.clientX, y: event.clientY };
    this.dragEnd = { x: event.clientX, y: event.clientY };

    this.createDragBox();
    event.preventDefault();
  }

  handleDragMove(event) {
    if (!this.isDragging || this.currentMode !== 'drag') return;

    this.dragEnd = { x: event.clientX, y: event.clientY };
    this.updateDragBox();
    event.preventDefault();
  }

  handleDragEnd(event) {
    if (!this.isDragging || this.currentMode !== 'drag') return;

    this.isDragging = false;

    // Only show action buttons if drag box has meaningful size
    const width = Math.abs(this.dragEnd.x - this.dragStart.x);
    const height = Math.abs(this.dragEnd.y - this.dragStart.y);

    if (width > 20 && height > 20) {
      this.showDragBoxActionButtons();
    } else {
      this.hideDragBox();
    }

    event.preventDefault();
  }

  createDragBox() {
    this.dragBoxContainer = document.createElement('div');
    this.dragBoxContainer.className = 'selection-ai-drag-box-container';

    this.dragBoxContainer.style.cssText = dragBoxContainerCSS;

    // Create shadow root for style isolation
    this.dragBoxShadowRoot = this.dragBoxContainer.attachShadow({ mode: 'open' });

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = dragBoxCSS;
    this.dragBoxShadowRoot.appendChild(style);

    // Create drag box element
    this.dragBox = document.createElement('div');
    this.dragBox.className = 'drag-box';
    this.dragBoxShadowRoot.appendChild(this.dragBox);

    // Add to DOM
    document.body.appendChild(this.dragBoxContainer);

    this.updateDragBox();
  }

  updateDragBox() {
    if (!this.dragBox || !this.dragStart || !this.dragEnd) return;

    const left = Math.min(this.dragStart.x, this.dragEnd.x);
    const top = Math.min(this.dragStart.y, this.dragEnd.y);
    const width = Math.abs(this.dragEnd.x - this.dragStart.x);
    const height = Math.abs(this.dragEnd.y - this.dragStart.y);

    // Convert viewport coordinates to page coordinates
    const absolutePosition = this.calculateAbsolutePosition({ x: left, y: top });

    this.dragBox.style.cssText = getDragBoxCSS({
      x: absolutePosition.x,
      y: absolutePosition.y,
      width,
      height
    });
  }

  hideDragBox() {
    if (this.dragBoxContainer) {
      this.dragBoxContainer.remove();
      this.dragBoxContainer = null;
      this.dragBox = null;
      this.dragBoxShadowRoot = null;
    }
  }

  showDragBoxActionButtons() {
    if (!this.dragBox || !this.dragStart || !this.dragEnd) return;

    // Calculate position below bottom right corner
    const right = Math.max(this.dragStart.x, this.dragEnd.x);
    const bottom = Math.max(this.dragStart.y, this.dragEnd.y);
    const position = { x: right - 100, y: bottom + 10 };

    // Remove existing buttons
    this.hideActionButtons();

    // Calculate boundary-aware position
    const safePosition = this.calculateSafePosition(position, { width: 200, height: 60 });

    // Create button container with Shadow DOM for style isolation
    this.buttonContainer = document.createElement('div');
    this.buttonContainer.className = 'selection-ai-buttons';

    // Calculate absolute position relative to page content
    const absolutePosition = this.calculateAbsolutePosition(safePosition);

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

    // Add to DOM first, then trigger animation
    document.body.appendChild(this.buttonContainer);

    // Trigger fade in animation after a brief delay
    requestAnimationFrame(() => {
      this.buttonContainer.classList.add('visible');
    });

    // Create buttons for drag box (Prompt, Colors)
    const buttons =
      this.apiAvailability.prompt === 'available' ? [
        { id: 'prompt', icon: ICONS.prompt, label: 'Prompt' },
        { id: 'colors', icon: ICONS.colors, label: 'Colors' }
      ] : [
        { id: 'colors', icon: ICONS.colors, label: 'Colors' }
      ];

    buttons.forEach(button => {
      const buttonEl = document.createElement('button');
      buttonEl.className = 'selection-ai-button';
      buttonEl.innerHTML = button.icon;
      buttonEl.title = button.label;
      buttonEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleDragBoxButtonClick(button.id);
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

  handleDragBoxButtonClick(action) {
    console.log('Drag box button clicked:', action);

    // Hide buttons
    this.hideActionButtons();

    switch (action) {
      case 'prompt':
        console.log('Creating drag box prompt popover...');
        this.showDragBoxPopover('prompt').catch(console.error);
        break;
      case 'colors':
        console.log('Creating colors popover...');
        this.showColorsPopover().catch(console.error);
        break;
      // settings handled from mode switcher
    }
  }

  async showDragBoxPopover(action) {
    console.log('showDragBoxPopover called with action:', action);

    // Capture screenshot of drag box area
    const screenshot = await this.captureDragBoxScreenshot();
    if (!screenshot) {
      console.error('Failed to capture screenshot');
      return;
    }

    // Get position from drag box
    const right = Math.max(this.dragStart.x, this.dragEnd.x);
    const bottom = Math.max(this.dragStart.y, this.dragEnd.y);
    const position = { x: right - 200, y: bottom + 20 };

    // Wait for PopoverAI to be loaded
    if (!this.PopoverAI) {
      console.log('Waiting for PopoverAI module to load...');
      let attempts = 0;
      while (!this.PopoverAI && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
    }

    // Create popover using the PopoverAI class
    if (this.PopoverAI) {
      console.log('Creating drag box popover with PopoverAI class');
      try {
        this.popover = new this.PopoverAI(action, screenshot, position, null, 'dragbox');
        console.log('Drag box popover created:', this.popover);
      } catch (error) {
        console.error('Error creating drag box popover:', error);
      }
    }
  }

  async captureDragBoxScreenshot() {
    if (!this.dragStart || !this.dragEnd) return null;

    const left = Math.min(this.dragStart.x, this.dragEnd.x);
    const top = Math.min(this.dragStart.y, this.dragEnd.y);
    const width = Math.abs(this.dragEnd.x - this.dragStart.x);
    const height = Math.abs(this.dragEnd.y - this.dragStart.y);

    try {
      // For Chrome screenshot API, we need viewport coordinates (not page coordinates)
      // The screenshot captures the visible viewport, so we use the original viewport coordinates
      // Crop out the drag box border (2px) plus 1px extra margin
      const borderOffset = 3;
      const viewportLeft = left + borderOffset;
      const viewportTop = top + borderOffset;
      const viewportWidth = width - (borderOffset * 2);
      const viewportHeight = height - (borderOffset * 2);

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
      return new Promise((resolve) => {
        // Send message to background script to capture screenshot
        chrome.runtime.sendMessage({
          action: 'captureVisibleTab',
          cropArea: {
            x: Math.round(scaledLeft),
            y: Math.round(scaledTop),
            width: Math.round(scaledWidth),
            height: Math.round(scaledHeight)
          }
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Chrome screenshot API error:', chrome.runtime.lastError);
            alert('Failed to capture screenshot');
          } else if (response && response.dataUrl) {
            if (response.cropArea) {
              // Crop the image in content script where DOM APIs are available
              this.cropImage(response.dataUrl, response.cropArea).then(resolve).catch((error) => {
                console.error('Cropping failed:', error);
                // Fallback to full screenshot
                resolve(response.dataUrl);
              });
            } else {
              resolve(response.dataUrl);
            }
          } else {
            // Fallback to canvas representation
            alert('Failed to capture screenshot');
          }
        });
      });

    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      alert('Failed to capture screenshot');
    }
  }

  async cropImage(dataUrl, cropArea) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded for cropping:', {
          imageSize: { width: img.width, height: img.height },
          cropArea: cropArea
        });

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
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for cropping'));
      };

      img.src = dataUrl;
    });
  }

  async showColorsPopover() {
    console.log('showColorsPopover called');

    // Capture screenshot first
    const screenshot = await this.captureDragBoxScreenshot();
    if (!screenshot) {
      console.error('Failed to capture screenshot for colors');
      return;
    }

    // Get position from drag box
    const right = Math.max(this.dragStart.x, this.dragEnd.x);
    const bottom = Math.max(this.dragStart.y, this.dragEnd.y);
    const position = { x: right - 200, y: bottom + 20 };

    // Wait for PopoverAI to be loaded
    if (!this.PopoverAI) {
      console.log('Waiting for PopoverAI module to load...');
      let attempts = 0;
      while (!this.PopoverAI && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
    }

    // Create colors popover using the PopoverAI class
    if (this.PopoverAI) {
      console.log('Creating colors popover with PopoverAI class');
      try {
        this.popover = new this.PopoverAI('colors', screenshot, position, null, 'dragbox');
        console.log('Colors popover created:', this.popover);
      } catch (error) {
        console.error('Error creating colors popover:', error);
      }
    }
  }

  getSettingsIconWithBadge() {
    const needsBadge = ['prompt', 'summarizer', 'writer'].some(k => (this.apiAvailability[k] && this.apiAvailability[k] !== 'available'));
    if (!needsBadge) return icons.settings;
    const badgeSvg = icons.warning;
    return `<div style="position:relative; width:20px; height:20px;">${icons.settings}${badgeSvg}</div>`;
  }
}

// Initialize the extension
new SelectionAI();

function createPulsingShape(element, size = 40, shape = 'grid', autoStart = false) {
  const container = element;
  if (!container) return;

  container.style.position = "relative";
  container.style.width = `${size}px`;
  container.style.height = `${size}px`;
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.background = "rgba(254, 207, 2,0)";

  container.innerHTML = "";
  const canvas = document.createElement("canvas");
  
  // Account for device pixel ratio for crisp rendering
  const dpr = 10;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.style.position = "absolute";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.scale(dpr, dpr);
  
  // Enable crisp rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const centerX = size / 2;
  const centerY = size / 2;

  // Configuration based on shape
  let dots = [];
  const baseDotSize = size * 0.035;
  const pulseAmplitude = size * 0.015;
  const pulseFrequency = 1.5; // pulses per second

  if (shape === 'grid') {
    const cols = 6;
    const rows = 6;
    const cellWidth = size / cols;
    const cellHeight = size / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * cellWidth + cellWidth / 2,
          y: r * cellHeight + cellHeight / 2,
          distanceFromCenter: Math.hypot(
            c - cols / 2,
            r - rows / 2
          )
        });
      }
    }
  } else if (shape === 'circle') {
    // Arrange dots in concentric circles
    const rings = 4;
    const dotsPerRing = [1, 6, 12, 18]; // Center, then increasing dots per ring
    const maxRadius = size * 0.42;

    for (let ring = 0; ring < rings; ring++) {
      const radius = ring === 0 ? 0 : (maxRadius / (rings - 1)) * ring;
      const dotCount = dotsPerRing[ring];

      if (ring === 0) {
        // Center dot
        dots.push({
          x: centerX,
          y: centerY,
          distanceFromCenter: 0
        });
      } else {
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2;
          dots.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            distanceFromCenter: ring
          });
        }
      }
    }
  }

  let lastTime = 0;
  let time = 0;
  let isAnimating = false;
  let animationStartTime = 0;
  let animationDuration = 2000;
  let animationId = null;

  function drawStaticFrame() {
    ctx.clearRect(0, 0, size, size);

    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, baseDotSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254, 207, 2, 1)`;
      ctx.fill();
    });
  }

  function animate(timestamp) {
    if (!isAnimating) return;

    if (!lastTime) lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Check if animation duration has elapsed
    const elapsedTime = timestamp - animationStartTime;
    if (elapsedTime >= animationDuration) {
      isAnimating = false;
      drawStaticFrame();
      return;
    }

    time += deltaTime;

    ctx.clearRect(0, 0, size, size);

    dots.forEach(dot => {
      // Create a wave-like offset for each dot based on distance from center
      const delay = dot.distanceFromCenter * 0.15;

      const pulse =
        Math.sin((time - delay) * Math.PI * pulseFrequency) * 0.5 + 0.5;
      const radius = baseDotSize + pulse * pulseAmplitude;
      const opacity = 0.5 + pulse * 0.5;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254, 207, 2, ${opacity})`;
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  }

  function startAnimation(duration = 2000) {
    if (isAnimating) return; // Already animating
    
    isAnimating = true;
    animationDuration = duration;
    animationStartTime = performance.now();
    lastTime = 0;
    
    animationId = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (!isAnimating) return;
    
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    drawStaticFrame();
  }

  // Listen for custom event to trigger animation
  container.addEventListener('pulsingGridAnimate', (event) => {
    const duration = event.detail?.duration || 2000;
    startAnimation(duration);
  });

  // Draw initial frame (static or start animating based on autoStart)
  if (autoStart) {
    startAnimation(Infinity); // Infinite duration for continuous animation
  } else {
    drawStaticFrame();
  }

  // Return an object with control methods
  return {
    start: startAnimation,
    stop: stopAnimation,
    element: container
  };
}
