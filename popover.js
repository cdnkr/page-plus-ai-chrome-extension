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
      // Create popover container with Shadow DOM for style isolation
      this.popoverElement = document.createElement('div');
      this.popoverElement.className = 'selection-ai-popover';
      
      // Create shadow root for complete style isolation
      this.shadowRoot = this.popoverElement.attachShadow({ mode: 'open' });
      
    // Get current position from selection range
    const currentPosition = this.getSelectionPosition();
    
    this.popoverElement.style.cssText = `
      position: fixed;
      left: ${currentPosition.x}px;
      top: ${currentPosition.y}px;
    `;

    // Add CSS styles to shadow root for complete isolation
    const style = document.createElement('style');
    style.textContent = `
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
        }
        
        :host(.visible) {
          opacity: 1;
          filter: blur(0px);
        }
        
        .header {
          padding: 18px 20px 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
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
          color: black;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          background: white;
        }
        
        .close-btn:hover {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .content {
          display: flex;
          flex-direction: column;
          padding: 20px;
          max-height: 40vh;
          overflow: auto;
        }

        .input-section-wrapper {
            padding: 20px 20px 20px 20px;
            position: relative;
        }

        .input-section-wrapper::before {
            content: '';
            position: absolute;
            top: -40px;
            left: 0;
            right: 0;
            height: 40px;
            background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, transparent 100%);
            pointer-events: none;
            z-index: 1;
        }
        
        .input-section {
          padding: 16px 12px 12px 18px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 30px;
          box-sizing: border-box;
        }

        .input-section-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 6px;
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
          margin-top: 12px;
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
          margin-bottom: 12px;
        }
        
        .context-text {
            overflow-y: auto;
            padding: 4px 0;
            display: inline;
            font-style: italic;
            color: #374151;
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
          border-top: 2px solid rgb(135, 137, 138);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 12px;
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
        
        .hidden {
          display: none !important;
        }
      `;

    // Create popover HTML structure in shadow root
    this.shadowRoot.innerHTML = `
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
            <div class="context-text" id="context-text">${this.selectedText?.length > 100 ? this.selectedText?.slice(0, 100) + '...' : this.selectedText}</div>
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
                <button class="submit-btn" id="submit-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
                    <path d="m9 10-5 5 5 5"/>
                    </svg>
                </button>
                </div>
            </div>
          </div>
      </div>
    `;

    this.shadowRoot.appendChild(style);

    // Add to DOM
    document.body.appendChild(this.popoverElement);
    console.log('Popover element added to DOM:', this.popoverElement);

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

  init() {
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
    this.closeBtn = this.shadowRoot.querySelector('#close-btn');
    this.contextText = this.shadowRoot.querySelector('#context-text');
    this.content = this.shadowRoot.querySelector('.content');
    
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
    this.submitBtn.innerHTML = `
    <div class="loading">
        <div class="loading-spinner"></div>
    </div>
    `;
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
    
    // Use requestAnimationFrame to ensure DOM has updated before scrolling
    requestAnimationFrame(() => {
      this.content.scrollTo({
        top: this.content.scrollHeight - 50,
        behavior: 'smooth'
      });
    });
  }

  showLoading() {
    // Show the response section
    this.responseSection.style.display = 'flex';
    
    this.responseContent.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    `;
  }

  showError(message) {
    // Show the response section
    this.responseSection.style.display = 'flex';
    
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
