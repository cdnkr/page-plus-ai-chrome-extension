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
                this.popover.conversationHistory = result[sessionId];
                this.popover.isHistoryLoaded = true;
                this.displayConversationHistory();
                console.log('Loaded conversation history:', this.popover.conversationHistory);
            } else {
                console.log('No existing conversation history found for session:', sessionId);
            }
        } catch (error) {
            console.error('Failed to load conversation history:', error);
        }
    }

    async saveConversationHistory(sessionId, history) {
        try {
            await chrome.storage.local.set({
                [sessionId]: history
            });
            console.log('Saved conversation history:', history);
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
                    
                    // Get the first message for the title
                    if (Array.isArray(value) && value.length > 0) {
                        const firstEntry = value[0];
                        const timestamp = firstEntry.timestamp || Date.now();
                        
                        sessions.push({
                            sessionId: key,
                            action: action,
                            title: firstEntry.user?.substring(0, 50) || 'Untitled conversation',
                            timestamp: timestamp,
                            entries: value
                        });
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
                            ${this.buildHistoryConversationHTML(activeSession.entries)}
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

    buildHistoryConversationHTML(entries) {
        return entries.map(entry => {
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
                        ${this.buildHistoryConversationHTML(session.entries)}
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
        messageContent.innerHTML = parseMarkdownToHTML(text);

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
