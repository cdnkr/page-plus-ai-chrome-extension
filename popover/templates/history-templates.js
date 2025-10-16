export function getHistoryViewHTML({
    sidebarHTML,
    mainHTML
}) {
    return `
<div class="history-view">
    <div class="history-sidebar" id="history-sidebar">
        ${sidebarHTML}
    </div>
    <div class="history-main">
        ${mainHTML}
    </div>
</div>`;
}

export function getHistoryItemHTML({
    sessionId,
    title,
    date,
    isActive
}) {
    return `
<div class="history-item ${isActive ? 'active' : ''}" data-session-id="${sessionId}">
    <div class="history-item-title">${title}</div>
    <div class="history-item-date">${date}</div>
</div>`;
}

export function getHistoryNoItemsHTML() {
    return `<div class="history-no-items">No history yet</div>`;
}
