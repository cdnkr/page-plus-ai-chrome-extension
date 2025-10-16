import { DragHandler } from './utils/drag-handler.js';
import { 
    calculateSafePosition, 
    calculateAbsolutePosition, 
    setupHeightObserver 
} from '../utils/positioning.js';
import { ConversationManager } from './managers/conversation-manager.js';
import { SettingsManager } from './managers/settings-manager.js';
import { GoogleNanoManager } from './managers/google-nano-manager.js';
import { ColorAnalyzer } from './features/color-analyzer.js';
import { VoiceInputManager } from './features/voice-input.js';
import { getPopoverElementCSS } from './styles/css-utils.js';
import { getShadowRootHTML } from './templates/html-tamplates.js';
import { shadowRootCSS } from './styles/css-constants.js';
import { getContextHTML } from './templates/conversation-templates.js';
import { createPulsingShape } from '../utils/animations.js';
import { getErrorMessageHTML } from './templates/html-tamplates.js';
import { notificationCSS } from './styles/css-constants.js';
import { parseMarkdownToHTML } from '../utils/markdown-parser.js';
import { submitBtnHTML } from './templates/html-tamplates.js';

export class PopoverAI {
    constructor(action, selectedText, position, selectionRange, selectionType = 'text') {
        try {
            console.log('PopoverAI constructor called with:', { action, selectedText: selectedText.substring(0, 50) + '...', position, selectionType });
            this.action = action;
            this.selectedText = selectedText;
            this.position = position;
            this.selectionRange = selectionRange;
            this.selectionType = selectionType; // 'text' or 'dragbox'
            this.currentResponse = '';
            this.popoverElement = null;

            // History management
            this.conversationManager = null; // Initialized after DOM is ready
            this.conversationHistory = [];
            this.isHistoryLoaded = false;
            this.currentUserMessage = null;
            this.sessionId = null; // Will be set by conversationManager

            // Settings management
            this.settingsManager = null; // Initialized after DOM is ready

            // Color analyzer
            this.colorAnalyzer = null; // Initialized after DOM is ready

            // Voice input manager
            this.voiceInputManager = null; // Initialized after DOM is ready

            // AI prompt handler
            this.googleNanoHandler = null; // Initialized after DOM is ready

            // Drag handler (initialized after DOM elements are created)
            this.dragHandler = null;

            // Height tracking for bottom-anchored popovers
            this.initialHeight = null;
            this.anchorBottomY = null;
            this.isBottomAnchored = position?.anchorFromBottom || false;
            this.heightObserver = null;

            this.createPopover();
            this.init();
            console.log('PopoverAI constructor completed successfully');
        } catch (error) {
            console.error('Error in PopoverAI constructor:', error);
            throw error;
        }
    }

