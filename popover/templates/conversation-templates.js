export function getConversationHistoryHTML({
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

export function getMessageActionButtonsHTML({
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

export function getMessageContentHTML({
    content,
}) {
    return `<div class="message-content">${content}</div>`;
}

export function getContextHTML({
    selectedText,
}) {
    return `<div style="margin-bottom: 12px;width: 100%;">
    <img src="${selectedText}" style="width: 100%; height: auto; border-radius: 20px;" alt="Selected area screenshot" />
</div>`;
}
