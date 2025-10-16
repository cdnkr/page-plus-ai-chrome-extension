import { BG_RGB, FG_RGB, PRIMARY_COLOR_RGB } from '../../config.js';

export const USER_MESSAGE_BG_HEX = "#2e2e2e";

export const shadowRootCSS = `
:host {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: rgba(${BG_RGB}, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    opacity: 0;
    filter: blur(20px);
    transition: opacity 0.3s ease-out, filter 0.3s ease-out;
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
    background: rgba(${BG_RGB}, 1);
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
    background: linear-gradient(to bottom, rgba(${BG_RGB}, 1) 0%, transparent 100%);
    pointer-events: none;
    z-index: 1;
}

.header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    color: rgba(${FG_RGB}, 1);
    margin: 0;
}

.close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    color: rgba(${FG_RGB}, 0.5);
    background: rgba(${BG_RGB}, 0);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-btn, .close-btn svg, .close-btn path {
    cursor: pointer !important;
}

.close-btn:hover {
    background: rgba(${FG_RGB}, 0.1);
    color: rgba(${FG_RGB}, 1);
}

.content {
    display: flex;
    flex-direction: column;
    padding: 20px;
    max-height: 40vh;
    background: rgba(${BG_RGB}, 1);
    overflow: auto;
}

.content:has(.history-content) {
    padding: 0;
    max-height: 40vh;
    overflow: hidden;
}

.content::-webkit-scrollbar {
    display: none !important;
}

.input-section-wrapper {
    background: rgba(${BG_RGB}, 1);
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
    background: linear-gradient(to top, rgba(${BG_RGB}, 1) 0%, transparent 100%);
    pointer-events: none;
    z-index: 1;
}

.input-section {
    padding: 16px 12px 12px 18px;
    background: rgba(${FG_RGB}, 0.1);
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
    color: rgba(${FG_RGB}, 0.6);
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
    color: rgba(${FG_RGB}, 1) !important;
    cursor: text !important;
}

.input-field::placeholder {
    color: rgba(${FG_RGB}, 0.6);
}

.submit-btn {
    width: 44px;
    height: 44px;
    padding: 8px;
    background: rgba(${PRIMARY_COLOR_RGB}, 1);
    color: black;
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
    background: rgba(${PRIMARY_COLOR_RGB}, 1);
    transform: translateY(-1px);
}

.submit-btn:disabled {
    background: rgba(${FG_RGB}, 0);
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
    padding: 1rem;
    border-radius: 20px;
    background: rgba(${FG_RGB}, 0.1);
}

.selected-text-context:has(div > img) {
    padding: 0;
}

.context-text {
    overflow-y: auto;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: rgba(${FG_RGB}, 1);
    font-weight: 500;
}

.context-text .context-icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: rgba(${FG_RGB}, 1);
}

.context-text .context-icon svg {
    width: 20px;
    height: 20px;
    stroke: rgba(${FG_RGB}, 1);
}

.context-text .context-content {
    flex: 1;
    min-width: 0;
}

.response-content {
    padding: 0;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(${FG_RGB}, 1);
}

.response-content h1, 
.response-content h2, 
.response-content h3 {
    color: rgba(${FG_RGB}, 1);
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
    border-left: 4px solid rgba(${PRIMARY_COLOR_RGB}, 1);
    padding-left: 16px;
    margin: 16px 0;
    color: rgba(${FG_RGB}, 1);
    font-style: italic;
}

.response-content code {
    background: rgba(${FG_RGB}, 0.1);
    color: rgba(${PRIMARY_COLOR_RGB}, 1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
    font-size: 0.9em;
}

.response-content pre {
    background: rgba(${BG_RGB}, 0.4);
    border: 1px solid rgba(${FG_RGB}, 0.1);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    overflow-x: auto;
}

.response-content pre code {
    background: transparent;
    color: rgba(${FG_RGB}, 1);
    padding: 0;
    border-radius: 0;
    display: block;
    font-size: 13px;
    line-height: 1.5;
}

.response-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
}

.response-content th,
.response-content td {
    border: 1px solid rgba(${FG_RGB}, 1);
    padding: 8px 12px;
    text-align: left;
}

.response-content th {
    background: rgba(${FG_RGB}, 1);
    font-weight: 600;
}

.response-content a {
    color: rgba(${PRIMARY_COLOR_RGB}, 1);
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
    color: rgba(${FG_RGB}, 1);
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(${FG_RGB}, 0.5);
    border-top: 2px solid rgba(${PRIMARY_COLOR_RGB}, 1);
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
    color: rgba(${FG_RGB}, 0.5);
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
    color: rgba(${FG_RGB}, 1);
    background: rgba(${FG_RGB}, 0.1) !important;
}

.action-btn.primary {
    background: rgba(${PRIMARY_COLOR_RGB}, 1);
    color: white;
    border-color: rgba(${PRIMARY_COLOR_RGB}, 1);
}

.action-btn.primary:hover {
    background: rgba(${PRIMARY_COLOR_RGB}, 1);
    border-color: rgba(${PRIMARY_COLOR_RGB}, 1);
}

.action-btn svg, 
.action-btn path,
.action-btn svg rect,
.action-btn svg line,
.action-btn svg polyline,
.copy-color-btn svg,
.copy-color-btn path,
.copy-color-btn svg rect,
.copy-color-btn svg line,
.copy-color-btn svg polyline,
.copy-color-btn canvas {
    cursor: pointer !important;
}

.ghost-btn {
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
    padding: 8px 12px !important;
    color: rgba(${FG_RGB}, 1) !important;
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
    background: rgba(${FG_RGB}, 0.1) !important;
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

.ghost-btn svg,
.ghost-btn path,
.ghost-btn svg rect,
.ghost-btn svg line,
.ghost-btn svg polyline {
    cursor: pointer !important;
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
    background: rgba(${FG_RGB}, 0.1);
    color: rgba(${FG_RGB}, 1);
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
    color: rgba(${FG_RGB}, 0.8);
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
    color: rgba(${FG_RGB}, 0.5);
}

.message-action-btn, .message-action-btn svg, .message-action-btn path {
    cursor: pointer !important;
}

.message-action-btn:hover {
    background: rgba(${FG_RGB}, 0.1);
    color: rgba(${FG_RGB}, 1);
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

.message-content code {
    background: rgba(${FG_RGB}, 0.1);
    color: rgba(${PRIMARY_COLOR_RGB}, 1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
    font-size: 0.9em;
}

.message-content pre {
    background: rgba(${BG_RGB}, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 16px;
    margin: 12px 0;
    overflow-x: auto;
}

.message-content pre code {
    background: transparent;
    color: rgba(${PRIMARY_COLOR_RGB}, 1);
    background: rgba(${BG_RGB}, 0.4);
    padding: 0;
    border-radius: 0;
    display: block;
    font-size: 13px;
    line-height: 1.5;
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
    background: rgba(${FG_RGB}, 0.05);
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
    border: 1px solid rgba(${BG_RGB}, 0.1);
}

.color-info {
    flex: 1;
}

.color-hex {
    font-family: monospace;
    font-size: 12px;
    font-weight: 600;
    color: rgba(${FG_RGB}, 1);
    margin-bottom: 2px;
}

.color-rgb {
    font-family: monospace;
    font-size: 10px;
    color: rgba(${FG_RGB}, 0.6);
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
    border: none;
    background: rgba(${BG_RGB}, 0);
}

.copy-color-btn svg, .copy-color-btn path {
    cursor: pointer;
    color: rgba(${FG_RGB}, 0.5) !important;
}

.copy-color-btn:hover {
    opacity: 1;
    background: rgba(${FG_RGB}, 0.1);
}

.colors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
}

.conversation-history {
    margin-top: 20px;
    padding-bottom: 50px
}

.header-logo {
    height: 28px;
    width: auto;
    cursor: move !important;
}

.header-logo img {
    height: 100%;
    width: auto;
}

/* History view styles */
.history-view {
    display: flex;
    height: 40vh;
    width: 100%;
}

.history-sidebar {
    width: 240px;
    border-right: 1px solid rgba(${FG_RGB}, 0.1);
    max-height: 40vh;
    overflow-y: auto;
    padding: 12px;
    padding-top: 20px;
    background: rgba(${BG_RGB}, 0.3);
}

.history-sidebar::-webkit-scrollbar {
    width: 6px;
}

.history-sidebar::-webkit-scrollbar-track {
    background: transparent;
}

.history-sidebar::-webkit-scrollbar-thumb {
    background: rgba(${FG_RGB}, 0.2);
    border-radius: 3px;
}

.history-item {
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(${FG_RGB}, 0.05);
}

.history-item:hover {
    background: rgba(${FG_RGB}, 0.1);
}

.history-item.active {
    background: rgba(${PRIMARY_COLOR_RGB}, 0.25);
}

.history-item-title {
    font-size: 13px;
    font-weight: 500;
    color: rgba(${FG_RGB}, 0.9);
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.history-item-date {
    font-size: 11px;
    color: rgba(${FG_RGB}, 0.5);
}

.history-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.history-no-items {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba(${FG_RGB}, 0.5);
    font-size: 14px;
}

.history-content {
    display: flex;
    flex-direction: column;
    max-height: 40vh;
    overflow: auto;
    padding: 20px;
}

.history-content::scrollbar {
    display: none;
}
`;

export const notificationCSS = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(${BG_RGB}, 0.9);
    backdrop-filter: blur(10px);
    color: rgba(${FG_RGB}, 1);
    padding: 12px 20px;
    border-radius: 50px;
    z-index: 10002;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    opacity: 0;
    filter: blur(20px);
    transition: opacity 0.3s ease-out, filter 0.3s ease-out;
`;
