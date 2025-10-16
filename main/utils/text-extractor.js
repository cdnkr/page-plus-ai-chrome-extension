export function extractStructuredTextWithLinks(html) {
    const container = document.createElement('div');
    container.innerHTML = html;
    const origin = window.location.origin;
    function traverse(node) {
        const segments = [];
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text) segments.push({ type: 'text', content: text });
            return segments;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node;
            const tagName = el.tagName.toLowerCase();
            if (tagName === 'style' || tagName === 'script' || tagName === 'noscript' || tagName === 'meta' || tagName === 'link') {
                return segments;
            }
            if (tagName === 'a') {
                const hrefAttr = el.getAttribute('href') || '';
                const href = hrefAttr.startsWith('/') ? origin + hrefAttr : hrefAttr;
                const text = el.textContent?.trim() || '';
                segments.push({ type: 'link', text, href });
                return segments;
            }
            for (const child of Array.from(el.childNodes)) {
                segments.push(...traverse(child));
            }
        }
        return segments;
    }
    return traverse(container);
}

export function segmentsToMarkdown(segments) {
    const limit = 2000;
    // Simple joiner: links -> [text](href), text -> content; keep spacing
    const parts = [];
    for (const seg of segments) {
        if (seg.type === 'link') {
            if (seg.text) parts.push(`[${seg.text}](${seg.href})`);
            else parts.push(seg.href);
        } else if (seg.type === 'text') {
            parts.push(seg.content);
        }
    }
    const response = parts.join(' ').replace(/\s{2,}/g, ' ').trim();

    console.log('response length', response.length)

    // Collapse excessive whitespace while preserving basic sentence spacing
    return response.slice(0, limit);
}
