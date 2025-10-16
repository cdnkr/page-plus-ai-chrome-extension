export function parseMarkdownToHTML(markdown) {
    // Store code blocks to prevent them from being processed
    const codeBlocks = [];
    const codeBlockPlaceholder = '___CODEBLOCK_';
    
    // Extract and store code blocks first (triple backticks)
    markdown = markdown.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, language, code) => {
        const placeholder = `${codeBlockPlaceholder}${codeBlocks.length}___`;
        const escapedCode = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        const langClass = language ? ` class="language-${language}"` : '';
        codeBlocks.push(`<pre><code${langClass}>${escapedCode}</code></pre>`);
        return placeholder;
    });

    // Store inline code to prevent it from being processed
    const inlineCodes = [];
    const inlineCodePlaceholder = '___INLINECODE_';
    
    markdown = markdown.replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `${inlineCodePlaceholder}${inlineCodes.length}___`;
        const escapedCode = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        inlineCodes.push(`<code>${escapedCode}</code>`);
        return placeholder;
    });

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
            if (/^<\/?(h\d|ul|li|blockquote|table|pre)/.test(block.trim())) return block;
            if (block.includes(codeBlockPlaceholder)) return block; // Don't wrap code blocks in paragraphs
            return `<p>${block.trim().replace(/\n/g, "<br>")}</p>`;
        })
        .join("\n");

    // Restore code blocks
    html = html.replace(new RegExp(`${codeBlockPlaceholder}(\\d+)___`, 'g'), (match, index) => {
        return codeBlocks[parseInt(index)];
    });

    // Restore inline code
    html = html.replace(new RegExp(`${inlineCodePlaceholder}(\\d+)___`, 'g'), (match, index) => {
        return inlineCodes[parseInt(index)];
    });

    return html.trim();
}
