export function getShadowRootHTML() {
    return `
<div class="popover-container">
    <div class="header">
        <div id="header-title" class="header-title">AI Assistant</div>
        <button class="close-btn" id="close-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
        </button>
    </div>

    <div class="content">
        <div class="selected-text-context" id="selected-text-context">
            <div class="context-text" id="context-text">
            
            </div>
        </div>
        
        <div class="conversation-history" id="conversation-history" style="display: none;">
        <!-- Conversation history will be populated here -->
        </div>
        
        <div class="response-section" id="response-section" style="display: none;">
            <div class="response-content" id="response-content">
                <div class="loading">
                <div class="loading-spinner"></div>
                </div>
            </div>

            <div class="action-buttons initial-action-buttons" id="action-buttons" style="display: none;">
                <button class="action-btn" id="copy-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                </button>
                <button class="action-btn" id="share-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
    <div class="input-section-wrapper">
        <div class="input-section" id="input-section">
            <textarea 
            class="input-field" 
            id="user-input" 
            placeholder="Enter your question or request..."
            rows="3"
            ></textarea>

            <div class="input-section-footer">
        <button class="ghost-btn circle" id="voice-btn" title="Voice input">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 10v3"/>
                <path d="M6 6v11"/>
                <path d="M10 3v18"/>
                <path d="M14 8v7"/>
                <path d="M18 5v13"/>
                <path d="M22 10v3"/>
            </svg>
        </button>
            <button class="submit-btn" id="submit-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
                <path d="m9 10-5 5 5 5"/>
                </svg>
            </button>
            </div>
        </div>
    </div>
</div>`;
}


export const loadingSpinnerHTML = `
<div class="loading">
    <div class="loading-spinner"></div>
</div>`;

export const submitBtnHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
    <path d="m9 10-5 5 5 5"/>
</svg>`;

export function getErrorMessageHTML({
    message,
}) {
    return `
<div style="color: #dc2626; text-align: center; padding: 20px;">
    ${message}
</div>`;
}


