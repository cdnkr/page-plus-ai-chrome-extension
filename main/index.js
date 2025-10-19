// Imports
import { MIN_DRAG_SIZE } from './config.js';
import { ActionButtonsHandler } from './features/action-buttons.js';
import { DragSelectionHandler } from './features/drag-selection.js';
import { ModeSwitcher } from './features/mode-switcher.js';
import { NotificationHandler } from './handlers/notification-handler.js';
import { ScreenshotCapture } from './features/screenshot-capture.js';
import { TextSelectionHandler } from './features/text-selection.js';
import { ApiAvailabilityManager } from './managers/api-availability-manager.js';
import { PopoverManager } from './managers/popover-manager.js';
import { positionManager } from './utils/positioning.js';

export class SelectionAI {
  constructor() {
    this.position = null;

    // Position manager
    this.positionManager = positionManager;

    // API Availability Manager
    this.apiManager = new ApiAvailabilityManager({
      onAvailabilityChange: (availability) => this.handleAvailabilityChange(availability),
      onLocaleChange: (locale) => this.handleLocaleChange(locale),
      onApiAvailable: (apiName) => this.handleApiAvailable(apiName)
    });

    // Popover manager
    this.popoverManager = new PopoverManager({
      onPopoverCreated: (popover) => this.handlePopoverCreated(popover),
      onPopoverClosed: () => this.handlePopoverClosed(),
      getApiAvailability: () => this.apiManager.getAvailability(),
      getLocale: () => this.apiManager.getLocale(),
      setButtonActive: (buttonId, isActive) => this.setButtonActive(buttonId, isActive),
      highlightSelection: () => this.textSelection?.highlightSelection(),
      removeHighlight: () => this.textSelection?.removeSelectionHighlight()
    });

    // Action buttons handler
    this.actionButtons = new ActionButtonsHandler({
      positionManager: this.positionManager,
      onButtonClick: (action) => this.handleButtonClick(action),
      getI18n: () => this.i18n,
      getApiAvailability: () => this.apiManager.getAvailability()
    });

    // Screenshot capture handler
    this.screenshotCapture = new ScreenshotCapture();

    // Notification handler
    this.notifications = new NotificationHandler();

    // Mode switching (must be defined before textSelection handler)
    this.currentMode = null; // null, 'text', or 'drag'

    // Mode switcher (will be initialized after API availability check)
    this.modeSwitcherComponent = null;

    // Text selection handler
    this.textSelection = new TextSelectionHandler({
      positionManager: this.positionManager,
      shouldHandle: () => this.currentMode === 'text' && !this.actionButtons.isVisible() && !this.popoverManager.isPopoverOpen(),
      onSelectionChange: (selectionData) => {
        this.selectedText = selectionData.text;
        this.position = selectionData.position;
        this.selectionPosition = selectionData.position;
        this.selectionRange = selectionData.range;
        this.actionButtons.showTextSelectionButtons(selectionData.position);
      }
    });

    // Selection state (updated by textSelection handler)
    this.selectedText = '';
    this.selectionPosition = null;
    this.selectionRange = null;

    // Drag selection handler
    this.dragSelection = new DragSelectionHandler({
      positionManager: this.positionManager,
      shouldHandle: () => this.currentMode === 'drag',
      onDragStart: () => {
        this.actionButtons.hideButtons();
      },
      onDragComplete: (dragData) => {
        this.dragStart = dragData.start;
        this.dragEnd = dragData.end;
        const position = this.dragSelection.getActionButtonPosition();
        if (position) {
          this.actionButtons.showDragBoxButtons(position);
        }
      },
      minDragSize: MIN_DRAG_SIZE
    });

    // Drag state (updated by dragSelection handler)
    this.dragStart = null;
    this.dragEnd = null;

    this.loadModules();
    this.init();
  }

  async loadModules() {
    // Load popover module
    const { i18n } = await this.popoverManager.loadPopoverModule();

    // Initialize i18n if available
    if (i18n && i18n.initI18n) {
      try { await i18n.initI18n(); } catch (_) { }
      this.i18n = i18n;
    }
  }

