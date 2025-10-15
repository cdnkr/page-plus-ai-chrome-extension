const DEBUG_MODE = false;
// Debug flag to enable mock download simulation
const DEBUG_SIMULATE_DOWNLOAD = false;

// Styles 

function getPopoverElementCSS({ position, shouldUseAbsolutePosition }) {
    return `
    position: ${shouldUseAbsolutePosition ? 'fixed' : 'absolute'};
    left: ${position.x}px;
    top: ${position.y}px;
`;
}

const shadowRootCSS = `
:host {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: rgba(255, 255, 255, 1);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    opacity: 0;
    filter: blur(20px);
    transition: opacity 0.3s ease-out, filter 0.3s ease-out;
    width: 400px;
    border: none;
    z-index: 10001;
    display: block;
    cursor: default !important;
}

:host(.visible) {
    opacity: 1;
    filter: blur(0px);
}

/* Override cursor for all popover content */
* {
    cursor: default !important;
}

/* But allow pointer cursor for interactive elements */
button, .action-btn, .copy-color-btn {
    cursor: pointer !important;
}

.header {
    padding: 18px 20px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    cursor: move !important;
    user-select: none;
}

.header.dragging {
    cursor: grabbing;
}

.header::after {
    content: '';
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, transparent 100%);
    pointer-events: none;
    z-index: 1;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    color: #1f2937;
    margin: 0;
}

.close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background: white;
}

.close-btn, .close-btn svg, .close-btn path {
    cursor: pointer !important;
}

.close-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 1);
}

.content {
    display: flex;
    flex-direction: column;
    padding: 20px;
    max-height: 40vh;
    overflow: auto;
}

.content::-webkit-scrollbar {
    display: none !important;
}

.input-section-wrapper {
    padding: 20px 20px 20px 20px;
    position: relative;
}

.input-section-wrapper::before {
    content: '';
    position: absolute;
    top: -35px;
    left: 0;
    right: 0;
    height: 35px;
    background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, transparent 100%);
    pointer-events: none;
    z-index: 1;
}

.input-section {
    padding: 16px 12px 12px 18px;
    background: rgba(0, 0, 0, 0.07);
    border-radius: 30px;
    box-sizing: border-box;
}

.input-section-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.input-section.hidden {
    display: none;
}

.input-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.input-field {
    width: 100% !important;
    font-size: 14px !important;
    resize: none !important;
    outline: none !important;
    box-sizing: border-box !important;
    background: transparent !important;
    border: none !important;
    font-family: sans-serif !important;
    color: #374151 !important;
    cursor: text !important;
}

.input-field::placeholder {
    color: rgba(0, 0, 0, 0.6);
}

.submit-btn {
    width: 44px;
    height: 44px;
    padding: 8px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.submit-btn, .submit-btn svg, .submit-btn path {
    cursor: pointer !important;
}

.submit-btn:hover:not(:disabled) {
    background: #3b82f6;
    transform: translateY(-1px);
}

.submit-btn:disabled {
    background: rgba(0, 0, 0, 0.1);
    cursor: not-allowed;
    transform: none;
}

.response-section {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.selected-text-context {
    font-size: 13px;
    margin-top: 6px;
}

.context-text {
    overflow-y: auto;
    font-style: italic;
    color: #3b82f6;
    padding-left: 1rem;
    display: block;
    border-left: 2px solid #3b82f6;
}

.context-text:has(div > img) {
    border-left: none;
    padding-left: 0;
}

.response-content {
    padding: 0;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.6;
    color: #374151;
}

.response-content h1, 
.response-content h2, 
.response-content h3 {
    color: #1f2937;
    margin: 16px 0 8px 0;
}

.response-content h1:first-child,
.response-content h2:first-child,
.response-content h3:first-child {
    margin-top: 0;
}

.response-content p {
    margin: 8px 0;
}

.response-content ul, 
.response-content ol {
    margin: 8px 0;
    padding-left: 20px;
}

.response-content li {
    margin: 4px 0;
}

.response-content blockquote {
    border-left: 4px solid #3b82f6;
    padding-left: 16px;
    margin: 16px 0;
    color: #6b7280;
    font-style: italic;
}

.response-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
}

.response-content th,
.response-content td {
    border: 1px solid #d1d5db;
    padding: 8px 12px;
    text-align: left;
}

.response-content th {
    background: #f3f4f6;
    font-weight: 600;
}

.response-content a {
    color: #3b82f6;
    text-decoration: none;
}

.response-content a:hover {
    text-decoration: underline;
}

.response-content strong {
    font-weight: 600;
}

.response-content em {
    font-style: italic;
}

.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #6b7280;
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.action-buttons {
    display: flex;
    gap: 2px;
}

.action-btn {
    padding: 10px;
    border-radius: 50%;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    background: transparent !important;
    border: none !important;
}

.action-btn:hover {
    background: rgba(0, 0, 0, 0.1) !important;
}

.action-btn.primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.action-btn.primary:hover {
    background: #2563eb;
    border-color: #2563eb;
}

.action-btn svg, 
.action-btn path {
    cursor: pointer !important;
}

.ghost-btn {
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
    padding: 8px 12px !important;
    color: #374151 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    border-radius: 11px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.ghost-btn:hover {
    background: rgba(0, 0, 0, 0.1) !important;
}

/* Voice ghost button */
.ghost-btn.circle {
    width: 44px;
    height: 44px;
    border-radius: 50% !important;
    padding: 0 !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.ghost-btn.circle .loading-spinner {
    width: 18px;
    height: 18px;
    border-width: 2px;
}

.hidden {
    display: none !important;
}

.message {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
}

.message:last-child {
    margin-bottom: 0;
}

.user-message {
    align-self: flex-end;
    margin-left: auto;
    max-width: 80%;
}

.user-message .message-content {
    background: #3b82f6;
    color: white;
    padding: 12px 16px;
    border-radius: 18px 18px 4px 18px;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
}

.ai-message {
    align-self: flex-start;
    max-width: 100%;
}

.ai-message .message-content {
    color: #374151;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
}

.ai-message .message-actions {
    display: flex;
    gap: 4px;
    margin-top: 8px;
    opacity: 1;
}

.message-action-btn {
    padding: 8px;
    border-radius: 50%;
    color: black;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.message-action-btn, .message-action-btn svg, .message-action-btn path {
    cursor: pointer !important;
}

.message-action-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #374151;
}

.message-content h1, 
.message-content h2, 
.message-content h3 {
    color: inherit;
    margin: 8px 0 4px 0;
}

.message-content h1:first-child,
.message-content h2:first-child,
.message-content h3:first-child {
    margin-top: 0;
}

.message-content p {
    margin: 4px 0;
}

.message-content ul, 
.message-content ol {
    margin: 4px 0;
    padding-left: 20px;
}

.message-content li {
    margin: 2px 0;
}

.message-content blockquote {
    border-left: 3px solid currentColor;
    padding-left: 12px;
    margin: 8px 0;
    opacity: 0.8;
}

.message-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    font-size: 13px;
}

.message-content th,
.message-content td {
    border: 1px solid currentColor;
    padding: 6px 8px;
    text-align: left;
}

.message-content th {
    background: rgba(0, 0, 0, 0.1);
    font-weight: 600;
}

.message-content a {
    color: inherit;
    text-decoration: underline;
}

.message-content strong {
    font-weight: 600;
}

.message-content em {
    font-style: italic;
}

.color-info-wrapper {
    display: flex;
    justify-content: space-between;
}

.color-item {
    display: flex;
    flex-direction: column;
    position: relative;
}

.color-swatch {
    width: 100%;
    height: 60px;
    border-radius: 14px;
    margin-bottom: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.color-info {
    flex: 1;
}

.color-hex {
    font-family: monospace;
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 2px;
}

.color-rgb {
    font-family: monospace;
    font-size: 10px;
    color: #6b7280;
}

.copy-color-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    background: rgba(255, 255, 255, 0.9);
    border: none;
}

.copy-color-btn svg, .copy-color-btn path {
    cursor: pointer;
    color: black !important;
}

.copy-color-btn:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
}

.colors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
}

.conversation-history {
    margin-top: 20px;
}
`;

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

