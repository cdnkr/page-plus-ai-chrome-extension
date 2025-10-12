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

            // Use mouse position with boundary checking (same as action buttons)
            const safePosition = this.calculateSafePosition(this.position, { width: 400, height: 300 });
            const absolutePosition = this.calculateAbsolutePosition(safePosition);

            this.popoverElement.style.cssText = `
      position: absolute;
      left: ${absolutePosition.x}px;
      top: ${absolutePosition.y}px;
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

        .close-btn, .close-btn svg, .close-btn path {
          cursor: pointer !important;
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
            <div class="context-text" id="context-text">
              ${this.selectionType === 'dragbox' 
                ? `<div style="margin-bottom: 12px;">
                     <img src="${this.selectedText}" style="width: 100%; height: auto; border-radius: 8px; border: 1px solid rgba(0, 0, 0, 0.1);" alt="Selected area screenshot" />
                   </div>`
                : (this.selectedText?.length > 100 ? this.selectedText?.slice(0, 100) + '...' : this.selectedText)
              }
            </div>
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
        this.selectedTextContext = this.shadowRoot.querySelector('#selected-text-context');
        this.content = this.shadowRoot.querySelector('.content');

        // Ensure context text is populated immediately
        if (this.contextText) {
            if (this.selectionType === 'dragbox') {
                this.contextText.innerHTML = `<div style="margin-bottom: 12px;">
                  <img src="${this.selectedText}" style="width: 100%; height: auto; border-radius: 8px; border: 1px solid rgba(0, 0, 0, 0.1);" alt="Selected area screenshot" />
                </div>`;
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

        // Setup for the specific action
        this.setupForAction();
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

        switch (this.action) {
            case 'prompt':
                if (this.selectionType === 'dragbox') {
                    this.headerTitle.innerHTML = '<span>Image</span><span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></span><span>Ask</span>';
                    this.userInput.placeholder = 'Ask a question about the selected image...';
                } else {
                    this.headerTitle.innerHTML = '<span>Text</span><span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></span><span>Ask</span>';
                    this.userInput.placeholder = 'Ask a question about the selected text...';
                }
                this.inputSection.classList.remove('hidden');
                break;
            case 'summarize':
                this.headerTitle.innerHTML = '<span>Text</span><span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></span><span>Summarize</span>';
                this.inputSection.classList.add('hidden');
                this.startSummarization();
                break;
            case 'write':
                if (this.selectionType === 'dragbox') {
                    this.headerTitle.innerHTML = '<span>Image</span><span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></span><span>Write</span>';
                    this.userInput.placeholder = 'What would you like to write about the selected image?';
                } else {
                    this.headerTitle.innerHTML = '<span>Text</span><span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></span><span>Write</span>';
                    this.userInput.placeholder = 'What would you like to write about the selected text?';
                }
                this.inputSection.classList.remove('hidden');
                break;
            case 'colors':
                this.headerTitle.innerHTML = '<span>Image</span><span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-right-icon lucide-move-right"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg></span><span>Colors</span>';
                this.inputSection.classList.add('hidden');
                this.startColorAnalysis();
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
                if (this.selectionType === 'dragbox') {
                    // Create session with image input support
                    this.session = await LanguageModel.create({
                        expectedInputs: [{ type: 'image' }]
                    });
                } else {
                    // Create regular session for text
                    this.session = await LanguageModel.create();
                }
            }

            // Show loading
            this.showLoading();

            let stream;
            if (this.selectionType === 'dragbox') {
                // For drag box, send image with text prompt
                const imageFile = await this.dataURLtoFile(this.selectedText, 'screenshot.png');
                stream = this.session.promptStreaming([
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                value: userInput
                            },
                            {
                                type: 'image',
                                value: imageFile
                            }
                        ]
                    }
                ]);
            } else {
                // For text selection, use text prompt
                const prompt = `Based on this selected text: "${this.selectedText}"\n\nUser question: ${userInput}`;
                stream = this.session.promptStreaming(prompt);
            }

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

            // Create writing prompt with context based on selection type
            let prompt;
            if (this.selectionType === 'dragbox') {
                // For drag box, we have an image
                prompt = `Based on this selected image, write about: ${userInput}`;
            } else {
                // For text selection
                prompt = `Based on this selected text: "${this.selectedText}"\n\nWrite about: ${userInput}`;
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
        const colorsHtml = colors.map((color, index) => `
            <div class="color-item" style="display: flex; flex-direction: column; padding: 12px; background: rgba(0, 0, 0, 0.05); border-radius: 8px; position: relative;">
                <div class="color-swatch" style="width: 100%; height: 60px; border-radius: 8px; background: ${color.rgb}; margin-bottom: 8px; border: 1px solid rgba(0, 0, 0, 0.1);"></div>
                <div class="color-info" style="flex: 1;">
                    <div class="color-hex" style="font-family: monospace; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 2px;">${color.hex}</div>
                    <div class="color-rgb" style="font-family: monospace; font-size: 10px; color: #6b7280;">${color.rgb}</div>
                </div>
                <button class="copy-color-btn" data-color="${color.hex}" style="position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 6px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; opacity: 0.7;" onmouseover="this.style.opacity='1'; this.style.background='rgba(255, 255, 255, 1)'" onmouseout="this.style.opacity='0.7'; this.style.background='rgba(255, 255, 255, 0.9)'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                </button>
            </div>
        `).join('');

        this.currentResponse = `
            <div class="colors-container">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                    ${colorsHtml}
                </div>
            </div>
        `;

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
        // Don't show action buttons for colors action
        if (this.action !== 'colors') {
            this.actionButtons.style.display = 'flex';
        }
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
            const absolutePosition = this.calculateAbsolutePosition(safePosition);
            this.popoverElement.style.left = `${absolutePosition.x}px`;
            this.popoverElement.style.top = `${absolutePosition.y}px`;
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