    createPopover() {
        try {
            console.log('Creating popover element...');
            // Load i18n lazily
            this.loadI18nOnce();
            // Create popover container with Shadow DOM for style isolation
            this.popoverElement = document.createElement('div');
            this.popoverElement.className = 'selection-ai-popover';
            this.popoverElement.classList.add(`type_${this.selectionType}`);
            this.popoverElement.classList.add(`action_${this.action}`);

            // Create shadow root for complete style isolation
            this.shadowRoot = this.popoverElement.attachShadow({ mode: 'open' });

            // Use mouse position with boundary checking (same as action buttons)
            const shouldUseAbsolutePosition = this.selectionType === 'page' || this.action === 'settings' || this.action === 'history';
            let position;

            // Handle bottom-anchored positioning
            if (this.isBottomAnchored && this.position.bottomY !== undefined) {
                this.anchorBottomY = this.position.bottomY;
                // For bottom-anchored, just use x position and position off-screen temporarily
                // Safe x position calculation
                let safeX = this.position.x;
                const margin = 20;
                const popoverWidth = this.action === 'history' ? 800 : 400;
                if (safeX + popoverWidth > window.innerWidth - margin) {
                    safeX = window.innerWidth - popoverWidth - margin;
                }
                if (safeX < margin) {
                    safeX = margin;
                }
                position = { x: safeX, y: -10000 };
            } else {
                const popoverWidth = this.action === 'history' ? 800 : 400;
                const safePosition = calculateSafePosition(this.position, { width: popoverWidth, height: 360 });
                position = shouldUseAbsolutePosition ? safePosition : calculateAbsolutePosition(safePosition);
            }

            const popoverWidth = this.action === 'history' ? 800 : 400;
            this.popoverElement.style.cssText = getPopoverElementCSS({
                position,
                shouldUseAbsolutePosition,
                width: popoverWidth
            });

            // Add CSS styles to shadow root for complete isolation
            const style = document.createElement('style');
            style.textContent = shadowRootCSS;

            // Create popover HTML structure in shadow root
            this.shadowRoot.innerHTML = getShadowRootHTML();

            // Append style after HTML
            this.shadowRoot.appendChild(style);

            // Add to DOM
            document.body.appendChild(this.popoverElement);
            console.log('Popover element added to DOM:', this.popoverElement);

            // Handle bottom-anchored positioning after DOM measurement
            if (this.isBottomAnchored && this.anchorBottomY !== undefined) {
                // Wait for next frame to ensure layout is complete
                requestAnimationFrame(() => {
                    const height = this.popoverElement.offsetHeight;
                    this.initialHeight = height;
                    const topY = this.anchorBottomY - height;
                    this.popoverElement.style.top = `${topY}px`;
                    console.log('Bottom-anchored popover positioned:', { bottomY: this.anchorBottomY, height, topY });

                    // Set up ResizeObserver for page prompts to track height changes
                    if ((this.selectionType === 'page' && this.action === 'prompt') || this.action === 'settings' || this.action === 'history') {
                        if (this.popoverElement && this.isBottomAnchored && this.anchorBottomY) {
                            this.heightObserver = setupHeightObserver(this.popoverElement, this.anchorBottomY);
                            this.heightObserver.observe(this.popoverElement);
                        }
                    }
                });
            }

            // Stop propagation for all clicks inside the popover
            this.shadowRoot.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Trigger fade in animation
            requestAnimationFrame(() => {
                this.popoverElement.classList.add('visible');
                console.log('Visible class added to popover element');
            });

            console.log('Popover element created and added to DOM');
        } catch (error) {
            console.error('Error in createPopover:', error);
            throw error;
        }
    }
    async loadI18nOnce() {
        if (this.i18nLoaded) return;
        try {
            const mod = await import(chrome.runtime.getURL('i18n.js'));
            if (mod && mod.initI18n) {
                await mod.initI18n();
                this.t = mod.t;
                this.getBaseLanguage = mod.getBaseLanguage;
                this.getUiLocaleOptions = mod.getUiLocaleOptions;
                this.i18nLoaded = true;
            }
        } catch (e) {
            console.warn('i18n load failed, falling back to defaults', e);
            this.t = (k) => k;
            this.getBaseLanguage = () => 'en';
            this.getUiLocaleOptions = () => ['en-US', 'es-ES', 'ja-JP'];
            this.i18nLoaded = true;
        }
    }
    getPreferredBaseLanguage() {
        let lang = (navigator.language || 'en').toLowerCase();
        try {
            const stored = window.__selection_ai_cached_locale;
            if (stored) lang = String(stored).toLowerCase();
        } catch (_) { }
        const baseLang = (lang.split('-')[0] || 'en').toLowerCase();
        const supported = ['en', 'es', 'ja'];
        return supported.includes(baseLang) ? baseLang : 'en';
    }