  async init() {
    // Check if AI APIs are available
    await this.apiManager.checkAvailability();

    // Create mode switcher
    this.initializeModeSwitcher();

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

  handleAvailabilityChange(availability) {
    // Refresh settings button badge/icon if present
    this.updateSettingsButtonIcon();
  }

  handleLocaleChange(locale) {
    // Optional: Handle locale changes
  }

  handleApiAvailable(apiName) {
    // If a new API became available, recreate mode switcher to show new buttons
    this.recreateModeSwitcher();
  }

  handleTextSelection(event) {
    this.textSelection.handleTextSelection(event);
  }


  async handleButtonClick(action) {
    console.log('Button clicked:', action);

    // if (this.dragSelection) {
    //   this.dragSelection.hideDragBox();
    // }

    switch (action) {
      case 'prompt':
        console.log('Creating prompt popover...');
        if (this.currentMode === 'drag') {
          await this.showDragBoxPopover('prompt');
        } else {
          await this.showPopover('prompt');
        }
        break;
      case 'summarize':
        console.log('Creating summarize popover...');
        await this.showPopover('summarize');
        break;
      case 'write':
        console.log('Creating write popover...');
        await this.showPopover('write');
        break;
      case 'colors':
        console.log('Creating colors popover...');
        await this.showColorsPopover();
        break;
      // settings handled from mode switcher
    }
  }

  async showPopover(action, selectionType) {
    await this.popoverManager.showPopover(
      action,
      this.selectedText,
      this.position,
      this.selectionRange,
      selectionType
    );
  }

  // Remove old message handling since we're not using iframe anymore

  resizePopover(height) {
    this.popoverManager.resizePopover(height);
  }

  closePopover() {
    this.popoverManager.closePopover();

    // Hide buttons when popover is closed
    this.actionButtons.hideButtons();
    // Hide drag box when popover is closed
    this.hideDragBox();

    // Reset state to allow new selections
    this.selectionRange = null;
    this.selectedText = '';
    this.selectionPosition = null;
    this.dragStart = null;
    this.dragEnd = null;
    this.isDragging = false;
  }


  handleClick(event) {
    // Close popover if clicking outside (but not on action buttons or popover content)
    if (this.popoverManager.isPopoverOpen()) {
      const isClickInsidePopover = this.popoverManager.isClickInsidePopover(event);
      const isClickOnActionButtons = this.actionButtons.getContainer()?.contains(event.target);

      if (!isClickInsidePopover && !isClickOnActionButtons) {
        console.log('Clicking outside popover, closing...');
        // disablling this for now as it was causing glitchy behaviour on repeated drag selections.
        // keeping the popover open is okay as there is a close button
        // this.closePopover();
      }
    }
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      // Deactivates current mode
      this.modeSwitcherComponent.toggleMode(null);

      this.closePopover();
      this.actionButtons.hideButtons();
    }
  }

  handlePopoverCreated(popover) {
    // Optional: Handle any post-creation tasks
  }

  handlePopoverClosed() {
    // Hide action buttons when popover is closed from within
    this.actionButtons.hideButtons();
    // Hide drag box when popover is closed
    this.hideDragBox();

    this.closePopover();
    this.actionButtons.hideButtons();

    if (this.action === 'history' || this.action === 'settings') {
      this.modeSwitcherComponent.toggleMode(null);
    }

    // Reset state to allow new selections
    this.selectionRange = null;
    this.selectedText = '';
    this.selectionPosition = null;
    this.dragStart = null;
    this.dragEnd = null;
    this.isDragging = false;
  }

  handleStreamingStart() {
    // Start the home button pulse animation while streaming
    if (this.modeSwitcherComponent) {
      this.modeSwitcherComponent.startHomeButtonAnimation(60000); // 60 seconds max
      this.isStreaming = true;
    }
  }

  handleStreamingEnd() {
    // Mark streaming as ended and stop the animation
    this.isStreaming = false;
    if (this.modeSwitcherComponent) {
      this.modeSwitcherComponent.stopHomeButtonAnimation();
    }
  }

  // AI request handling moved to PopoverAI class

  // Get position from selection range (anchored to text)
  getSelectionPosition() {
    return this.textSelection.getSelectionPosition();
  }

