// Popover script for handling AI interactions
export class PopoverAI {
  constructor(action, selectedText, position, selectionRange) {
    try {
      console.log('PopoverAI constructor called with:', { action, selectedText: selectedText.substring(0, 50) + '...', position });
      this.action = action;
      this.selectedText = selectedText;
      this.position = position;
      this.selectionRange = selectionRange;
      this.session = null;
      this.summarizer = null;
      this.writer = null;
      this.currentResponse = '';
      this.popoverElement = null;
      
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
      // Create popover container
      this.popoverElement = document.createElement('div');
      this.popoverElement.className = 'selection-ai-popover';
    // Get current position from selection range
    const currentPosition = this.getSelectionPosition();
    
    this.popoverElement.style.cssText = `
      position: fixed;
      left: ${currentPosition.x}px;
      top: ${currentPosition.y}px;
    `;

    // Add CSS styles
    if (!document.getElementById('popover-styles')) {
      const style = document.createElement('style');
      style.id = 'popover-styles';
      style.textContent = `
        .selection-ai-popover *:not(svg > *) {
            all: unset !important;
            box-sizing: border-box !important;
        }

        .selection-ai-popover {
          isolation: isolate !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          background: rgba(255, 255, 255, 1) !important;
          backdrop-filter: blur(10px) !important;
          border-radius: 30px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
          overflow: hidden !important;
          opacity: 0 !important;
          filter: blur(20px) !important;
          transition: opacity 0.3s ease-out, filter 0.3s ease-out !important;
          width: 400px !important;
          border: none !important;
          z-index: 10001 !important;
        }
        
        .selection-ai-popover.visible {
          opacity: 1 !important;
          filter: blur(0px) !important;
        }
        
        .selection-ai-popover .header {
          padding: 18px 20px 0 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          position: relative !important;
        }

        .selection-ai-popover .header::after {
            content: '' !important;
            position: absolute !important;
            top: 50px !important;
            left: 0 !important;
            right: 0 !important;
            height: 40px !important;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, transparent 100%) !important;
            pointer-events: none !important;
            z-index: 1 !important;
        }

        .selection-ai-popover .header-title {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            font-size: 16px !important;
            color: #1f2937 !important;
            margin: 0 !important;
        }
        
        .selection-ai-popover .close-btn {
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          border: none !important;
          color: black !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.2s ease !important;
        }
        
        .selection-ai-popover .close-btn:hover {
          background: rgba(0, 0, 0, 0.1) !important;
        }
        
        .selection-ai-popover .content {
          display: flex !important;
          flex-direction: column !important;
          padding: 20px !important;
          max-height: 89vh !important;
          overflow: auto !important;
        }
        
        .selection-ai-popover .input-section {
          padding: 16px 12px 12px 18px !important;
          background: rgba(0, 0, 0, 0.1) !important;
          border-radius: 30px !important;
          box-sizing: border-box !important;
        }

        .selection-ai-popover .input-section-footer {
          display: flex !important;
          justify-content: flex-end !important;
          margin-top: 6px !important;
        }
        
        .selection-ai-popover .input-section.hidden {
          display: none !important;
        }
        
        .selection-ai-popover .input-label {
          display: block !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #374151 !important;
          margin-bottom: 8px !important;
        }
        
        .input-field {
          width: 100% !important;
          font-size: 14px !important;
          resize: none !important;
          outline: none !important;
          box-sizing: border-box !important;
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }

        .input-field::placeholder {
          color: rgba(0, 0, 0, 0.7) !important;
        }
        
        .selection-ai-popover .submit-btn {
          width: 44px !important;
          height: 44px !important;
          padding: 8px !important;
          background: #3b82f6 !important;
          color: white !important;
          border: none !important;
          border-radius: 50% !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          transition: all 0.2s ease !important;
          margin-top: 12px !important;
        }

        .selection-ai-popover .submit-btn:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.2) !important;
          transform: translateY(-1px) !important;
        }
        
        .selection-ai-popover .submit-btn:disabled {
          background: rgba(0, 0, 0, 0.1) !important;
          cursor: not-allowed !important;
          transform: none !important;
        }
        
        .selection-ai-popover .response-section {
          flex-direction: column !important;
          margin-bottom: 20px !important;
        }
        
        .selection-ai-popover .selected-text-context {
          font-size: 13px !important;
          margin-bottom: 12px !important;
        }
        
        .selection-ai-popover .context-text {
            overflow-y: auto !important;
            padding: 4px 0 !important;
            display: inline !important;
            font-style: italic !important;
        }
        
        .selection-ai-popover .response-content {
          padding: 0 !important;
          border-radius: 12px !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          color: #374151 !important;
        }
        
        .selection-ai-popover .response-content h1, 
        .selection-ai-popover .response-content h2, 
        .selection-ai-popover .response-content h3 {
          color: #1f2937 !important;
          margin: 16px 0 8px 0 !important;
        }
        
        .selection-ai-popover .response-content h1:first-child,
        .selection-ai-popover .response-content h2:first-child,
        .selection-ai-popover .response-content h3:first-child {
          margin-top: 0 !important;
        }
        
        .selection-ai-popover .response-content p {
          margin: 8px 0 !important;
        }
        
        .selection-ai-popover .response-content ul, 
        .selection-ai-popover .response-content ol {
          margin: 8px 0 !important;
          padding-left: 20px !important;
        }
        
        .selection-ai-popover .response-content li {
          margin: 4px 0 !important;
        }
        
        .selection-ai-popover .response-content blockquote {
          border-left: 4px solid #3b82f6 !important;
          padding-left: 16px !important;
          margin: 16px 0 !important;
          color: #6b7280 !important;
          font-style: italic !important;
        }
        
        .selection-ai-popover .response-content table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 16px 0 !important;
        }
        
        .selection-ai-popover .response-content th,
        .selection-ai-popover .response-content td {
          border: 1px solid #d1d5db !important;
          padding: 8px 12px !important;
          text-align: left !important;
        }
        
        .selection-ai-popover .response-content th {
          background: #f3f4f6 !important;
          font-weight: 600 !important;
        }
        
        .selection-ai-popover .response-content a {
          color: #3b82f6 !important;
          text-decoration: none !important;
        }
        
        .selection-ai-popover .response-content a:hover {
          text-decoration: underline !important;
        }
        
        .selection-ai-popover .response-content strong {
          font-weight: 600 !important;
        }
        
        .selection-ai-popover .response-content em {
          font-style: italic !important;
        }
        
        .selection-ai-popover .ctx__loading {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 40px !important;
          color: #6b7280 !important;
        }
        
        .selection-ai-popover .ctx__loading-spinner {
          width: 20px !important;
          height: 20px !important;
          border: 2px solid #e5e7eb !important;
          border-top: 2px solid #3b82f6 !important;
          border-radius: 50% !important;
          animation: spin 1s linear infinite !important;
          margin-right: 12px !important;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg) !important; }
          100% { transform: rotate(360deg) !important; }
        }
        
        .selection-ai-popover .action-buttons {
          display: flex !important;
          gap: 2px !important;
        }
        
        .selection-ai-popover .action-btn {
          padding: 10px !important;
          border-radius: 50% !important;
          color: #374151 !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          transition: all 0.2s ease !important;
        }
        
        .selection-ai-popover .action-btn:hover {
          background: rgba(0, 0, 0, 0.1) !important;
        }
        
        .selection-ai-popover .action-btn.primary {
          background: #3b82f6 !important;
          color: white !important;
          border-color: #3b82f6 !important;
        }
        
        .selection-ai-popover .action-btn.primary:hover {
          background: #2563eb !important;
          border-color: #2563eb !important;
        }
        
        .selection-ai-popover .hidden {
          display: none !important;
        }

        .ctx__flex {
          display: flex !important;
        }

        .ctx__hidden {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Create popover HTML structure
    this.popoverElement.innerHTML = `
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
          <div class="context-text" id="context-text">${this.selectedText?.length > 100 ? this.selectedText?.slice(0, 100) + '...' : this.selectedText}</div>
        </div>
        
        <div class="response-section ctx__hidden" id="response-section">
          <div class="response-content" id="response-content">
            <div class="ctx__loading">
              <div class="ctx__loading-spinner"></div>
              Processing your request...
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

        <div class="input-section" id="input-section">
          <textarea 
            class="input-field" 
            id="user-input" 
            placeholder="Enter your question or request..."
            rows="3"
          ></textarea>

          <div class="input-section-footer">
            <button class="submit-btn" id="submit-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
                <path d="m9 10-5 5 5 5"/>
                </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(this.popoverElement);

    // Stop propagation for all clicks inside the popover
    this.popoverElement.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Trigger fade in animation
    requestAnimationFrame(() => {
      this.popoverElement.classList.add('visible');
      console.log('Visible class added to popover');
    });
    
    console.log('Popover element created and added to DOM');
    } catch (error) {
      console.error('Error in createPopover:', error);
      throw error;
    }
  }

  init() {
    // Get DOM elements from popover
    this.headerTitle = this.popoverElement.querySelector('#header-title');
    this.inputSection = this.popoverElement.querySelector('#input-section');
    this.responseSection = this.popoverElement.querySelector('#response-section');
    this.userInput = this.popoverElement.querySelector('#user-input');
    this.submitBtn = this.popoverElement.querySelector('#submit-btn');
    this.responseContent = this.popoverElement.querySelector('#response-content');
    this.actionButtons = this.popoverElement.querySelector('#action-buttons');
    this.copyBtn = this.popoverElement.querySelector('#copy-btn');
    this.shareBtn = this.popoverElement.querySelector('#share-btn');
    this.closeBtn = this.popoverElement.querySelector('#close-btn');
    this.contextText = this.popoverElement.querySelector('#context-text');
    
    // Ensure context text is populated immediately
    if (this.contextText) {
      this.contextText.textContent = this.selectedText.length > 100 ? this.selectedText.slice(0, 100) + '...' : this.selectedText;
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

    // Setup for the specific action
    this.setupForAction();
  }

  setupForAction() {
    switch (this.action) {
      case 'prompt':
        this.headerTitle.innerHTML = '<span>CTX</span><span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></span><span>Ask</span>';
        this.userInput.placeholder = 'Ask a question about the selected text...';
        this.inputSection.classList.remove('hidden');
        break;
      case 'summarize':
        this.headerTitle.innerHTML = '<span>CTX</span><span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></span><span>Summarize</span>';
        this.inputSection.classList.add('hidden');
        this.startSummarization();
        break;
      case 'write':
        this.headerTitle.innerHTML = '<span>CTX</span><span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></span><span>Write</span>';
        this.userInput.placeholder = 'What would you like to write about the selected text?';
        this.inputSection.classList.remove('hidden');
        break;
    }
  }

  async handleSubmit() {
    const userInput = this.userInput.value.trim();
    if (!userInput) return;

    this.submitBtn.disabled = true;
    this.submitBtn.textContent = 'Processing...';
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
      this.submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
          <path d="m9 10-5 5 5 5"/>
        </svg>
      `;
    }
  }

  async handlePrompt(userInput) {
    try {
      // Check if Prompt API is available
      if (!('LanguageModel' in self)) {
        throw new Error('Prompt API not available');
      }

      // Check availability
      const availability = await LanguageModel.availability();
      if (availability === 'unavailable') {
        throw new Error('Language model not available');
      }

      // Create session if not exists
      if (!this.session) {
        this.session = await LanguageModel.create();
      }

      // Create prompt with context
      const prompt = `Based on this selected text: "${this.selectedText}"\n\nUser question: ${userInput}`;

      // Show loading
      this.showLoading();

      // Get streaming response
      const stream = this.session.promptStreaming(prompt);
      
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

  async handleWrite(userInput) {
    try {
      // Check if Writer API is available
      if (!('Writer' in self)) {
        throw new Error('Writer API not available');
      }

      // Check availability
      const availability = await Writer.availability();
      if (availability === 'unavailable') {
        throw new Error('Writer not available');
      }

      // Create writer if not exists
      if (!this.writer) {
        this.writer = await Writer.create({
          tone: 'neutral',
          format: 'markdown',
          length: 'medium'
        });
      }

      // Create writing prompt with context
      const prompt = `Based on this selected text: "${this.selectedText}"\n\nWrite about: ${userInput}`;

      // Show loading
      this.showLoading();

      // Get streaming response
      const stream = this.writer.writeStreaming(prompt);
      
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

  async startSummarization() {
    try {
      // Check if Summarizer API is available
      if (!('Summarizer' in self)) {
        throw new Error('Summarizer API not available');
      }

      // Check availability
      const availability = await Summarizer.availability();
      if (availability === 'unavailable') {
        throw new Error('Summarizer not available');
      }

      // Create summarizer if not exists
      if (!this.summarizer) {
        this.summarizer = await Summarizer.create({
          type: 'key-points',
          format: 'markdown',
          length: 'medium'
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

  updateResponse(text) {
    const html = this.parseMarkdownToHTML(text);
    this.responseContent.innerHTML = html;
  }

  showLoading() {
    // Show the response section
    this.responseSection.classList.remove('ctx__hidden');
    this.responseSection.classList.add('ctx__flex');
    
    this.responseContent.innerHTML = `
      <div class="ctx__loading">
        <div class="ctx__loading-spinner"></div>
        Processing your request...
      </div>
    `;
  }

  showError(message) {
    // Show the response section
    this.responseSection.classList.remove('ctx__hidden');
    this.responseSection.classList.add('ctx__flex');
    
    this.responseContent.innerHTML = `
      <div style="color: #dc2626; text-align: center; padding: 20px;">
        ${message}
      </div>
    `;
  }

  showActionButtons() {
    this.actionButtons.style.display = 'flex';
  }

  parseMarkdownToHTML(markdown) {
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
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10002;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Get position from selection range (anchored to text)
  getSelectionPosition() {
    if (!this.selectionRange) {
      return this.position || { x: 0, y: 0 };
    }
    
    try {
      const rect = this.selectionRange.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      // Calculate smart positioning
      const popoverWidth = 400; // Fixed width from CSS
      const popoverHeight = 300; // Estimated height
      const margin = 20; // Margin from viewport edges
      
      // Horizontal positioning - center on selection but keep within viewport
      let x = rect.left + (rect.width / 2) - (popoverWidth / 2);
      x = Math.max(margin, Math.min(x, viewport.width - popoverWidth - margin));
      
      // Vertical positioning - smart placement based on available space
      let y;
      const spaceBelow = viewport.height - rect.bottom - margin;
      const spaceAbove = rect.top - margin;
      
      // If there's more space below and it's sufficient, place below
      if (spaceBelow >= popoverHeight || spaceBelow > spaceAbove) {
        y = rect.bottom + 10;
      } else {
        // Place above the selection
        y = rect.top - popoverHeight - 10;
      }
      
      // Ensure popover doesn't go above viewport
      y = Math.max(margin, y);
      
      return { x, y };
    } catch (error) {
      console.warn('Could not get selection position:', error);
      return this.position || { x: 0, y: 0 };
    }
  }

  // Update popover position
  updatePosition() {
    if (this.popoverElement) {
      const position = this.getSelectionPosition();
      this.popoverElement.style.left = `${position.x}px`;
      this.popoverElement.style.top = `${position.y}px`;
    }
  }

  close() {
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
}
