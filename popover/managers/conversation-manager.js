/**
 * ConversationManager - Manages conversation history and history view
 * Handles session persistence, history UI, and conversation display
 */

import { parseMarkdownToHTML } from '../../utils/markdown-parser.js';
import {
    getHistoryViewHTML,
    getHistoryItemHTML,
    getHistoryNoItemsHTML
} from '../templates/history-templates.js';
import {
    getConversationHistoryHTML,
    getMessageActionButtonsHTML,
    getMessageContentHTML
} from '../templates/conversation-templates.js';
import { FG_RGB, SELECTION_COLOR_HEX } from '../../config.js';

export class ConversationManager {
    constructor(popover) {
        this.popover = popover;
        this.shadowRoot = popover.shadowRoot;
    }

    // ==================== Session Management ====================

    generateSessionId(action, selectionType, selectedText) {
        // For page prompts, use URL to ensure per-page history
        if (selectionType === 'page') {
            const urlHash = this.createSimpleHash(window.location.href);
            return `session_${action}_page_${urlHash}`;
        }

        // For text/dragbox selections, use content hash
        const contentHash = this.createSimpleHash(selectedText.substring(0, 100));
        return `session_${action}_${contentHash}`;
    }

    createSimpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    // ==================== History Operations ====================

    async loadConversationHistory(sessionId) {
        try {
            console.log('Loading conversation history for session:', sessionId);
            const result = await chrome.storage.local.get([sessionId]);
            if (result[sessionId]) {
                const sessionData = result[sessionId];

                // Handle both old format (array) and new format (object with conversation array)
                if (Array.isArray(sessionData)) {
                    // Old format - convert to new format
                    this.popover.conversationHistory = sessionData;
                    console.log('Loaded conversation history (old format):', this.popover.conversationHistory);
                } else if (sessionData.conversation && Array.isArray(sessionData.conversation)) {
                    // New format - extract conversation array
                    this.popover.conversationHistory = sessionData.conversation;
                    console.log('Loaded conversation history (new format):', this.popover.conversationHistory);
                } else {
                    console.log('Invalid session data format for session:', sessionId);
                    this.popover.conversationHistory = [];
                }

                this.popover.isHistoryLoaded = true;
                this.displayConversationHistory();
            } else {
                console.log('No existing conversation history found for session:', sessionId);
            }
        } catch (error) {
            console.error('Failed to load conversation history:', error);
        }
    }

    async saveConversationHistory(sessionId, history) {
        try {
            // Create new session format
            const sessionData = {
                mode: this.popover.selectionType, // "text" | "drag" | "page"
                action: this.popover.action, // "ask" | "summarize" | "write"
                selectedText: this.popover.selectedText, // can be null for images
                url: window.location.href, // current page URL
                timestamp: Date.now(), // timestamp of session start
                conversation: history
            };

            await chrome.storage.local.set({
                [sessionId]: sessionData
            });
            console.log('Saved conversation history:', sessionData);
        } catch (error) {
            console.error('Failed to save conversation history:', error);
        }
    }

