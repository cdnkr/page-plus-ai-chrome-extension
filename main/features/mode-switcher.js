/**
 * ModeSwitcher - Manages the mode switcher UI and mode state
 * Handles switching between text and drag modes, plus special actions
 */

import { ICONS } from '../icons.js';
import { modeSwitcherCSS, modeSwitcherRootCSS } from '../styles/css-constants.js';
import { extractStructuredTextWithLinks, segmentsToMarkdown } from '../utils/text-extractor.js';
import { createPulsingShape } from '../../utils/animations.js';
import { CursorManager } from '../managers/cursor-manager.js';
import { t } from '../../i18n.js';

export class ModeSwitcher {
  constructor(config = {}) {
    this.currentMode = null; // null, 'text', or 'drag'
    this.modeSwitcher = null;
    this.modeSwitcherShadowRoot = null;
    this.homeButtonPulse = null;
    this.tooltipTimeout = null;
    this.currentTooltip = null;

    // Configuration callbacks
    this.apiAvailability = config.apiAvailability || { prompt: 'unknown', summarizer: 'unknown', writer: 'unknown' };
    this.i18n = config.i18n || null;
    this.onModeChange = config.onModeChange || (() => {});
    this.onShowPopover = config.onShowPopover || (() => {});
    this.onHomeButtonClick = config.onHomeButtonClick || (() => {});
    this.isPopoverOpen = config.isPopoverOpen || (() => false);
    this.closePopover = config.closePopover || (() => {});

    // Cursor manager
    this.cursorManager = new CursorManager();
  }

  /**
   * Create the mode switcher UI
   */
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

    // Create home button
    const homeButton = this.createHomeButton();
    innerContainer.appendChild(homeButton);

    // Create mode buttons based on API availability
    // const t = this.i18n?.t || ((k) => k);

    // Text mode button (only if any API is available)
    if (this.apiAvailability.prompt === 'available' || 
        this.apiAvailability.summarizer === 'available' || 
        this.apiAvailability.writer === 'available') {
      const textBtn = this.createButton({
        id: null,
        className: 'mode-btn hidden',
        icon: ICONS.text,
        title: t('mode_text'),
        onClick: () => this.toggleMode('text'),
        tooltipContent: {
          title: t('tooltip_text_title'),
          description: t('tooltip_text_description')
        },
        actionContent: t('tooltip_action_activate')
      });
      innerContainer.appendChild(textBtn);
    }

    // Drag mode button (always available)
    const dragBtn = this.createButton({
      id: null,
      className: 'mode-btn hidden',
      icon: ICONS.dashedBox,
      title: t('mode_drag'),
      onClick: () => this.toggleMode('drag'),
      tooltipContent: {
        title: t('tooltip_drag_title'),
        description: t('tooltip_drag_description')
      },
      actionContent: t('tooltip_action_activate')
    });
    innerContainer.appendChild(dragBtn);

    // Current page button (only if prompt API is available)
    if (this.apiAvailability.prompt === 'available') {
      const currentPageBtn = this.createButton({
        id: 'selection-ai-current-page-btn',
        className: 'mode-btn hidden',
        icon: ICONS.page,
        title: t('mode_current_page'),
        onClick: (e) => this.handleCurrentPageClick(e),
        tooltipContent: {
          title: t('tooltip_page_title'),
          description: t('tooltip_page_description')
        },
        actionContent: t('tooltip_action_open')
      });
      innerContainer.appendChild(currentPageBtn);
    }

    // History button
    const historyBtn = this.createButton({
      id: 'selection-ai-history-btn',
      className: 'mode-btn hidden',
      icon: ICONS.history,
      title: t('button_history'),
      onClick: (e) => this.handleHistoryClick(e),
      tooltipContent: {
        title: t('tooltip_history_title'),
        description: t('tooltip_history_description')
      },
      actionContent: t('tooltip_action_open')
    });
    innerContainer.appendChild(historyBtn);

    // Settings button
    const settingsBtn = this.createButton({
      id: 'selection-ai-settings-btn',
      className: 'mode-btn hidden',
      icon: ICONS.settings,
      title: t('button_settings'),
      onClick: (e) => this.handleSettingsClick(e),
      tooltipContent: {
        title: t('tooltip_settings_title'),
        description: t('tooltip_settings_description')
      },
      actionContent: t('tooltip_action_open')
    });
    innerContainer.appendChild(settingsBtn);

    this.modeSwitcherShadowRoot.appendChild(innerContainer);

    // Add to DOM
    document.body.appendChild(this.modeSwitcher);

