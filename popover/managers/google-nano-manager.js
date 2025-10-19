/**
 * GoogleNanoManager - Manages AI API interactions with Google Nano API's
 * Handles Prompt API, Writer API, and Summarizer API
 */

export class GoogleNanoManager {
    constructor(popover) {
        this.popover = popover;
        
        // AI API sessions
        this.session = null;
        this.writer = null;
        this.summarizer = null;
    }

    // ==================== Prompt API Handler ====================

    async handlePrompt(userInput) {
        try {
            // Load preferred language and normalize to base code (e.g., en-US -> en)
            // Cache locale on window for reuse; coerce to supported base language
            try {
                const { selection_ai_locale } = await chrome.storage.local.get(['selection_ai_locale']);
                if (selection_ai_locale) window.__selection_ai_cached_locale = selection_ai_locale;
            } catch (_) { }
            const baseLang = this.popover.getPreferredBaseLanguage();

            // Build Prompt API options with languages per docs
            const promptOptions = this.popover.selectionType === 'dragbox'
                ? {
                    initialPrompts: [
                        { role: 'system', content: `You are website content analyzer on the website: ${window.location.host}. You are given a screenshot from the web page: ${window.location.host}/${window.location.pathname} and a user question. Understand the users question and provide a clear answer. Response must be in html format.` },
                    ],
                    expectedInputs: [
                        { type: 'image' },
                        { type: 'text', languages: [baseLang] }
                    ],
                    expectedOutputs: [
                        { type: 'text', languages: [baseLang] }
                    ]
                }
                : this.popover.selectionType === 'page'
                ? {
                    initialPrompts: [
                        { role: 'system', content: `You are website content analyzer on the website: ${window.location.host}. You are given a full page screenshot and page content from the web page: ${window.location.host}/${window.location.pathname} and a user question. Understand the users question and provide a clear answer. Response must be in html format.` },
                    ],
                    expectedInputs: [
                        { type: 'image' },
                        { type: 'text', languages: [baseLang] }
                    ],
                    expectedOutputs: [
                        { type: 'text', languages: [baseLang] }
                    ]
                }
                : {
                    initialPrompts: [
                        { role: 'system', content: `You are website content analyzer on the website: ${window.location.host}. You are given selected text from the web page: ${window.location.host}/${window.location.pathname} and a user question. Understand the users question and provide a clear answer. Response must be in html format.` },
                    ],
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
            this.popover.showLoading();

            // Dispatch streaming start event
            window.dispatchEvent(new CustomEvent('aiStreamingStart'));

            // Get conversation history context
            const historyContext = this.popover.conversationManager.getHistoryContext();

            let stream;
            if (this.popover.selectionType === 'dragbox' && !this.popover.isHistoryMode) {
                // For drag box, send image with text prompt and history
                const imageFile = await this.dataURLtoFile(this.popover.selectedText, 'screenshot.png');
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
            } else if (this.popover.selectionType === 'page' && !this.popover.isHistoryMode) {
                // For page mode, capture full page screenshot and send with page content
                console.log('Capturing full page screenshot for page prompt...');
                const pageScreenshot = await this.captureFullPageScreenshot();
                if (pageScreenshot) {
                    console.log('Full page screenshot captured successfully');
                    const imageFile = await this.dataURLtoFile(pageScreenshot, 'page-screenshot.png');
                    console.log('Page screenshot file created:', imageFile.name, imageFile.size, 'bytes');
                    console.log('Screenshot data URL (first 100 chars):', pageScreenshot.substring(0, 100) + '...');
                    
                    // Create a temporary image element to display the screenshot
                    const tempImg = document.createElement('img');
                    tempImg.src = pageScreenshot;
                    tempImg.style.cssText = 'position: fixed; top: 10px; right: 10px; max-width: 300px; max-height: 200px; border: 2px solid red; z-index: 9999; background: white;';
                    tempImg.title = 'Page Screenshot Preview';
                    document.body.appendChild(tempImg);
                    
                    // Remove the preview after 5 seconds
                    setTimeout(() => {
                        if (tempImg.parentNode) {
                            tempImg.parentNode.removeChild(tempImg);
                        }
                    }, 5000);
                    const fullPrompt = `${historyContext}Page content: ${this.popover.selectedText}\n\nUser question: ${userInput}`;

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
                    console.log('Screenshot capture failed, falling back to text-only mode');
                    // Fallback to text-only if screenshot capture fails
                    const prompt = `${historyContext}Page content: ${this.popover.selectedText}\n\nUser question: ${userInput}`;
                    stream = this.session.promptStreaming(prompt);
                }
            } else {
                // For text selection or history mode, use text prompt with history
                let prompt;
                if (this.popover.isHistoryMode || !this.popover.selectedText) {
                    // In history mode or no selection, just use history context and user question
                    prompt = `${historyContext}${userInput}`;
                } else {
                    // With selection, include it in the context
                    const baseContext = `Based on this selected text: "${this.popover.selectedText}"`;
                    prompt = `${baseContext}\n\n${historyContext}User question: ${userInput}`;
                }
                stream = this.session.promptStreaming(prompt);
            }

            this.popover.currentResponse = '';
            for await (const chunk of stream) {
                this.popover.currentResponse += chunk;
                this.popover.updateResponse(this.popover.currentResponse);
            }

            // Dispatch streaming end event
            window.dispatchEvent(new CustomEvent('aiStreamingEnd'));

            // Finalize the AI message in conversation history
            this.popover.conversationManager.finalizeAiMessage();

            this.popover.showActionButtons();
        } catch (error) {
            // Dispatch streaming end event on error
            window.dispatchEvent(new CustomEvent('aiStreamingEnd'));
            this.popover.showError(error.message);
        }
    }

    // ==================== Writer API Handler ====================

    async handleWrite(userInput) {
        try {
            // Load preferred language and normalize to base code
            try {
                const { selection_ai_locale } = await chrome.storage.local.get(['selection_ai_locale']);
                if (selection_ai_locale) window.__selection_ai_cached_locale = selection_ai_locale;
            } catch (_) { }
            const baseLang = this.popover.getPreferredBaseLanguage();

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

            // Dispatch streaming start event
            window.dispatchEvent(new CustomEvent('aiStreamingStart'));

            // Get conversation history context
            const historyContext = this.popover.conversationManager.getHistoryContext();

            // Create writing prompt with context based on selection type
            let prompt;
            if (this.popover.isHistoryMode || !this.popover.selectedText) {
                // In history mode or no selection, just use history context
                prompt = `${historyContext}Write about: ${userInput}`;
            } else if (this.popover.selectionType === 'dragbox') {
                // For drag box, we have an image
                prompt = `${historyContext}Based on this selected image, write about: ${userInput}`;
            } else {
                // For text selection
                prompt = `${historyContext}Based on this selected text: "${this.popover.selectedText}"\n\nWrite about: ${userInput}`;
            }

            // Show loading
            this.popover.showLoading();

            // Get streaming response
            const stream = this.writer.writeStreaming(prompt);

            this.popover.currentResponse = '';
            for await (const chunk of stream) {
                this.popover.currentResponse += chunk;
                this.popover.updateResponse(this.popover.currentResponse);
            }

            // Dispatch streaming end event
            window.dispatchEvent(new CustomEvent('aiStreamingEnd'));

            // Finalize the AI message in conversation history
            this.popover.conversationManager.finalizeAiMessage();

            this.popover.showActionButtons();
        } catch (error) {
            // Dispatch streaming end event on error
            window.dispatchEvent(new CustomEvent('aiStreamingEnd'));
            this.popover.showError(error.message);
        }
    }

    // ==================== Summarizer API Handler ====================

    async startSummarization() {
        try {
            // Load preferred language and normalize to base code
            try {
                const { selection_ai_locale } = await chrome.storage.local.get(['selection_ai_locale']);
                if (selection_ai_locale) window.__selection_ai_cached_locale = selection_ai_locale;
            } catch (_) { }
            const baseLang = this.popover.getPreferredBaseLanguage();

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
            this.popover.showLoading();

            // Dispatch streaming start event
            window.dispatchEvent(new CustomEvent('aiStreamingStart'));

            // Get streaming summary
            const stream = this.summarizer.summarizeStreaming(this.popover.selectedText);

            this.popover.currentResponse = '';
            for await (const chunk of stream) {
                this.popover.currentResponse += chunk;
                this.popover.updateResponse(this.popover.currentResponse);
            }

            // Dispatch streaming end event
            window.dispatchEvent(new CustomEvent('aiStreamingEnd'));

            this.popover.showActionButtons();
        } catch (error) {
            // Dispatch streaming end event on error
            window.dispatchEvent(new CustomEvent('aiStreamingEnd'));
            this.popover.showError(error.message);
        }
    }

    // ==================== Utility Methods ====================

    async dataURLtoFile(dataUrl, filename) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    }

    /**
     * Capture a full page screenshot using the Chrome extension API
     * @returns {Promise<string|null>} Data URL of the captured screenshot
     */
    async captureFullPageScreenshot() {
        try {
            console.log('Requesting full page screenshot from background script...');
            // Use Chrome extension API to capture the full visible tab
            const response = await new Promise((resolve) => {
                chrome.runtime.sendMessage(
                    { action: 'captureVisibleTab' },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            console.error('Screenshot capture failed:', chrome.runtime.lastError);
                            resolve(null);
                        } else if (response.error) {
                            console.error('Screenshot capture error:', response.error);
                            resolve(null);
                        } else {
                            console.log('Screenshot captured successfully, data URL length:', response.dataUrl?.length || 0);
                            resolve(response.dataUrl);
                        }
                    }
                );
            });

            return response;
        } catch (error) {
            console.error('Failed to capture full page screenshot:', error);
            return null;
        }
    }
}