  // Update positions on window resize only
  updatePositions() {
    // Only update positions on window resize to ensure elements stay within viewport
    // Action buttons and popover should stay anchored to their initial position on scroll
    const buttonContainer = this.actionButtons.getContainer();
    if (buttonContainer) {
      this.positionManager.updateElementPosition(buttonContainer, { width: 200, height: 60 });
    }

    // Popover should stay anchored to its initial position
    // No position updates needed on scroll
  }

  // Mode switcher methods
  initializeModeSwitcher() {
    this.modeSwitcherComponent = new ModeSwitcher({
      apiAvailability: this.apiManager.getAvailability(),
      i18n: this.i18n,
      onModeChange: (mode) => this.handleModeChange(mode),
      onShowPopover: (config) => this.handleModeSwitcherPopover(config),
      closePopover: () => this.closePopover(),
      onHomeButtonClick: () => { }
    });

    this.modeSwitcherComponent.createModeSwitcher();
  }

  handleModeChange(mode) {
    this.currentMode = mode;

    // Clear any existing selections
    this.actionButtons.hideButtons();
    this.hideDragBox();
    this.closePopover();

    // Clear text selection if switching modes or deactivating
    if (this.currentMode === 'drag' || this.currentMode === null) {
      window.getSelection().removeAllRanges();
    }

    // Reset drag state
    this.dragStart = null;
    this.dragEnd = null;
  }

  handleModeSwitcherPopover(config) {
    this.position = config.position;
    if (config.text !== undefined) {
      this.selectedText = config.text;
    }
    if (config.range !== undefined) {
      this.selectionRange = config.range;
    }
    this.showPopover(config.action, config.selectionType).catch(console.error);
  }

  updateSettingsButtonIcon() {
    if (this.modeSwitcherComponent) {
      this.modeSwitcherComponent.updateSettingsButtonIcon();
    }
  }

  recreateModeSwitcher() {
    if (this.modeSwitcherComponent) {
      this.modeSwitcherComponent.updateApiAvailability(this.apiManager.getAvailability());
      this.modeSwitcherComponent.recreateModeSwitcher();
    }
  }

  setButtonActive(buttonId, isActive) {
    if (this.modeSwitcherComponent) {
      this.modeSwitcherComponent.setButtonActive(buttonId, isActive);
    }
  }

  // Drag box selection methods
  handleDragStart(event) {
    const started = this.dragSelection.handleDragStart(event);
    if (started) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleDragMove(event) {
    const moved = this.dragSelection.handleDragMove(event);
    if (moved) {
      event.preventDefault();
    }
  }

  handleDragEnd(event) {
    const dragData = this.dragSelection.handleDragEnd(event);
    if (dragData) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  hideDragBox() {
    this.dragSelection.hideDragBox();
  }


  async showDragBoxPopover(action) {
    // Capture screenshot of drag box area
    const bounds = this.dragSelection.getDragBounds();
    const screenshot = await this.screenshotCapture.captureArea(bounds);
    if (!screenshot) {
      console.error('Failed to capture screenshot');
      return;
    }

    // Get position from drag selection handler
    const position = this.dragSelection.getPopoverPosition();
    if (!position) {
      console.error('No drag position available');
      return;
    }

    await this.popoverManager.showDragBoxPopover(action, screenshot, position);
  }

  async showColorsPopover() {
    // Capture screenshot first
    const bounds = this.dragSelection.getDragBounds();
    const screenshot = await this.screenshotCapture.captureArea(bounds);
    if (!screenshot) {
      console.error('Failed to capture screenshot for colors');
      return;
    }

    // Get position from drag selection handler
    const position = this.dragSelection.getPopoverPosition();
    if (!position) {
      console.error('No drag position available');
      return;
    }

    await this.popoverManager.showColorsPopover(screenshot, position);
  }

  getSettingsIconWithBadge() {
    const needsBadge = this.apiManager.needsAttention();
    if (!needsBadge) return icons.settings;
    const badgeSvg = icons.warning;
    return `<div style="position:relative; width:20px; height:20px;">${icons.settings}${badgeSvg}</div>`;
  }
}
