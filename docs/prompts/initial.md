I want you to create the following Google Chrome Extension that uses Googles new in browser offline based AI API's. Namely the Prompt API, the Summarizer API and the Writer API. The idea is to select text on the page and have a 3 small circle buttons appear exactly at the position where your pointer moused up. Clicking each of these buttons will have its own functionality.

- Clicking "Prompt" will open a input and submit based popover on that button where users can ask questions based on the selected content. This uses Googles Prompt API which streams the response and displays it in the popover above the input.
- Clicking Summarize will also use a popover but this will immediately summarize the content and stream the response to the popover but with no input.
- Clicking Write will open a input and submit based popover on that button where users can ask questions based on the selected content. The main difference is that this text is mainly for written posts. This response will also be streamed and displayed on the popover above the input.

## General
- On all responses there will be a "Share" and "Copy" button.

## Styling
- Minimal styling approach. Icons > Labels
- Large Border radiuses: 20px-25px, 50% for curcular buttons.
- Light theme. 
- All Buttons are ghost style rounded full icons only.
- The main submit button and 3 action buttons (that trigger the popover) must use this primary colr as background: #3b82f6

## Icons
Copy: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>

Close: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>

Prompt: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-icon lucide-message-circle"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>

Summarize: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-text-icon lucide-book-text"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/></svg>

Write: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-line-icon lucide-pencil-line"><path d="M13 21h8"/><path d="m15 5 4 4"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>

Enter/submit button: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-down-left-icon lucide-corner-down-left"><path d="M20 4v7a4 4 0 0 1-4 4H4"/><path d="m9 10-5 5 5 5"/></svg>

## How it works

1. User selects text on page
2. The text selected is added to extension storage (we need this persisted for possible future additions)
3. After selection 3 circle buttons are displayed where the mouse lifted off (shown in a row for now transparent container bg):
    1. Prompt
    2. Summarize
    3. Write
4. You can then query the selection, summarize the selection or write about the selection
5. If prompt/write then open a prompt window to ask about selection and stream back response
6. If summarize then proceed with summary and show in the prompt window without the prompt input
7. On result text have copy and share icons

## Utility functions

### Parsing the MD response to HTML

```javascript
function parseMarkdownToHTML(markdown) {
    let html = markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^\*\*(.*?)\*\*:/gm, "<h3>$1:</h3>");

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
```