    addToHistory(sessionId, userMessage, aiResponse) {
        console.log('Adding to conversation history:', { user: userMessage, ai: aiResponse.substring(0, 100) + '...' });
        this.popover.conversationHistory.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: Date.now()
        });
        this.saveConversationHistory(sessionId, this.popover.conversationHistory);
        this.displayConversationHistory();
    }

    getHistoryContext() {
        if (this.popover.conversationHistory.length === 0) {
            return '';
        }

        const context = this.popover.conversationHistory.map(entry =>
            `User: ${entry.user}\nAI: ${entry.ai}`
        ).join('\n\n');

        return `Previous conversation:\n${context}\n\n`;
    }

    // ==================== History View UI ====================

    async startHistoryView() {
        try {
            await this.popover.loadI18nOnce();
            const t = this.popover.t || ((k) => k);

            // Load all sessions from storage
            const allData = await chrome.storage.local.get(null);
            const sessions = [];

            // Filter for session keys and parse them
            for (const [key, value] of Object.entries(allData)) {
                if (key.startsWith('session_')) {
                    // Parse session info from key
                    const parts = key.split('_');
                    const action = parts[1]; // prompt, write, etc.

                    let sessionInfo = null;

                    // Handle both old format (array) and new format (object)
                    if (Array.isArray(value) && value.length > 0) {
                        // Old format - array of conversation entries
                        const firstEntry = value[0];
                        const timestamp = firstEntry.timestamp || Date.now();

                        sessionInfo = {
                            sessionId: key,
                            action: action,
                            title: firstEntry.user?.substring(0, 50) || 'Untitled conversation',
                            timestamp: timestamp,
                            entries: value,
                            sessionData: null // No session data for old format
                        };
                    } else if (value && value.conversation && Array.isArray(value.conversation) && value.conversation.length > 0) {
                        // New format - object with conversation array
                        const firstEntry = value.conversation[0];
                        const timestamp = value.timestamp || firstEntry.timestamp || Date.now();

                        sessionInfo = {
                            sessionId: key,
                            action: value.action || action,
                            title: firstEntry.user?.substring(0, 50) || 'Untitled conversation',
                            timestamp: timestamp,
                            entries: value.conversation,
                            sessionData: {
                                mode: value.mode,
                                action: value.action,
                                selectedText: value.selectedText
                            }
                        };
                    }

                    if (sessionInfo) {
                        sessions.push(sessionInfo);
                    }
                }
            }

            // Sort by timestamp (most recent first)
            sessions.sort((a, b) => b.timestamp - a.timestamp);

            // Generate sidebar HTML
            let sidebarHTML = '';
            if (sessions.length === 0) {
                sidebarHTML = getHistoryNoItemsHTML();
            } else {
                sidebarHTML = sessions.map((session, index) => {
                    const date = new Date(session.timestamp);
                    const dateStr = this.formatHistoryDate(date);

                    return getHistoryItemHTML({
                        sessionId: session.sessionId,
                        title: session.title,
                        date: dateStr,
                        isActive: index === 0 // First one is active by default
                    });
                }).join('');
            }

            // Generate main content HTML (show most recent conversation)
            let mainHTML = '';
            if (sessions.length > 0) {
                const activeSession = sessions[0];
                this.popover.currentHistorySession = activeSession;
                this.popover.sessionId = activeSession.sessionId;
                this.popover.conversationHistory = activeSession.entries;

                // Preserve the original action type from the session for handling new messages
                this.popover.originalAction = activeSession.action;
                this.popover.isHistoryMode = true;

                // Build conversation HTML
                mainHTML = `
                    <div class="history-content">
                        <div class="conversation-history" id="conversation-history" style="display: block;">
                            ${this.buildHistoryConversationHTML(activeSession.entries, activeSession.sessionData)}
                        </div>
                    </div>`;
            } else {
                mainHTML = `
                    <div class="history-content">
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(255, 255, 255, 0.5);">
                            ${t('history_no_conversations')}
                        </div>
                    </div>`;
            }

            // Show in response section
            this.popover.responseSection.style.display = 'flex';
            this.popover.responseContent.innerHTML = getHistoryViewHTML({
                sidebarHTML,
                mainHTML
            });

            // Set up click handlers for history items
            this.setupHistoryItemClickHandlers(sessions);

        } catch (error) {
            console.error('Failed to load history:', error);
            this.popover.showError('Failed to load conversation history');
        }
    }

    formatHistoryDate(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;

        return date.toLocaleDateString();
    }

    buildHistoryConversationHTML(entries, sessionData = null) {
        // Build context section if session data is available
        let contextHTML = '';
        if (sessionData) {
            if (sessionData.mode === 'dragbox') {
                // Image context - show info text
                contextHTML = `
                    <div class="history-context">
                        <div class="context-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-icon lucide-image">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                <circle cx="9" cy="9" r="2"/>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                        </div>
                        <div class="context-content">
                            <img style="width: 100%; height: auto; border-radius: 20px;" src="${sessionData.selectedText}" alt="Selected image">
                        </div>
                    </div>
                `;
            } else if (sessionData.mode === 'page') {
                // Page context - show page icon and URL
                const pageIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;
                const pageText = sessionData.selectedText ?
                    (sessionData.selectedText.length > 200 ? sessionData.selectedText.slice(0, 200) + '...' : sessionData.selectedText) :
                    `${window.location.host}${window.location.pathname}` || 'Current Page';
                const url = sessionData.url || window.location.href;
                contextHTML = `
                    <div class="history-context">
                        <div class="context-icon">${pageIcon}</div>
                        <div class="context-content">
                            <a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
                                ${this.escapeHtml(url?.replace(/^https?:\/\//, ''))}
                            </a>

                            <p style="color: rgba(${FG_RGB}, 0.6);">
                                ${this.escapeHtml(pageText)}
                            </p>
                        </div>
                    </div>
                `;
            } else if (sessionData.mode === 'text' && sessionData.selectedText) {
                // Text selection - show text icon and snippet
                const textIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-italic-icon lucide-italic"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>`;
                const textContent = sessionData.selectedText.length > 200 ? sessionData.selectedText.slice(0, 200) + '...' : sessionData.selectedText;
                const url = sessionData.url || window.location.href;
                contextHTML = `
                    <div class="history-context">
                        <div class="context-icon">${textIcon}</div>
                        <div class="context-content">
                            <a href="${this.escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
                                ${this.escapeHtml(url?.replace(/^https?:\/\//, ''))}
                            </a>

                            <p style="color: rgba(${FG_RGB}, 0.6);">
                                ${this.escapeHtml(textContent)}
                            </p>
                        </div>
                    </div>
                `;
            }
        }

        // Build conversation entries
        const conversationHTML = entries.map(entry => {
            const userContent = this.escapeHtml(entry.user);
            const aiContent = this.isHtmlContent(entry.ai) ? entry.ai : parseMarkdownToHTML(entry.ai);

            return `
                <div class="message user-message">
                    <div class="message-content">${userContent}</div>
                </div>
                <div class="message ai-message">
                    <div class="message-content">${aiContent}</div>
                    <div class="message-actions">
                        ${getMessageActionButtonsHTML({
                content: this.escapeHtml(this.stripHtml(entry.ai))
            })}
                    </div>
                </div>
            `;
        }).join('');

        return contextHTML + conversationHTML;
    }

    setupHistoryItemClickHandlers(sessions) {
        const historyItems = this.shadowRoot.querySelectorAll('.history-item');

        historyItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();

                // Remove active class from all items
                historyItems.forEach(i => i.classList.remove('active'));

                // Add active class to clicked item
                item.classList.add('active');

                // Load the selected session
                const session = sessions[index];
                this.loadHistorySession(session);
            });
        });
    }

    loadHistorySession(session) {
        this.popover.currentHistorySession = session;
        this.popover.sessionId = session.sessionId;
        this.popover.conversationHistory = session.entries;

        // Preserve the original action type from the session for handling new messages
        this.popover.originalAction = session.action;
        this.popover.isHistoryMode = true;

        // Update the main content area
        const historyMain = this.shadowRoot.querySelector('.history-main');
        if (historyMain) {
            historyMain.innerHTML = `
                <div class="history-content">
                    <div class="conversation-history" id="conversation-history" style="display: block;">
                        ${this.buildHistoryConversationHTML(session.entries, session.sessionData)}
                    </div>
                </div>`;

            // Re-setup action buttons for the new conversation
            this.setupHistoryActionButtons();
        }
    }

    // ==================== Conversation Display ====================

    displayConversationHistory() {
        if (!this.popover.isHistoryLoaded || this.popover.conversationHistory.length === 0) {
            return;
        }

        const historyContainer = this.shadowRoot.querySelector('#conversation-history');
        if (!historyContainer) return;

        const conversationHistoryHtml = getConversationHistoryHTML({
            conversationHistory: this.popover.conversationHistory,
            escapeHtml: this.escapeHtml.bind(this),
            isHtmlContent: this.isHtmlContent.bind(this),
            stripHtml: this.stripHtml.bind(this)
        });

        historyContainer.innerHTML = conversationHistoryHtml;
        historyContainer.style.display = 'block';

        // Add event handlers for action buttons
        this.setupHistoryActionButtons();
    }

    addUserMessageToHistory(userMessage) {
        // In history mode, we need to find the conversation-history inside the history view
        let historyContainer;
        if (this.popover.action === 'history' || this.popover.isHistoryMode) {
            // Look specifically in the history view structure
            historyContainer = this.shadowRoot.querySelector('.history-content #conversation-history');
        } else {
            // Regular mode - use the base conversation-history in .content
            historyContainer = this.shadowRoot.querySelector('.content #conversation-history');
        }

        if (!historyContainer) {
            console.warn('addUserMessageToHistory: conversation-history container not found', {
                action: this.popover.action,
                isHistoryMode: this.popover.isHistoryMode
            });
            return;
        }

        console.log('addUserMessageToHistory: Adding message to history', {
            userMessage,
            sessionId: this.popover.sessionId
        });

        // Store the current user message for later use
        this.popover.currentUserMessage = userMessage;

        // Create user message element
        const userMessageEl = document.createElement('div');
        userMessageEl.className = 'message user-message';
        userMessageEl.innerHTML = getMessageContentHTML({
            content: this.escapeHtml(userMessage)
        });

        // Add to conversation history
        historyContainer.appendChild(userMessageEl);
        historyContainer.style.display = 'block';

        // Scroll to bottom - use appropriate container for history mode
        requestAnimationFrame(() => {
            if (this.popover.action === 'history' || this.popover.isHistoryMode) {
                const historyContent = this.shadowRoot.querySelector('.history-content');
                if (historyContent) {
                    historyContent.scrollTo({
                        top: historyContent.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            } else {
                this.popover.content.scrollTo({
                    top: this.popover.content.scrollHeight - 50,
                    behavior: 'smooth'
                });
            }
        });
    }

    updateStreamingResponse(text) {
        // In history mode, we need to find the conversation-history inside the history view
        let historyContainer;
        if (this.popover.action === 'history' || this.popover.isHistoryMode) {
            // Look specifically in the history view structure
            historyContainer = this.shadowRoot.querySelector('.history-content #conversation-history');
        } else {
            // Regular mode - use the base conversation-history in .content
            historyContainer = this.shadowRoot.querySelector('.content #conversation-history');
        }

        if (!historyContainer) {
            console.warn('updateStreamingResponse: conversation-history container not found', {
                action: this.popover.action,
                isHistoryMode: this.popover.isHistoryMode
            });
            return;
        }

        // Find or create the current AI message element
        let currentAiMessage = historyContainer.querySelector('.ai-message.current-streaming');
        if (!currentAiMessage) {
            // Create new AI message element for streaming
            currentAiMessage = document.createElement('div');
            currentAiMessage.className = 'message ai-message current-streaming';
            currentAiMessage.innerHTML = '<div class="message-content"></div>';
            historyContainer.appendChild(currentAiMessage);
        }

        // Update the content with parsed markdown
        const messageContent = currentAiMessage.querySelector('.message-content');
        
        text = text.replace(/```html/g, '');
        text = text.replace(/```/g, '');

        if (this.isHtmlContent(text)) {
            text = text.replace(/<html>/g, '');
            text = text.replace(/<\/html>/g, '');
            text = text.replace(/<body>/g, '');
            text = text.replace(/<\/body>/g, '');
    
            messageContent.innerHTML = text;    
        } else {
            messageContent.innerHTML = parseMarkdownToHTML(text);
        }

        // Show the conversation history
        historyContainer.style.display = 'block';
    }

    finalizeAiMessage() {
        // Remove the streaming class and add to conversation history
        const currentAiMessage = this.shadowRoot.querySelector('.ai-message.current-streaming');
        console.log('finalizeAiMessage called', {
            currentAiMessage: !!currentAiMessage,
            currentUserMessage: this.popover.currentUserMessage,
            sessionId: this.popover.sessionId,
            conversationHistoryLength: this.popover.conversationHistory.length
        });

        if (currentAiMessage && this.popover.currentUserMessage) {
            currentAiMessage.classList.remove('current-streaming');

            // Get the AI message content
            const aiMessageEl = currentAiMessage.querySelector('.message-content');
            if (aiMessageEl) {
                const aiMessage = aiMessageEl.innerHTML;

                this.popover.conversationHistory.push({
                    user: this.popover.currentUserMessage,
                    ai: aiMessage,
                    timestamp: Date.now()
                });

                console.log('finalizeAiMessage: Added to conversation history, now saving...', {
                    newLength: this.popover.conversationHistory.length,
                    sessionId: this.popover.sessionId
                });

                this.saveConversationHistory(this.popover.sessionId, this.popover.conversationHistory);

                // Add action buttons to the current AI message
                this.addActionButtonsToMessage(currentAiMessage, aiMessage);

                const initialActionButtons = this.shadowRoot.querySelector('.initial-action-buttons');

                if (initialActionButtons) {
                    initialActionButtons.style.display = 'none';
                }
                // Clear the current user message
                this.popover.currentUserMessage = null;
            }
        }
    }

    addActionButtonsToMessage(messageElement, content) {
        // Create action buttons container
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'message-actions';
        actionsContainer.innerHTML = getMessageActionButtonsHTML({
            content: this.escapeHtml(this.stripHtml(content))
        });

        // Add the action buttons to the message
        messageElement.appendChild(actionsContainer);
        this.setupHistoryActionButtons();
    }

    // ==================== Action Buttons ====================

    setupHistoryActionButtons() {
        // In history mode, only select buttons within the conversation area, not the whole shadow root
        let actionButtons;
        if (this.popover.action === 'history' || this.popover.isHistoryMode) {
            // Scope to only buttons inside the history-main area (excludes sidebar)
            const historyMain = this.shadowRoot.querySelector('.history-main');
            if (historyMain) {
                actionButtons = historyMain.querySelectorAll('.message-action-btn');
            } else {
                actionButtons = [];
            }
        } else {
            // For regular mode, scope to the conversation-history in .content area
            const conversationHistory = this.shadowRoot.querySelector('.content #conversation-history');
            actionButtons = conversationHistory ? conversationHistory.querySelectorAll('.message-action-btn') : [];
        }

        actionButtons.forEach(btn => {
            // Remove any existing listeners to avoid duplicates
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = newBtn.getAttribute('data-action');
                const content = newBtn.getAttribute('data-content');

                if (action === 'copy') {
                    this.copyText(content);
                } else if (action === 'share') {
                    this.shareText(content);
                }
            });
        });
    }

    async copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.popover.showNotification('Copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
            this.popover.showNotification('Failed to copy to clipboard');
        }
    }

    async shareText(text) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AI Response',
                    text: text
                });
            } catch (error) {
                console.error('Failed to share:', error);
                // Fallback to copying
                this.copyText(text);
            }
        } else {
            // Fallback to copying
            this.copyText(text);
        }
    }

    // ==================== Helper Methods ====================

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    isHtmlContent(content) {
        // Check if content contains HTML tags
        return /<[^>]+>/.test(content);
    }

    stripHtml(html) {
        // Remove HTML tags and get plain text
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }
}