// Utils

function parseMarkdownToHTML(markdown) {
    let html = markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^\*\*(.*?)\*\*:/gm, "<h3>$1:</h3>");

    // Markdown headers (# ## ###)
    html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*)$/gm, "<h1>$1</h1>");

    // Blockquotes
    html = html.replace(/^&gt;\s?(.*)$/gm, "<blockquote>$1</blockquote>");

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Lists
    html = html.replace(/(?:^|\n)\* (.*?)(?=\n|$)/g, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

    // Tables - process line by line to find complete table blocks
    const lines = html.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Check if this line starts a table
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            const tableLines = [line];
            i++;

            // Collect all consecutive table lines
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i]);
                i++;
            }

            // Check if we have a valid table (at least header + separator + one data row)
            if (tableLines.length >= 3) {
                const separatorLine = tableLines[1];
                if (/^\|[\s\-:]+\|/.test(separatorLine.trim())) {
                    // Parse the table
                    const headerRow = tableLines[0];
                    const dataRows = tableLines.slice(2);

                    // Parse header
                    const headerCells = headerRow.split('|').slice(1, -1).map(cell => cell.trim());
                    const headerHtml = headerCells.map(cell => `<th>${cell}</th>`).join('');

                    // Parse data rows
                    const rowsHtml = dataRows.map(row => {
                        const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
                        const cellsHtml = cells.map(cell => `<td>${cell}</td>`).join('');
                        return `<tr>${cellsHtml}</tr>`;
                    }).join('');

                    result.push(`<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`);
                    continue;
                }
            }

            // If not a valid table, add the lines back as-is
            result.push(...tableLines);
        } else {
            result.push(line);
            i++;
        }
    }

    html = result.join('\n');

    // Paragraphs
    html = html
        .split(/\n{2,}/)
        .map(block => {
            if (/^<\/?(h\d|ul|li|blockquote|table)/.test(block.trim())) return block;
            return `<p>${block.trim().replace(/\n/g, "<br>")}</p>`;
        })
        .join("\n");

    return html.trim();
}

// HTML

function getShadowRootHTML() {
    return `
<div class="popover-container">
    <div class="header">
        <div id="header-title" class="header-title">AI Assistant</div>
        <button class="close-btn" id="close-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

        <div class="action-buttons" id="action-buttons" style="display: none;">
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

function getContextHTML({
    selectedText,
}) {
    return `<div style="margin-bottom: 12px;">
    <img src="${selectedText}" style="width: 100%; height: auto; border-radius: 20px;" alt="Selected area screenshot" />
</div>`;
}

function getModelDownloadButtonHTML({
    dataKey,
}) {
    return `<button class="action-btn" data-action="download" data-key="${dataKey}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg></button>`;
}

function getCircularDownloadProgressHTML({
    size,
    stroke,
    r,
    c,
    pct,
    offset
}) {
    return `
<div style="position:relative; width:${size}px; height:${size}px; display:inline-flex; align-items:center; justify-content:center; padding: 2px 8px;">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="#e5e7eb" stroke-width="${stroke}" fill="none" />
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="#3b82f6" stroke-width="${stroke}" fill="none" stroke-linecap="round"
        stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})" />
    </svg>
    <div style="position:absolute; font-size:8px; color:#111827; font-weight:600;">${pct}%</div>
</div>`;
}

function getDebugSelectHTML({
    key,
    state,
}) {
    return `
    <select class="debug-state" data-key="${key}" style="padding:4px 6px; border-radius:8px; border:1px solid #d1d5db; background:white; font-size:12px;">
        ${['default', 'available', 'downloadable', 'downloading', 'unavailable'].map(v => `<option value="${v}" ${((state || 'default') === v) ? 'selected' : ''}>${v}</option>`).join('')}
    </select>
`;
}

function getSettingsAPIRowHTML({
    icon,
    label,
    description,
    actionHTML,
    debugSelectHTML,
    statusBadgeHTML,
}) {
    debugSelectHTML = DEBUG_MODE ? `<div style="display:flex; align-items:center; gap:8px;">${debugSelectHTML}</div>` : '';

    return `<div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; gap:16px;">
    <div style="display:flex; align-items:flex-start; gap:8px; min-width:160px;">
        ${icon}
        <div style="display:flex; flex-direction:column; gap:4px; max-width:260px;">
            <span>${label}</span>
            <div style="font-size:12px; color:#6b7280;">${description}</div>
        </div>
    </div>
    <div style="display:flex; align-items:center; justify-content:flex-end; gap:8px;">${statusBadgeHTML} ${actionHTML}</div>
</div>`;
}

