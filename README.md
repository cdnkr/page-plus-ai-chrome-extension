# Selection AI Chrome Extension

A Chrome extension that uses Google's new in-browser AI APIs (Prompt, Summarizer, and Writer) to provide AI-powered text analysis and generation directly in your browser.

## Features

- **Text Selection**: Select any text on a webpage to trigger AI functionality
- **Three AI Modes**:
  - **Prompt**: Ask questions about selected text using Google's Prompt API
  - **Summarize**: Generate summaries using Google's Summarizer API
  - **Write**: Create new content based on selected text using Google's Writer API
- **Streaming Responses**: Real-time streaming of AI responses
- **Copy & Share**: Easy copying and sharing of AI-generated content
- **Modern UI**: Clean, minimal design with smooth animations

## Requirements

### Browser Requirements
- Chrome 138+ (stable) for Summarizer API
- Chrome 137-142 for Writer API (origin trial)
- Chrome with Prompt API support

### Hardware Requirements
- **Operating System**: Windows 10/11, macOS 13+, Linux, or ChromeOS (Platform 16389.0.0+)
- **Storage**: At least 22 GB of free space
- **GPU**: More than 4 GB of VRAM (for GPU inference)
- **CPU**: 16 GB RAM + 4 CPU cores (for CPU inference)
- **Network**: Unlimited data connection

## Installation

### For Development
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select this directory
5. The extension will be loaded and ready to use

### For Production
1. Package the extension as a .zip file
2. Submit to Chrome Web Store (when APIs are stable)

## Usage

1. **Select Text**: Highlight any text on a webpage
2. **Choose Action**: Three circular buttons will appear:
   - 💬 **Prompt**: Ask questions about the text
   - 📖 **Summarize**: Generate a summary
   - ✏️ **Write**: Create new content based on the text
3. **Interact**: Use the popover interface to interact with AI
4. **Copy/Share**: Use the action buttons to copy or share results

## API Integration

### Prompt API
- Uses `LanguageModel.create()` for session management
- Supports streaming responses with `promptStreaming()`
- Context-aware conversations

### Summarizer API
- Uses `Summarizer.create()` with configurable options
- Supports different summary types: key-points, tldr, teaser, headline
- Streaming summarization with `summarizeStreaming()`

### Writer API
- Uses `Writer.create()` with tone and format options
- Supports streaming content generation
- Context-aware writing assistance

## Development

### File Structure
```
├── manifest.json          # Extension manifest
├── content.js            # Content script for text selection
├── popover.html          # Popover interface
├── popover.js           # Popover logic and AI integration
├── styles.css           # Extension styles
└── README.md            # This file
```

### Key Components

#### Content Script (`content.js`)
- Handles text selection detection
- Manages button overlay positioning
- Coordinates with popover iframe

#### Popover (`popover.html` + `popover.js`)
- AI interaction interface
- Streaming response handling
- Markdown parsing and rendering

#### Styling (`styles.css`)
- Minimal, modern design
- Responsive layout
- Accessibility features

## Browser Compatibility

This extension requires Chrome with support for:
- Google's Prompt API
- Google's Summarizer API  
- Google's Writer API
- Modern JavaScript features (async/await, ReadableStream)

## Privacy & Security

- All AI processing happens locally in the browser
- No data is sent to external servers
- Selected text is stored locally in extension storage
- Follows Google's Generative AI Prohibited Uses Policy

## Troubleshooting

### Common Issues

1. **APIs not available**: Ensure you're using a supported Chrome version
2. **Model download required**: First use may require downloading Gemini Nano model
3. **Hardware requirements**: Check that your system meets the minimum requirements
4. **Network issues**: Ensure you have an unmetered connection

### Debug Mode
Enable Chrome DevTools to see console logs and debug information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Chrome team for the AI APIs
- Lucide for the beautiful icons
- The open-source community for inspiration