    async init() {
        // Get DOM elements from shadow root
        this.headerTitle = this.shadowRoot.querySelector('#header-title');
        this.inputSection = this.shadowRoot.querySelector('#input-section');
        this.responseSection = this.shadowRoot.querySelector('#response-section');
        this.userInput = this.shadowRoot.querySelector('#user-input');
        this.submitBtn = this.shadowRoot.querySelector('#submit-btn');
        this.responseContent = this.shadowRoot.querySelector('#response-content');
        this.actionButtons = this.shadowRoot.querySelector('#action-buttons');
        this.copyBtn = this.shadowRoot.querySelector('#copy-btn');
        this.shareBtn = this.shadowRoot.querySelector('#share-btn');
        this.voiceBtn = this.shadowRoot.querySelector('#voice-btn');
        this.closeBtn = this.shadowRoot.querySelector('#close-btn');
        this.contextText = this.shadowRoot.querySelector('#context-text');
        this.selectedTextContext = this.shadowRoot.querySelector('#selected-text-context');
        this.content = this.shadowRoot.querySelector('.content');
        this.header = this.shadowRoot.querySelector('.header');

        // Ensure context text is populated immediately
        if (this.contextText) {
            if (this.selectionType === 'dragbox') {
                // Image context - no icon
                this.contextText.innerHTML = getContextHTML({
                    selectedText: this.selectedText
                });
            } else if (this.selectionType === 'page') {
                // Page context - show page icon
                const pageIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;
                const pageText = `${window.location.host}${window.location.pathname}` || 'Current Page';
                this.contextText.innerHTML = `<span class="context-icon">${pageIcon}</span><span class="context-content">${pageText}</span>`;
            } else {
                // Text selection - show text icon
                const textIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-italic-icon lucide-italic"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>`;
                const textContent = this.selectedText.length > 100 ? this.selectedText.slice(0, 100) + '...' : this.selectedText;
                this.contextText.innerHTML = `<span class="context-icon">${textIcon}</span><span class="context-content">${textContent}</span>`;
            }
        }

        // Add event listeners
        this.closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });
        this.submitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleSubmit();
        });
        this.userInput.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.handleSubmit();
            }
        });
        this.copyBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.copyResponse();
        });
        this.shareBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.shareResponse();
        });

        // Ensure i18n is ready before configuring action-specific UI
        await this.loadI18nOnce();

        // Initialize managers
        this.conversationManager = new ConversationManager(this);
        this.settingsManager = new SettingsManager(this);
        this.colorAnalyzer = new ColorAnalyzer(this);
        this.voiceInputManager = new VoiceInputManager(this);
        this.googleNanoHandler = new GoogleNanoManager(this);
        this.sessionId = this.conversationManager.generateSessionId(this.action, this.selectionType, this.selectedText);

        // Setup voice input event listener
        if (this.voiceBtn) {
            this.voiceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.voiceInputManager.startVoiceInput();
            });
        }

        // Add drag functionality to header
        this.setupDragHandlers();

        // Setup for the specific action
        this.setupForAction();

        // Load conversation history for prompt and write actions
        if (this.action === 'prompt' || this.action === 'write') {
            this.conversationManager.loadConversationHistory(this.sessionId);
        }
    }

    setupForAction() {
        // Show context section for all actions except colors
        if (this.action !== 'colors') {
            this.selectedTextContext.style.display = 'block';
        } else {
            this.selectedTextContext.style.display = 'none';
        }

        // Hide action buttons for colors action
        if (this.action === 'colors') {
            this.actionButtons.style.display = 'none';
        }

        const t = this.t || ((k) => k);
        switch (this.action) {
            case 'prompt':
                if (this.selectionType === 'dragbox') {
                    this.headerTitle.innerHTML = `<span>${t('header_image_ask')}</span>`;
                    this.userInput.placeholder = t('placeholder_ask_image');
                } else if (this.selectionType === 'page') {
                    this.headerTitle.innerHTML = `<span>${t('header_page_ask')}</span>`;
                    this.userInput.placeholder = t('placeholder_ask_page');
                } else {
                    this.headerTitle.innerHTML = `<span>${t('header_text_ask')}</span>`;
                    this.userInput.placeholder = t('placeholder_ask_text');
                }
                this.inputSection.classList.remove('hidden');
                break;
            case 'summarize':
                this.headerTitle.innerHTML = `<span>${t('header_text_summarize')}</span>`;
                this.inputSection.classList.add('hidden');
                this.googleNanoHandler.startSummarization();
                break;
            case 'write':
                if (this.selectionType === 'dragbox') {
                    this.headerTitle.innerHTML = `<span>${t('header_image_write')}</span>`;
                    this.userInput.placeholder = t('placeholder_write_image');
                } else {
                    this.headerTitle.innerHTML = `<span>${t('header_text_write')}</span>`;
                    this.userInput.placeholder = t('placeholder_write_text');
                }
                this.inputSection.classList.remove('hidden');
                break;
            case 'colors':
                this.headerTitle.innerHTML = `<span>${t('colors_title')}</span>`;
                this.inputSection.classList.add('hidden');
                this.colorAnalyzer.startColorAnalysis(this.selectedText);
                break;
            case 'settings':
                this.headerTitle.innerHTML = `<div class="header-logo"><img src="${chrome.runtime.getURL('icons/logo.png')}" alt="Logo"></div>`;
                this.inputSection.classList.add('hidden');
                this.selectedTextContext.style.display = 'none';
                this.actionButtons.style.display = 'none';
                this.settingsManager.startSettingsView(this.selectedText);
                break;
            case 'history':
                this.headerTitle.innerHTML = `<span>${t('header_history')}</span>`;
                this.inputSection.classList.remove('hidden');
                this.selectedTextContext.style.display = 'none';
                this.actionButtons.style.display = 'none';
                this.conversationManager.startHistoryView();
                break;
        }
    }


    async handleSubmit() {
        const userInput = this.userInput.value.trim();
        if (!userInput) return;

        // Determine the actual action to handle (could be history mode using original action)
        const actionToHandle = (this.action === 'history' && this.originalAction) 
            ? this.originalAction 
            : this.action;

        // Add user message to conversation history immediately for prompt/write actions
        if (actionToHandle === 'prompt' || actionToHandle === 'write') {
            this.conversationManager.addUserMessageToHistory(userInput);
        }

        // Clear the input field
        this.userInput.value = '';

        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = `<div id="orbital"></div>`;

        createPulsingShape(this.submitBtn.querySelector('#orbital'), 40, 'circle', true);

        try {
            switch (actionToHandle) {
                case 'prompt':
                    await this.googleNanoHandler.handlePrompt(userInput);
                    break;
                case 'write':
                    await this.googleNanoHandler.handleWrite(userInput);
                    break;
            }
        } catch (error) {
            this.showError('Failed to process request. Please try again.');
            console.error('Error:', error);
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = submitBtnHTML;
        }
    }


    updateResponse(text) {
        if (this.action === 'colors') {
            this.responseContent.innerHTML = text;
            return;
        }

        // For prompt, write, and history actions, show streaming response in conversation history
        if (this.action === 'prompt' || this.action === 'write' || this.action === 'history' || this.isHistoryMode) {
            this.conversationManager.updateStreamingResponse(text);
            
            // Use requestAnimationFrame to ensure DOM has updated before scrolling
            requestAnimationFrame(() => {
                // In history mode, scroll the history-content container instead of main content
                if (this.action === 'history' || this.isHistoryMode) {
                    const historyContent = this.shadowRoot.querySelector('.history-content');
                    if (historyContent) {
                        historyContent.scrollTo({
                            top: historyContent.scrollHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    this.content.scrollTo({
                        top: this.content.scrollHeight + 10,
                        behavior: 'smooth'
                    });
                }
            });
        } else {
            const html = parseMarkdownToHTML(text);
            this.responseContent.innerHTML = html;
            
            // Use requestAnimationFrame to ensure DOM has updated before scrolling
            requestAnimationFrame(() => {
                this.content.scrollTo({
                    top: this.content.scrollHeight + 10,
                    behavior: 'smooth'
                });
            });
        }
    }

    showLoading() {
        // For prompt, write, and history actions, don't show the response section
        // since we're using conversation history for streaming (submit button shows loading instead)
        if (this.action === 'prompt' || this.action === 'write' || this.action === 'history' || this.isHistoryMode) {
            return;
        }

        // Show the response section for other actions
        this.responseSection.style.display = 'flex';

        this.responseContent.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; width: 100%; padding: 100px 0 50px 0;">
            <div id="orbital-loading"></div>
        </div>`;

        createPulsingShape(this.responseContent.querySelector('#orbital-loading'), 40, 'circle', true);
    }

    showError(message) {
        // Show the response section
        this.responseSection.style.display = 'flex';

        this.responseContent.innerHTML = getErrorMessageHTML({
            message
        });
    }

    showActionButtons() {
        // Don't show action buttons for colors action
        if (this.action !== 'colors') {
            this.actionButtons.style.display = 'flex';
        }
    }

    async copyResponse() {
        try {
            await navigator.clipboard.writeText(this.currentResponse);
            this.showNotification('Copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    async shareResponse() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AI Generated Content',
                    text: this.currentResponse
                });
            } catch (error) {
                console.error('Failed to share:', error);
            }
        } else {
            // Fallback to copying
            this.copyResponse();
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

    // Get position from selection range (fallback method - not used for main positioning)
    getSelectionPosition() {
        // This method is kept for compatibility but we now use mouse position directly
        return calculateSafePosition(this.position || { x: 0, y: 0 }, { width: 400, height: 300 });
    }

    // Update popover position
    updatePosition() {
        if (this.popoverElement) {
            const safePosition = calculateSafePosition(this.position, { width: 400, height: 300 });
            const isPageMode = this.selectionType === 'page';
            const absolutePosition = isPageMode ? safePosition : calculateAbsolutePosition(safePosition);
            this.popoverElement.style.left = `${absolutePosition.x}px`;
            this.popoverElement.style.top = `${absolutePosition.y}px`;
        }
    }

    setupDragHandlers() {
        if (!this.header || !this.popoverElement) return;
        
        // Initialize the drag handler
        this.dragHandler = new DragHandler(this.popoverElement, this.header);
    }


    close() {
        // Cleanup drag handler
        if (this.dragHandler) {
            this.dragHandler.destroy();
            this.dragHandler = null;
        }

        // Cleanup settings manager
        if (this.settingsManager) {
            this.settingsManager.destroy();
            this.settingsManager = null;
        }

        // Disconnect height observer if it exists
        if (this.heightObserver) {
            this.heightObserver.disconnect();
            this.heightObserver = null;
        }

        if (this.popoverElement) {
            // Remove visible class to trigger fade out
            this.popoverElement.classList.remove('visible');

            // Clear text selection to prevent weird state issues
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }

            // Notify content script to hide action buttons
            window.dispatchEvent(new CustomEvent('popoverClosed'));

            // Wait for transition to complete before removing from DOM
            setTimeout(() => {
                if (this.popoverElement) {
                    this.popoverElement.remove();
                    this.popoverElement = null;
                }
            }, 300); // Match the CSS transition duration
        }
    }
  }
  