function getSettingsViewHTML({
    apiRowsHTML,
    languageOptions,
    t,
}) {
    return `
<div style="display:flex; flex-direction:column; gap:16px;">
    <div>
        <div style="font-weight:600; color:#374151; margin-bottom:8px;">${t('settings_api_availability')}</div>
        <div style="font-size:12px; color:#6b7280; margin-bottom:8px;">${t('settings_api_availability_description')}</div>
        ${apiRowsHTML}
        <div style="margin-top:8px; font-size:12px; color:#6b7280;">${t('settings_flags_help')}</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
            <button class="ghost-btn" id="open-flags">
                ${t('settings_open_flags')}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-up-right-icon lucide-move-up-right"><path d="M13 5H19V11"/><path d="M19 5L5 19"/></svg>
            </button>
            <button class="ghost-btn" id="open-internals">
                ${t('settings_open_internals')}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-up-right-icon lucide-move-up-right"><path d="M13 5H19V11"/><path d="M19 5L5 19"/></svg>
            </button>
        </div>
    </div>

    <div>
        <div style="font-weight:600; color:#374151; margin-bottom:8px;">${t('settings_language')}</div>
        <select id="language-select" style="padding:8px 10px; border-radius:10px; border:1px solid #d1d5db; background:white; font-size:13px;">
            ${languageOptions}
        </select>
    </div>
</div>`;
}

const loadingSpinnerHTML = `
<div class="loading">
    <div class="loading-spinner"></div>
</div>`;

const submitBtnHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
    <path d="m9 10-5 5 5 5"/>
</svg>`;

function getColorsGridHTML({
    colors,
}) {
    const colorsHtml = colors.map((color, index) => `
        <div class="color-item">
            <div class="color-swatch" style="background: ${color.rgb};"></div>
            
            <div class="color-info-wrapper">
                <div class="color-info">
                    <div class="color-hex">${color.hex}</div>
                    <div class="color-rgb">${color.rgb}</div>
                </div>
                <button class="copy-color-btn" data-color="${color.hex}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    return `
        <div class="colors-container">
            <div class="colors-grid">
                ${colorsHtml}
            </div>
        </div>
    `;
}

function getErrorMessageHTML({
    message,
}) {
    return `
<div style="color: #dc2626; text-align: center; padding: 20px;">
    ${message}
</div>`;
}

function getConversationHistoryHTML({
    conversationHistory,
    escapeHtml,
    isHtmlContent,
    stripHtml
}) {
    return conversationHistory.map((entry, index) => `
<div class="message user-message">
    <div class="message-content">${escapeHtml(entry.user)}</div>
</div>
<div class="message ai-message">
    <div class="message-content">${isHtmlContent(entry.ai) ? entry.ai : parseMarkdownToHTML(entry.ai)}</div>
    <div class="message-actions">
        <button class="message-action-btn" data-action="copy" data-content="${escapeHtml(stripHtml(entry.ai))}" title="Copy">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
        <button class="message-action-btn" data-action="share" data-content="${escapeHtml(stripHtml(entry.ai))}" title="Share">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-icon lucide-share"><path d="M12 2v13"/><path d="m16 6-4-4-4 4"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/></svg>
        </button>
    </div>
</div>
`).join('');
}

function getMessageActionButtonsHTML({
    content,
}) {
    return `