    // Create home button animation
    this.homeButtonPulse = createPulsingShape(homeButton, 40, 'grid');

    // Setup tooltip management
    this.setupTooltipManagement();

    // Setup first-time user experience
    this.setupFirstTimeUse();

    // Setup language change listener
    this.setupLanguageChangeListener();
  }

  /**
   * Create the home button
   * @returns {HTMLElement}
   */
  createHomeButton() {
    const homeButton = document.createElement('button');
    homeButton.className = 'mode-btn';
    homeButton.innerHTML = `<div id="home-button" class="home-button"></div>`;
    homeButton.addEventListener('click', () => {
      if (this.homeButtonPulse) {
        this.toggleActionButtons();

        setTimeout(() => {
          // this.homeButtonPulse.start(300);
          this.onHomeButtonClick();
        }, 300);
      }
    });
    
    // Add tooltip to home button
    const t = this.i18n?.t || ((k) => k);
    this.addTooltipToButton(homeButton, {
      title: t('tooltip_home_title'),
      description: t('tooltip_home_description')
    });
    
    return homeButton;
  }

  /**
   * Create a button element
   * @param {Object} config - Button configuration
   * @returns {HTMLElement}
   */
  createButton({ id, className, icon, title, onClick, tooltipContent, actionContent = t('tooltip_action_activate') }) {
    const button = document.createElement('button');
    button.className = className;
    if (id) button.setAttribute('id', id);
    button.innerHTML = icon;
    // button.title = title;
    button.addEventListener('click', onClick);
    
    // Add tooltip if content is provided
    if (tooltipContent) {
      this.addTooltipToButton(button, tooltipContent, actionContent);
    }
    
    return button;
  }

  /**
   * Add tooltip to a button
   * @param {HTMLElement} button - Button element
   * @param {Object} tooltipContent - Tooltip content
   */
  addTooltipToButton(button, tooltipContent, actionContent = t('tooltip_action_activate')) {
    const t = this.i18n?.t || ((k) => k);
    const tooltip = document.createElement('div');
    tooltip.className = 'mode-tooltip';
    tooltip.innerHTML = `
      <div class="mode-tooltip-title">${tooltipContent.title}</div>
      <div class="mode-tooltip-description">${tooltipContent.description}</div>
      <div class="mode-tooltip-action">${actionContent}</div>
    `;
    
    button.appendChild(tooltip);
    
    // Add hover events
    button.addEventListener('mouseenter', () => {
      // Clear any existing timeout
      if (this.tooltipTimeout) {
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = null;
      }
      
      // Hide all other tooltips first
      this.hideAllTooltips();
      
      // Set this as current tooltip and show it
      this.currentTooltip = tooltip;
      tooltip.classList.add('show');
    });
    
    button.addEventListener('mouseleave', () => {
      this.tooltipTimeout = setTimeout(() => {
        if (this.currentTooltip === tooltip) {
          tooltip.classList.remove('show');
          this.currentTooltip = null;
        }
      }, 150);
    });
  }

  /**
   * Hide all tooltips
   */
  hideAllTooltips() {
    if (!this.modeSwitcherShadowRoot) return;
    
    const allTooltips = this.modeSwitcherShadowRoot.querySelectorAll('.mode-tooltip');
    allTooltips.forEach(tooltip => {
      tooltip.classList.remove('show');
    });
    
    this.currentTooltip = null;
  }

  /**
   * Setup tooltip management
   */
  setupTooltipManagement() {
    // Add mouse leave listener to the entire mode switcher
    this.modeSwitcher.addEventListener('mouseleave', () => {
      if (this.tooltipTimeout) {
        clearTimeout(this.tooltipTimeout);
        this.tooltipTimeout = null;
      }
      this.hideAllTooltips();
    });
  }

  /**
   * Handle current page button click
   */
  handleCurrentPageClick(e) {
    e.stopPropagation();
    
    // Deactivate any active text/drag mode
    this.toggleMode(null);
    
    // If popover is already open, close it
    if (this.isPopoverOpen()) {
      this.closePopover();
      return;
    }
    
    try {
      const rect = this.modeSwitcher.getBoundingClientRect();
      const popoverWidth = 400;
      const margin = 20;
      const position = {
        x: rect.left + (rect.width / 2) - (popoverWidth / 2),
        bottomY: rect.top - margin,
        anchorFromBottom: true
      };

      // Build current page context
      const segments = extractStructuredTextWithLinks(document.body.innerHTML);
      const markdown = segmentsToMarkdown(segments);

      this.onShowPopover({
        action: 'prompt',
        selectionType: 'page',
        position,
        text: markdown,
        range: null
      });
    } catch (err) {
      console.error('Failed to open current page prompt', err);
    }
  }

  /**
   * Handle history button click
   */
  handleHistoryClick(e) {
    e.stopPropagation();
    
    // Deactivate any active text/drag mode
    this.toggleMode(null);
    
    // If popover is already open, close it
    if (this.isPopoverOpen()) {
      this.closePopover();
      return;
    }
    
    const rect = this.modeSwitcher.getBoundingClientRect();
    const popoverWidth = 800;
    const margin = 20;
    const position = {
      x: rect.left + (rect.width / 2) - (popoverWidth / 2),
      bottomY: rect.top - margin,
      anchorFromBottom: true
    };

    this.onShowPopover({
      action: 'history',
      selectionType: null,
      position,
      text: '',
      range: null
    });
  }

  /**
   * Handle settings button click
   */
  handleSettingsClick(e) {
    e.stopPropagation();
    
    // Deactivate any active text/drag mode
    this.toggleMode(null);
    
    // If popover is already open, close it
    if (this.isPopoverOpen()) {
      this.closePopover();
      return;
    }
    
    const rect = this.modeSwitcher.getBoundingClientRect();
    const popoverWidth = 400;
    const margin = 20;
    const position = {
      x: rect.left + (rect.width / 2) - (popoverWidth / 2),
      bottomY: rect.top - margin,
      anchorFromBottom: true
    };

    this.onShowPopover({
      action: 'settings',
      selectionType: null,
      position,
      text: null,
      range: null
    });
  }

  /**
   * Toggle mode (text or drag)
   * @param {string} mode - 'text' or 'drag'
   */
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

    // Update cursor
    this.cursorManager.updateCursor(this.currentMode);

    // Notify parent of mode change
    this.onModeChange(this.currentMode);
  }

  /**
   * Toggle visibility of action buttons
   */
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

  /**
   * Set a button's active state
   * @param {string} buttonId - Button ID
   * @param {boolean} isActive - Active state
   */
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

  /**
   * Update the settings button icon
   */
  updateSettingsButtonIcon() {
    if (!this.modeSwitcherShadowRoot) return;
    const btn = this.modeSwitcherShadowRoot.querySelector('#selection-ai-settings-btn');
    if (btn) {
      btn.innerHTML = ICONS.settings;
    }
  }

  /**
   * Recreate the mode switcher (useful when API availability changes)
   */
  recreateModeSwitcher() {
    // Clear any pending tooltip timeouts
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = null;
    }
    
    // Reset tooltip state
    this.currentTooltip = null;
    
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

  /**
   * Setup first-time user experience
   */
  setupFirstTimeUse() {
    chrome.storage.local.get(['firstTimeUse']).then(({ firstTimeUse }) => {
      if (!firstTimeUse) {
        chrome.storage.local.set({ firstTimeUse: true });
      }

      // Show settings if APIs are not available and it's the first time
      if ((this.apiAvailability.prompt !== 'available' ||
           this.apiAvailability.summarizer !== 'available' ||
           this.apiAvailability.writer !== 'available') && !firstTimeUse) {
        const rect = this.modeSwitcher.getBoundingClientRect();
        const popoverWidth = 400;
        const margin = 20;
        const position = {
          x: rect.left + (rect.width / 2) - (popoverWidth / 2),
          bottomY: rect.top - margin,
          anchorFromBottom: true
        };

        this.onShowPopover({
          action: 'settings',
          selectionType: null,
          position,
          text: null,
          range: null
        });
      }
    });
  }

  /**
   * Setup language change listener
   */
  setupLanguageChangeListener() {
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

  /**
   * Get current mode
   * @returns {string|null}
   */
  getCurrentMode() {
    return this.currentMode;
  }

  /**
   * Get the mode switcher element
   * @returns {HTMLElement|null}
   */
  getElement() {
    return this.modeSwitcher;
  }

  /**
   * Start home button animation
   * @param {number} duration - Animation duration in ms
   */
  startHomeButtonAnimation(duration = 60000) {
    if (this.homeButtonPulse) {
      this.homeButtonPulse.start(duration);
    }
  }

  /**
   * Stop home button animation
   */
  stopHomeButtonAnimation() {
    if (this.homeButtonPulse) {
      this.homeButtonPulse.stop();
    }
  }

  /**
   * Update API availability and recreate if needed
   * @param {Object} apiAvailability - New API availability
   */
  updateApiAvailability(apiAvailability) {
    this.apiAvailability = apiAvailability;
    this.updateSettingsButtonIcon();
  }
}