<button class="message-action-btn" data-action="copy" data-content="${content}" title="Copy">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
</button>
<button class="message-action-btn" data-action="share" data-content="${content}" title="Share">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-icon lucide-share"><path d="M12 2v13"/><path d="m16 6-4-4-4 4"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/></svg>
</button>`;
}

function getMessageContentHTML({
    content,
}) {
    return `<div class="message-content">${content}</div>`;
}

// Popover script for handling AI interactions

export class PopoverAI {
    constructor(action, selectedText, position, selectionRange, selectionType = 'text') {
        try {
            console.log('PopoverAI constructor called with:', { action, selectedText: selectedText.substring(0, 50) + '...', position, selectionType });
            this.action = action;
            this.selectedText = selectedText;
            this.position = position;
            this.selectionRange = selectionRange;
            this.selectionType = selectionType; // 'text' or 'dragbox'
            this.session = null;
            this.summarizer = null;
            this.writer = null;
            this.currentResponse = '';
            this.popoverElement = null;

            // History management
            this.sessionId = this.generateSessionId();
            this.conversationHistory = [];
            this.isHistoryLoaded = false;
            this.currentUserMessage = null;

            // Drag functionality
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.initialX = 0;
            this.initialY = 0;

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
            const shouldUseAbsolutePosition = this.selectionType === 'page' || this.action === 'settings';
            let position;

            // Handle bottom-anchored positioning
            if (this.isBottomAnchored && this.position.bottomY !== undefined) {
                this.anchorBottomY = this.position.bottomY;
                // For bottom-anchored, just use x position and position off-screen temporarily
                // Safe x position calculation
                let safeX = this.position.x;
                const margin = 20;
                const popoverWidth = 400;
                if (safeX + popoverWidth > window.innerWidth - margin) {
                    safeX = window.innerWidth - popoverWidth - margin;
                }
                if (safeX < margin) {
                    safeX = margin;
                }
                position = { x: safeX, y: -10000 };
            } else {
                const safePosition = this.calculateSafePosition(this.position, { width: 400, height: 360 });
                position = shouldUseAbsolutePosition ? safePosition : this.calculateAbsolutePosition(safePosition);
            }

            this.popoverElement.style.cssText = getPopoverElementCSS({
                position,
                shouldUseAbsolutePosition,
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
                    if ((this.selectionType === 'page' && this.action === 'prompt') || this.action === 'settings') {
                        this.setupHeightObserver();
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
                this.contextText.innerHTML = getContextHTML({
                    selectedText: this.selectedText
                });
            } else if (this.selectionType === 'page') {
                this.contextText.innerHTML = `${window.location.host}${window.location.pathname}` || 'Current Page';
            } else {
                this.contextText.textContent = this.selectedText.length > 100 ? this.selectedText.slice(0, 100) + '...' : this.selectedText;
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
        this.copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.copyResponse();
        });
        this.shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.shareResponse();
        });

        if (this.voiceBtn) {
            this.voiceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.startVoiceInput();
            });
        }

        // Ensure i18n is ready before configuring action-specific UI
        await this.loadI18nOnce();

        // Add drag functionality to header
        this.setupDragHandlers();

        // Setup for the specific action
        this.setupForAction();

        // Load conversation history for prompt and write actions
        if (this.action === 'prompt' || this.action === 'write') {
            this.loadConversationHistory();
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
                this.startSummarization();
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
                this.startColorAnalysis();
                break;
            case 'settings':
                this.headerTitle.innerHTML = `<span>${t('settings_title')}</span>`;
                this.inputSection.classList.add('hidden');
                this.selectedTextContext.style.display = 'none';
                this.actionButtons.style.display = 'none';
                this.startSettingsView();
                break;
        }
    }

    async startSettingsView() {
        try {
            await this.loadI18nOnce();
            let payload = {};
            try { payload = JSON.parse(this.selectedText || '{}'); } catch (_) { }
            let availability = payload.availability || {};  // Changed to let so it can be updated
            const locale = payload.locale || (navigator.language || 'en-US');

            const t = this.t || ((k) => k);
            const apiRows = [
                { key: 'prompt', label: t('api_prompt'), description: t('api_prompt_description'), icon: `<svg style="flex-shrink:0; margin-top: 5px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-more-icon lucide-message-circle-more"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>` },
                { key: 'summarizer', label: t('api_summarizer'), description: t('api_summarizer_description'), icon: `<svg style="flex-shrink:0; margin-top: 5px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-text-icon lucide-book-text"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/></svg>` },
                { key: 'writer', label: t('api_writer'), description: t('api_writer_description'), icon: `<svg style="flex-shrink:0; margin-top: 5px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-line-icon lucide-pencil-line"><path d="M13 21h8"/><path d="m15 5 4 4"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>` }
            ];

            const statusBadge = (status, progress) => {
                if (status === 'downloading' || status === 'downloadable') return '';

                const map = {
                    available: { text: '<svg style="flex-shrink:0;" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>', color: '#10b981' },
                    unavailable: { text: '<svg style="flex-shrink:0;" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert-icon lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>', color: '#ef4444' },
                    unknown: { text: '<svg style="flex-shrink:0;" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-question-mark-icon lucide-shield-question-mark"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>', color: '#6b7280' }
                };
                const s = map[status] || map.unknown;
                return `<span style="display:inline-block; padding:2px 8px; border-radius:9999px; font-size:11px; color:${s.color};">${s.text}</span>`;
            };

            const render = async () => {
                const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
                const overrides = overridesObj.selection_ai_debug_overrides || {};
                const effective = { ...availability };
                apiRows.forEach(r => {
                    if (overrides[r.key] && overrides[r.key].state) {
                        effective[r.key] = overrides[r.key].state;
                    }
                });

                const apiRowsHTML = apiRows.map(r => {
                    const o = overrides[r.key] || {};
                    const status = (DEBUG_SIMULATE_DOWNLOAD && o.state !== 'downloading') ? 'downloadable' : (effective[r.key] || 'unknown');
                    const progress = o.progress;
                    const actionHtml = status === 'downloadable'
                        ? getModelDownloadButtonHTML({
                            dataKey: r.key
                        })
                        : status === 'downloading'
                            ? (() => {
                                const size = 28; // px
                                const stroke = 3;
                                const r = (size - stroke) / 2;
                                const c = 2 * Math.PI * r;
                                const pct = Math.max(0, Math.min(100, Number(progress ?? 0)));
                                const offset = c * (1 - pct / 100);
                                return getCircularDownloadProgressHTML({
                                    size,
                                    stroke,
                                    r,
                                    c,
                                    pct,
                                    offset
                                });
                            })()
                            : '';
                    // Debug controls
                    const debugSelect = getDebugSelectHTML({
                        key: r.key,
                        state: o.state
                    });
                    return getSettingsAPIRowHTML({
                        icon: r.icon,
                        label: r.label,
                        description: r.description,
                        status: status,
                        progress: progress,
                        actionHTML: actionHtml,
                        debugSelectHTML: debugSelect,
                        statusBadgeHTML: statusBadge(status, progress)
                    })
                }).join('');

                this.responseSection.style.display = 'flex';
                this.responseContent.innerHTML = getSettingsViewHTML({
                    apiRowsHTML: apiRowsHTML,
                    languageOptions: this.languageOptions(locale),
                    t: t
                });

                // Wire actions
                const flagsBtn = this.shadowRoot.querySelector('#open-flags');
                const internalsBtn = this.shadowRoot.querySelector('#open-internals');
                const langSel = this.shadowRoot.querySelector('#language-select');
                const downloadButtons = this.shadowRoot.querySelectorAll('[data-action="download"]');
                const debugSelects = this.shadowRoot.querySelectorAll('.debug-state');
                const debugProgress = this.shadowRoot.querySelectorAll('.debug-progress');
                const clearBtn = this.shadowRoot.querySelector('#clear-debug');

                if (flagsBtn) flagsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openUrl('chrome://flags');
                });
                if (internalsBtn) internalsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openUrl('chrome://on-device-internals');
                });
                if (langSel) langSel.addEventListener('change', async (e) => {
                    const newLocale = e.target.value;
                    try {
                        await chrome.storage.local.set({ selection_ai_locale: newLocale });
                        window.location.reload();
                    } catch (err) {
                        console.error('Failed to save locale', err);
                    }
                });
                downloadButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Trigger a user-gesture download via availability API if supported
                        this.triggerModelDownload(btn.getAttribute('data-key'));
                    });
                });

                const saveOverrides = async (newOverrides) => {
                    await chrome.storage.local.set({ selection_ai_debug_overrides: newOverrides });
                    // Notify content script to refresh badge/icons
                    window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: newOverrides }));
                    // Re-render to reflect changes
                    render();
                };

                const currentOverrides = overrides; // from earlier await

                debugSelects.forEach(sel => {
                    sel.addEventListener('change', async (e) => {
                        const key = sel.getAttribute('data-key');
                        const val = sel.value;
                        const next = { ...currentOverrides };
                        next[key] = next[key] || {};
                        if (val === 'default') {
                            delete next[key];
                        } else {
                            next[key].state = val;
                            if (val !== 'downloading') delete next[key].progress;
                        }
                        await saveOverrides(next);
                    });
                });

                debugProgress.forEach(slider => {
                    slider.addEventListener('input', async () => {
                        const key = slider.getAttribute('data-key');
                        const val = Number(slider.value);
                        const next = { ...currentOverrides };
                        next[key] = next[key] || {};
                        if ((next[key].state || 'default') === 'downloading') {
                            next[key].progress = val;
                            await saveOverrides(next);
                        }
                    });
                });

                if (clearBtn) clearBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await saveOverrides({});
                });
            };

            // Initial render
            render();

            // Listen for availability override updates to re-render
            const handleOverrideUpdate = () => {
                render();
            };
            window.addEventListener('selectionAiAvailabilityOverride', handleOverrideUpdate);

            // Listen for availability refresh (when real API state is re-checked)
            const handleAvailabilityRefresh = (e) => {
                const { key, status } = e.detail || {};
                if (key && status) {
                    availability[key] = status;  // Update the availability object with fresh data
                    render();  // Re-render with updated availability
                }
            };
            window.addEventListener('selectionAiAvailabilityRefresh', handleAvailabilityRefresh);

            // Clean up listeners when popover closes
            const originalClose = this.close.bind(this);
            this.close = () => {
                window.removeEventListener('selectionAiAvailabilityOverride', handleOverrideUpdate);
                window.removeEventListener('selectionAiAvailabilityRefresh', handleAvailabilityRefresh);
                originalClose();
            };
        } catch (e) {
            console.error('Failed to render settings view', e);
            this.showError('Failed to load settings');
        }
    }

    languageOptions(current) {
        const options = [
            'en-US', 'es-ES', 'ja-JP'
        ];
        return options.map(code => `<option value="${code}" ${code === current ? 'selected' : ''}>${code}</option>`).join('');
    }

    async openUrl(url) {
        try {
            await chrome.runtime.sendMessage({ action: 'openUrl', url });
        } catch (e) {
            console.error('openUrl failed', e);
        }
    }

    async triggerModelDownload(key) {
        try {
            // Real API call for actual download with progress tracking
            const createOptions = {
                monitor: (m) => {
                    m.addEventListener('downloadprogress', async (e) => {
                        const progress = Math.round(e.loaded * 100);

                        // Get current overrides
                        const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
                        const overrides = overridesObj.selection_ai_debug_overrides || {};

                        // Update progress
                        const next = { ...overrides };
                        next[key] = { state: 'downloading', progress };

                        await chrome.storage.local.set({ selection_ai_debug_overrides: next });
                        window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: next }));

                        if (progress === 100) {
                            await this.setDownloadComplete(key);
                        }
                    });
                }
            };

            // Set initial downloading state
            const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
            const overrides = overridesObj.selection_ai_debug_overrides || {};
            const next = { ...overrides };
            next[key] = { state: 'downloading', progress: 0 };
            await chrome.storage.local.set({ selection_ai_debug_overrides: next });
            window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: next }));

            this.showNotification('Model download started');

            // Start download with progress monitoring
            if (DEBUG_SIMULATE_DOWNLOAD) {
                await this.simulateDownloadProgress(key);
            } else {
                if (key === 'prompt' && 'LanguageModel' in self) {
                    await LanguageModel.create(createOptions);
                } else if (key === 'summarizer' && 'Summarizer' in self) {
                    await Summarizer.create(createOptions);
                } else if (key === 'writer' && 'Writer' in self) {
                    await Writer.create(createOptions);
                }

            }

            // Set to available state after download completes, then re-check real availability
            this.showNotification('Model download completed');
        } catch (e) {
            console.error('Failed to request model download', e);
            this.showNotification('Failed to request download');
        }
    }

    async removeDownloadOverride(key) {
        const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
        const overrides = overridesObj.selection_ai_debug_overrides || {};
        const next = { ...overrides };
        delete next[key];
        await chrome.storage.local.set({ selection_ai_debug_overrides: next });
        window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: next }));
    }

    async setDownloadComplete(key) {
        // Remove the download override
        await this.removeDownloadOverride(key);

        // Re-check actual API availability to get fresh state
        try {
            let realStatus = 'unknown';
            if (key === 'prompt' && 'LanguageModel' in self && typeof LanguageModel.availability === 'function') {
                realStatus = await LanguageModel.availability();
            } else if (key === 'summarizer' && 'Summarizer' in self && typeof Summarizer.availability === 'function') {
                realStatus = await Summarizer.availability();
            } else if (key === 'writer' && 'Writer' in self && typeof Writer.availability === 'function') {
                realStatus = await Writer.availability();
            }

            // Dispatch event to trigger UI refresh with fresh availability
            window.dispatchEvent(new CustomEvent('selectionAiAvailabilityRefresh', {
                detail: { key, status: realStatus }
            }));
        } catch (e) {
            console.error('Failed to re-check availability', e);
        }
    }

    async simulateDownloadProgress(key) {
        try {
            // Simulate download over 5 seconds
            const duration = 5000;
            const steps = 20;
            const stepDuration = duration / steps;

            for (let i = 1; i <= steps; i++) {
                await new Promise(resolve => setTimeout(resolve, stepDuration));

                const progress = Math.round((i / steps) * 100);

                // Get current overrides
                const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
                const overrides = overridesObj.selection_ai_debug_overrides || {};

                // Update progress
                const next = { ...overrides };
                if (next[key] && next[key].state === 'downloading') {
                    next[key].progress = progress;

                    await chrome.storage.local.set({ selection_ai_debug_overrides: next });
                    window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: next }));
                } else {
                    // Download was cancelled
                    return;
                }
            }

            // Set to available state after download completes
            await this.setDownloadComplete(key);
            this.showNotification('Model download completed');
        } catch (e) {
            console.error('Failed to simulate download progress', e);
        }
    }

    async handleSubmit() {
        const userInput = this.userInput.value.trim();
        if (!userInput) return;

        // Add user message to conversation history immediately
        if (this.action === 'prompt' || this.action === 'write') {
            this.addUserMessageToHistory(userInput);
        }

        // Clear the input field
        this.userInput.value = '';

        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = loadingSpinnerHTML;
        this.showLoading();

        try {
            switch (this.action) {
                case 'prompt':
                    await this.handlePrompt(userInput);
                    break;
                case 'write':
                    await this.handleWrite(userInput);
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

    async handlePrompt(userInput) {
        try {
            // Load preferred language and normalize to base code (e.g., en-US -> en)
            // Cache locale on window for reuse; coerce to supported base language
            try {
                const { selection_ai_locale } = await chrome.storage.local.get(['selection_ai_locale']);
                if (selection_ai_locale) window.__selection_ai_cached_locale = selection_ai_locale;
            } catch (_) { }
            const baseLang = this.getPreferredBaseLanguage();

            // Build Prompt API options with languages per docs
            const promptOptions = this.selectionType === 'dragbox'
                ? {
                    expectedInputs: [
                        { type: 'image' },
                        { type: 'text', languages: [baseLang] }
                    ],
                    expectedOutputs: [
                        { type: 'text', languages: [baseLang] }
                    ]
                }
                : {
                    expectedInputs: [
                        { type: 'text', languages: [baseLang] }
                    ],
                    expectedOutputs: [
                        { type: 'text', languages: [baseLang] }
                    ]
                };

            // Check if Prompt API is available
            if (!('LanguageModel' in self)) {
                throw new Error('Prompt API not available');
            }

            // Check availability
            const availability = await LanguageModel.availability(promptOptions);
            if (availability === 'unavailable') {
                throw new Error('Language model not available');
            }

            // Create session if not exists
            if (!this.session) {
                this.session = await LanguageModel.create(promptOptions);
            }

            // Show loading
            this.showLoading();

            // Get conversation history context
            const historyContext = this.getHistoryContext();

            let stream;
            if (this.selectionType === 'dragbox') {
                // For drag box, send image with text prompt and history
                const imageFile = await this.dataURLtoFile(this.selectedText, 'screenshot.png');
                const fullPrompt = historyContext + userInput;

                stream = this.session.promptStreaming([
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                value: fullPrompt
                            },
                            {
                                type: 'image',
                                value: imageFile
                            }
                        ]
                    }
                ]);
            } else {
                // For text selection, use text prompt with history
                const baseContext = `Based on this selected text: "${this.selectedText}"`;
                const prompt = `${baseContext}\n\n${historyContext}User question: ${userInput}`;
                stream = this.session.promptStreaming(prompt);
            }

            this.currentResponse = '';
            for await (const chunk of stream) {
                this.currentResponse += chunk;
                this.updateResponse(this.currentResponse);
            }

            // Finalize the AI message in conversation history
            this.finalizeAiMessage();

            this.showActionButtons();
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleWrite(userInput) {
        try {
            // Load preferred language and normalize to base code
            try {
                const { selection_ai_locale } = await chrome.storage.local.get(['selection_ai_locale']);
                if (selection_ai_locale) window.__selection_ai_cached_locale = selection_ai_locale;
            } catch (_) { }
            const baseLang = this.getPreferredBaseLanguage();

            // Check if Writer API is available
            if (!('Writer' in self)) {
                throw new Error('Writer API not available');
            }

            // Check availability
            const availability = await Writer.availability({ languages: [baseLang] });
            if (availability === 'unavailable') {
                throw new Error('Writer not available');
            }

            // Create writer if not exists
            if (!this.writer) {
                this.writer = await Writer.create({
                    tone: 'neutral',
                    format: 'markdown',
                    length: 'medium',
                    languages: [baseLang]
                });
            }

            // Get conversation history context
            const historyContext = this.getHistoryContext();

            // Create writing prompt with context based on selection type
            let prompt;
            if (this.selectionType === 'dragbox') {
                // For drag box, we have an image
                prompt = `${historyContext}Based on this selected image, write about: ${userInput}`;
            } else {
                // For text selection
                prompt = `${historyContext}Based on this selected text: "${this.selectedText}"\n\nWrite about: ${userInput}`;
            }

            // Show loading
            this.showLoading();

            // Get streaming response
            const stream = this.writer.writeStreaming(prompt);

            this.currentResponse = '';
            for await (const chunk of stream) {
                this.currentResponse += chunk;
                this.updateResponse(this.currentResponse);
            }

            // Finalize the AI message in conversation history
            this.finalizeAiMessage();

            this.showActionButtons();
        } catch (error) {
            this.showError(error.message);
        }
    }

    async startSummarization() {
        try {
            // Load preferred language and normalize to base code
            try {
                const { selection_ai_locale } = await chrome.storage.local.get(['selection_ai_locale']);
                if (selection_ai_locale) window.__selection_ai_cached_locale = selection_ai_locale;
            } catch (_) { }
            const baseLang = this.getPreferredBaseLanguage();

            // Check if Summarizer API is available
            if (!('Summarizer' in self)) {
                throw new Error('Summarizer API not available');
            }

            // Check availability
            const availability = await Summarizer.availability({ languages: [baseLang] });
            if (availability === 'unavailable') {
                throw new Error('Summarizer not available');
            }

            // Create summarizer if not exists
            if (!this.summarizer) {
                this.summarizer = await Summarizer.create({
                    type: 'key-points',
                    format: 'markdown',
                    length: 'medium',
                    languages: [baseLang]
                });
            }

            // Show loading
            this.showLoading();

            // Get streaming summary
            const stream = this.summarizer.summarizeStreaming(this.selectedText);

            this.currentResponse = '';
            for await (const chunk of stream) {
                this.currentResponse += chunk;
                this.updateResponse(this.currentResponse);
            }

            this.showActionButtons();
        } catch (error) {
            this.showError(error.message);
        }
    }

    async startColorAnalysis() {
        try {
            // Show loading
            this.showLoading();

            // Analyze colors from the image
            const colors = await this.analyzeImageColors(this.selectedText);

            if (colors && colors.length > 0) {
                this.displayColors(colors);
                this.showActionButtons();
            } else {
                this.showError('Could not analyze colors from the image');
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    async analyzeImageColors(imageDataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;

                    ctx.drawImage(img, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;

                    // Sample pixels and count color frequencies
                    const colorCounts = new Map();
                    const sampleRate = Math.max(1, Math.floor(pixels.length / 4 / 1000)); // Sample every nth pixel

                    for (let i = 0; i < pixels.length; i += 4 * sampleRate) {
                        const r = pixels[i];
                        const g = pixels[i + 1];
                        const b = pixels[i + 2];
                        const a = pixels[i + 3];

                        // Skip transparent pixels
                        if (a < 128) continue;

                        // Quantize colors to reduce noise
                        const quantizedR = Math.round(r / 32) * 32;
                        const quantizedG = Math.round(g / 32) * 32;
                        const quantizedB = Math.round(b / 32) * 32;

                        const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
                        colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1);
                    }

                    // Sort by frequency and get top 6 colors
                    const sortedColors = Array.from(colorCounts.entries())
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([colorKey]) => {
                            const [r, g, b] = colorKey.split(',').map(Number);
                            return {
                                rgb: `rgb(${r}, ${g}, ${b})`,
                                hex: this.rgbToHex(r, g, b)
                            };
                        });

                    resolve(sortedColors);
                } catch (error) {
                    console.error('Error analyzing colors:', error);
                    resolve([]);
                }
            };

            img.onerror = () => {
                console.error('Error loading image for color analysis');
                resolve([]);
            };

            img.src = imageDataUrl;
        });
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    async dataURLtoFile(dataUrl, filename) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    }

    displayColors(colors) {
        this.currentResponse = getColorsGridHTML({
            colors
        });

        this.updateResponse(this.currentResponse);

        // Add click handlers for copy buttons
        setTimeout(() => {
            const copyButtons = this.shadowRoot.querySelectorAll('.copy-color-btn');
            copyButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const color = btn.getAttribute('data-color');
                    navigator.clipboard.writeText(color).then(() => {
                        this.showNotification(`Copied ${color} to clipboard!`);
                    }).catch(err => {
                        console.error('Failed to copy color:', err);
                    });
                });
            });
        }, 100);
    }

    updateResponse(text) {
        if (this.action === 'colors') {
            this.responseContent.innerHTML = text;
            return;
        }

        // For prompt and write actions, show streaming response in conversation history
        if (this.action === 'prompt' || this.action === 'write') {
            this.updateStreamingResponse(text);
        } else {
            const html = parseMarkdownToHTML(text);
            this.responseContent.innerHTML = html;
        }

        // Use requestAnimationFrame to ensure DOM has updated before scrolling
        requestAnimationFrame(() => {
            this.content.scrollTo({
                top: this.content.scrollHeight + 10,
                behavior: 'smooth'
            });
        });
    }

    updateStreamingResponse(text) {
        const historyContainer = this.shadowRoot.querySelector('#conversation-history');
        if (!historyContainer) return;

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

    showLoading() {
        // For prompt and write actions, don't show the response section
        // since we're using conversation history for streaming
        if (this.action === 'prompt' || this.action === 'write') {
            return;
        }

        // Show the response section for other actions
        this.responseSection.style.display = 'flex';

        this.responseContent.innerHTML = loadingSpinnerHTML;
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

    startVoiceInput() {
        if (!this.voiceBtn) return;

        const original = this.voiceBtn.innerHTML;
        this.voiceBtn.dataset.original = original;
        this.voiceBtn.innerHTML = loadingSpinnerHTML;
        this.voiceBtn.disabled = true;

        const finish = () => {
            if (!this.voiceBtn) return;
            this.voiceBtn.disabled = false;
            if (this.voiceBtn.dataset.original) {
                this.voiceBtn.innerHTML = this.voiceBtn.dataset.original;
            }
        };

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.showNotification('Microphone not supported in this browser.');
                finish();
                return;
            }

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    try {
                        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                        if (!SpeechRecognition) {
                            this.showNotification('Speech Recognition not supported.');
                            try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                            finish();
                            return;
                        }

                        let locale = 'en-US';
                        try {
                            const base = this.getPreferredBaseLanguage ? this.getPreferredBaseLanguage() : 'en';
                            if (base === 'es') locale = 'es-ES';
                            else if (base === 'ja') locale = 'ja-JP';
                        } catch (_) { }

                        const rec = new SpeechRecognition();
                        rec.lang = locale;
                        rec.interimResults = false;
                        rec.maxAlternatives = 1;

                        rec.onresult = (event) => {
                            try {
                                const transcript = event.results && event.results[0] && event.results[0][0]
                                    ? event.results[0][0].transcript
                                    : '';
                                if (transcript && this.userInput) {
                                    if (this.userInput.value && !this.userInput.value.endsWith(' ')) {
                                        this.userInput.value = `${this.userInput.value} ${transcript}`;
                                    } else if (this.userInput.value) {
                                        this.userInput.value = `${this.userInput.value}${transcript}`;
                                    } else {
                                        this.userInput.value = transcript;
                                    }
                                }
                            } catch (e) {
                                console.warn('Failed to read recognition result', e);
                            } finally {
                                try { rec.stop(); } catch (_) { }
                                try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                                finish();
                            }
                        };

                        rec.onerror = (e) => {
                            console.warn('Speech recognition error', e);
                            this.showNotification('Voice capture failed. Please try again.');
                            try { rec.stop(); } catch (_) { }
                            try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                            finish();
                        };

                        rec.onend = () => {
                            try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                            finish();
                        };

                        rec.start();
                    } catch (err) {
                        console.error('Speech setup failed', err);
                        try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                        finish();
                    }
                })
                .catch((err) => {
                    console.warn('Microphone permission denied or unavailable', err);
                    this.showNotification('Microphone permission denied.');
                    finish();
                });

        } catch (error) {
            console.error('startVoiceInput unexpected error', error);
            this.showNotification('Voice capture failed.');
            finish();
        }
    }

    // Get position from selection range (fallback method - not used for main positioning)
    getSelectionPosition() {
        // This method is kept for compatibility but we now use mouse position directly
        return this.calculateSafePosition(this.position || { x: 0, y: 0 }, { width: 400, height: 300 });
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

    // Update popover position
    updatePosition() {
        if (this.popoverElement) {
            const safePosition = this.calculateSafePosition(this.position, { width: 400, height: 300 });
            const isPageMode = this.selectionType === 'page';
            const absolutePosition = isPageMode ? safePosition : this.calculateAbsolutePosition(safePosition);
            this.popoverElement.style.left = `${absolutePosition.x}px`;
            this.popoverElement.style.top = `${absolutePosition.y}px`;
        }
    }

    setupDragHandlers() {
        if (!this.header) return;

        this.header.addEventListener('mousedown', (e) => {
            // Don't start drag if clicking on close button
            if (e.target.closest('.close-btn')) return;

            e.preventDefault();
            e.stopPropagation();

            this.startDrag(e);
        });

        // Add global mouse events for drag handling
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.drag(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (this.isDragging) {
                this.endDrag(e);
            }
        });
    }

    startDrag(e) {
        this.isDragging = true;
        this.header.classList.add('dragging');

        // Store initial mouse position and popover position
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;

        // Get current position from computed style to match the positioning mode (fixed vs absolute)
        const computedStyle = window.getComputedStyle(this.popoverElement);
        this.initialX = parseInt(computedStyle.left, 10) || 0;
        this.initialY = parseInt(computedStyle.top, 10) || 0;

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
    }

    drag(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        // Calculate new position
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;

        const newX = this.initialX + deltaX;
        const newY = this.initialY + deltaY;

        // Update popover position
        this.popoverElement.style.left = `${newX}px`;
        this.popoverElement.style.top = `${newY}px`;
    }

    endDrag(e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.header.classList.remove('dragging');

        // Restore text selection
        document.body.style.userSelect = '';
    }

    close() {
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

    setupHeightObserver() {
        if (!this.popoverElement || !this.isBottomAnchored || !this.anchorBottomY) return;

        // Use ResizeObserver to track height changes
        this.heightObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const newHeight = entry.contentRect.height;

                // Only adjust if height has actually changed and we have an initial height
                if (this.initialHeight !== null && newHeight !== this.initialHeight) {
                    const heightDelta = newHeight - this.initialHeight;

                    // Get current top position
                    const currentTop = parseInt(this.popoverElement.style.top, 10);

                    // Adjust top position to keep bottom anchored
                    const newTop = currentTop - heightDelta;
                    this.popoverElement.style.top = `${newTop}px`;

                    // Update initial height for next comparison
                    this.initialHeight = newHeight;

                    console.log('Height changed, adjusted position:', {
                        heightDelta,
                        newHeight,
                        currentTop,
                        newTop
                    });
                }
            }
        });

        // Start observing the popover element
        this.heightObserver.observe(this.popoverElement);
    }

    // History management methods
    generateSessionId() {
        // For page prompts, use URL to ensure per-page history
        if (this.selectionType === 'page') {
            const urlHash = this.createSimpleHash(window.location.href);
            return `session_${this.action}_page_${urlHash}`;
        }

        // For text/dragbox selections, use content hash
        const contentHash = this.createSimpleHash(this.selectedText.substring(0, 100));
        return `session_${this.action}_${contentHash}`;
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

    async loadConversationHistory() {
        try {
            console.log('Loading conversation history for session:', this.sessionId);
            const result = await chrome.storage.local.get([this.sessionId]);
            if (result[this.sessionId]) {
                this.conversationHistory = result[this.sessionId];
                this.isHistoryLoaded = true;
                this.displayConversationHistory();
                console.log('Loaded conversation history:', this.conversationHistory);
            } else {
                console.log('No existing conversation history found for session:', this.sessionId);
            }
        } catch (error) {
            console.error('Failed to load conversation history:', error);
        }
    }

    async saveConversationHistory() {
        try {
            await chrome.storage.local.set({
                [this.sessionId]: this.conversationHistory
            });
            console.log('Saved conversation history:', this.conversationHistory);
        } catch (error) {
            console.error('Failed to save conversation history:', error);
        }
    }

    addToHistory(userMessage, aiResponse) {
        console.log('Adding to conversation history:', { user: userMessage, ai: aiResponse.substring(0, 100) + '...' });
        this.conversationHistory.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: Date.now()
        });
        this.saveConversationHistory();
        this.displayConversationHistory();
    }

    displayConversationHistory() {
        if (!this.isHistoryLoaded || this.conversationHistory.length === 0) {
            return;
        }

        const historyContainer = this.shadowRoot.querySelector('#conversation-history');
        if (!historyContainer) return;

        const conversationHistoryHtml = getConversationHistoryHTML({
            conversationHistory: this.conversationHistory,
            escapeHtml: this.escapeHtml,
            isHtmlContent: this.isHtmlContent,
            setupHistoryActionButtons: this.setupHistoryActionButtons,
            stripHtml: this.stripHtml
        });

        historyContainer.innerHTML = conversationHistoryHtml;
        historyContainer.style.display = 'block';

        // Add event handlers for action buttons
        this.setupHistoryActionButtons();
    }

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

    setupHistoryActionButtons() {
        const actionButtons = this.shadowRoot.querySelectorAll('.message-action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const content = btn.getAttribute('data-content');

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
            this.showNotification('Copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showNotification('Failed to copy to clipboard');
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

    getHistoryContext() {
        if (this.conversationHistory.length === 0) {
            return '';
        }

        const context = this.conversationHistory.map(entry =>
            `User: ${entry.user}\nAI: ${entry.ai}`
        ).join('\n\n');

        return `Previous conversation:\n${context}\n\n`;
    }

    addUserMessageToHistory(userMessage) {
        const historyContainer = this.shadowRoot.querySelector('#conversation-history');
        if (!historyContainer) return;

        // Store the current user message for later use
        this.currentUserMessage = userMessage;

        // Create user message element
        const userMessageEl = document.createElement('div');
        userMessageEl.className = 'message user-message';
        userMessageEl.innerHTML = getMessageContentHTML({
            content: this.escapeHtml(userMessage)
        });

        // Add to conversation history
        historyContainer.appendChild(userMessageEl);
        historyContainer.style.display = 'block';

        // Scroll to bottom
        requestAnimationFrame(() => {
            this.content.scrollTo({
                top: this.content.scrollHeight - 50,
                behavior: 'smooth'
            });
        });
    }

    finalizeAiMessage() {
        // Remove the streaming class and add to conversation history
        const currentAiMessage = this.shadowRoot.querySelector('.ai-message.current-streaming');
        if (currentAiMessage && this.currentUserMessage) {
            currentAiMessage.classList.remove('current-streaming');

            // Get the AI message content
            const aiMessageEl = currentAiMessage.querySelector('.message-content');
            if (aiMessageEl) {
                const aiMessage = aiMessageEl.innerHTML;

                // Add action buttons to the current AI message
                this.addActionButtonsToMessage(currentAiMessage, aiMessage);

                this.conversationHistory.push({
                    user: this.currentUserMessage,
                    ai: aiMessage,
                    timestamp: Date.now()
                });

                this.saveConversationHistory();

                // Clear the current user message
                this.currentUserMessage = null;
            }
        }

        this.content.scrollTo({
            top: this.content.scrollHeight,
            behavior: 'smooth'
        });
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

        // Add event handlers for the new buttons
        this.setupHistoryActionButtons();
    }
}

async function simulateCreate(createOptions = {}) {
    const { monitor } = createOptions;

    // Create a mock monitor object that mimics the real API's monitor
    const mockMonitor = {
        _listeners: {},
        addEventListener(eventName, callback) {
            if (!this._listeners[eventName]) {
                this._listeners[eventName] = [];
            }
            this._listeners[eventName].push(callback);
        },
        _dispatchEvent(eventName, eventData) {
            const listeners = this._listeners[eventName] || [];
            listeners.forEach(callback => {
                const event = {
                    type: eventName,
                    ...eventData
                };
                callback(event);
            });
        }
    };

    // Call the monitor callback if provided (just like the real API)
    if (typeof monitor === 'function') {
        monitor(mockMonitor);
    }

    // Simulate download progress over 3-5 seconds
    const duration = 3000 + Math.random() * 2000; // Random 3-5 seconds
    const steps = 20;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));

        const loaded = i / steps; // Progress from 0 to 1 (0% to 100%)

        // Dispatch downloadprogress event (matches real API format)
        mockMonitor._dispatchEvent('downloadprogress', {
            loaded: loaded,
            total: 1
        });
    }

    // Return a mock session object (mimics real API response)
    return {
        async prompt(text) {
            // Simulate AI response delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return `[SIMULATED] Response to: ${text}`;
        },
        async promptStreaming(text) {
            // Mock streaming response
            const stream = new ReadableStream({
                async start(controller) {
                    const chunks = ['[SIMULATED] ', 'Streaming ', 'response ', 'to: ', text];
                    for (const chunk of chunks) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        controller.enqueue(chunk);
                    }
                    controller.close();
                }
            });
            return stream;
        },
        destroy() {
            console.log('Mock session destroyed');
        }
    };
}