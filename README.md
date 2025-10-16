# Selection AI Chrome Extension

A Chrome extension that uses Google's new in-browser AI APIs (Prompt, Summarizer, and Writer) to provide AI-powered text and image analysis and generation directly in your browser.

## Features

### Selection Modes
- **Text Selection**: Select any text on a webpage to trigger AI functionality
- **Drag Box Selection**: Draw a selection box anywhere on the page to capture screenshots for analysis
- **Page Mode**: Query the entire current page content

### AI Capabilities
- **Prompt**: Ask questions about selected text, images, or entire pages using Google's Prompt API
- **Summarize**: Generate summaries using Google's Summarizer API
- **Write**: Create new content based on selected text using Google's Writer API
- **Color Analysis**: Extract the 6 most prominent colors from image selections

### Advanced Features
- **Conversation History**: Persistent chat history for each session
- **Voice Input**: Speech-to-text input using browser's speech recognition
- **Streaming Responses**: Real-time streaming of AI responses
- **Context Awareness**: Maintains conversation context across interactions

### User Experience
- **Modern UI**: Clean, minimal design with smooth animations
- **Drag & Drop**: Draggable popovers for better positioning
- **Copy & Share**: Easy copying and sharing of AI-generated content
- **Multi-language Support**: English, Spanish, and Japanese localization
- **Settings Management**: API status monitoring and configuration

### Technical Features
- **Shadow DOM**: Style isolation from webpage styles
- **API Availability Management**: Real-time monitoring of Google AI API status, imcluding the triggering and hadnling of model downloads.
- **Screenshot Capture**: Automatic screenshot capture for drag box selections
- **Position Management**: Smart positioning to keep elements in viewport

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

## Installation

### For Development
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select this directory
5. The extension will be loaded and ready to use

## Usage

### Text Selection Mode
1. **Select Text**: Highlight any text on a webpage
2. **Choose Action**: Three circular buttons will appear:
   - **Prompt**: Ask questions about the text
   - **Summarize**: Generate a summary
   - **Write**: Create new content based on the text
3. **Interact**: Use the popover interface to interact with AI
4. **Copy/Share**: Use the action buttons to copy or share results

### Drag Box Selection Mode
1. **Draw Selection**: Drag to create a selection box on the page
2. **Analyze**: The extension captures a screenshot and processes it
3. **Choose Action**: Two buttons will appear:
   - **Prompt**: Ask questions about the captured image
   - **Colors**: Extract prominent colors from the image

### Page Mode
1. **Activate Page Mode**: Use the mode switcher to enable page queries
2. **Query Entire Page**: Ask questions about the entire page content
3. **Get Insights**: Receive AI analysis of the complete webpage

### Advanced Features
- **Voice Input**: Click the microphone button to speak your prompts
- **Conversation History**: View and continue previous conversations
- **Settings**: Monitor API status and configure language preferences
- **Drag Popovers**: Move popovers around the screen for better positioning

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
├── manifest.json                    # Extension manifest
├── index.js                        # Main content script entry point
├── background.js                   # Service worker
├── i18n.js                        # Internationalization
├── config.js                       # Configuration
├── styles.css                      # Global styles
├── main/                          # Main content script modules
│   ├── index.js                   # Main SelectionAI class
│   ├── config.js                  # Configuration
│   ├── features/                  # Feature implementations
│   │   ├── action-buttons.js      # Action button management
│   │   ├── drag-selection.js      # Drag box selection
│   │   ├── mode-switcher.js       # Mode switching UI
│   │   ├── screenshot-capture.js # Screenshot functionality
│   │   └── text-selection.js      # Text selection handling
│   ├── handlers/                  # Event handlers
│   │   └── notification-handler.js # Notification system
│   ├── managers/                  # Core managers
│   │   ├── api-availability-manager.js # API status monitoring
│   │   ├── cursor-manager.js      # Cursor management
│   │   └── popover-manager.js     # Popover lifecycle
│   ├── styles/                    # Styling utilities
│   │   ├── css-constants.js       # CSS constants
│   │   └── css-utils.js          # CSS utilities
│   └── utils/                     # Utility functions
│       └── positioning.js         # Position calculations
├── popover/                       # Popover interface
│   ├── index.js                  # Main PopoverAI class
│   ├── config.js                 # Popover configuration
│   ├── features/                 # Popover features
│   │   ├── color-analyzer.js     # Color extraction
│   │   └── voice-input.js        # Voice input handling
│   ├── managers/                 # Popover managers
│   │   ├── conversation-manager.js # Chat history
│   │   ├── google-nano-manager.js  # AI API integration
│   │   └── settings-manager.js   # Settings interface
│   ├── styles/                   # Popover styling
│   │   ├── css-constants.js      # CSS constants
│   │   └── css-utils.js         # CSS utilities
│   ├── templates/                # HTML templates
│   │   ├── colors-extraction-templates.js
│   │   ├── conversation-templates.js
│   │   ├── history-templates.js
│   │   ├── html-tamplates.js
│   │   └── settings-templates.js
│   └── utils/                    # Popover utilities
│       └── drag-handler.js       # Drag functionality
├── utils/                        # Shared utilities
│   ├── animations.js             # Animation utilities
│   ├── markdown-parser.js        # Markdown processing
│   └── positioning.js           # Position calculations
└── icons/                        # Extension icons
```

### Key Components

#### Main Content Script (`main/index.js`)
- Handles text and drag box selection detection
- Manages mode switching between text and drag selection
- Coordinates between different feature modules
- Manages API availability and notifications

#### Popover System (`popover/index.js`)
- AI interaction interface with Shadow DOM isolation
- Streaming response handling with real-time updates
- Conversation history management
- Voice input integration
- Color analysis for image selections

#### Feature Modules
- **Action Buttons**: Smart positioning and visibility management
- **Drag Selection**: Screenshot capture and box selection
- **Mode Switcher**: UI for switching between selection modes
- **Screenshot Capture**: Canvas-based screenshot functionality
- **Text Selection**: Text highlighting and range management

#### Manager Classes
- **API Availability Manager**: Real-time monitoring of Google AI APIs
- **Popover Manager**: Lifecycle management for popover instances
- **Conversation Manager**: Persistent chat history storage
- **Settings Manager**: Configuration and API status interface

#### Styling System
- **Shadow DOM**: Complete style isolation from webpage styles
- **CSS Constants**: Centralized styling variables
- **Responsive Design**: Adaptive layouts for different screen sizes
- **Animation System**: Smooth transitions and loading states

## Browser Compatibility

This extension requires Chrome with support for:
- Google's Prompt API
- Google's Summarizer API  
- Google's Writer API
- Modern JavaScript features (async/await, ReadableStream)

## Privacy & Security

- **Local Processing**: All AI processing happens locally in the browser using Google's on-device AI models
- **No External Servers**: No data is sent to external servers - everything runs on your device
- **Local Storage**: Selected text and conversation history stored locally in extension storage
- **Screenshot Privacy**: Screenshots are processed locally and not transmitted anywhere
- **API Compliance**: Follows Google's Generative AI Prohibited Uses Policy
- **Permission Minimal**: Only requests necessary permissions (storage, activeTab, tabs)
- **Shadow DOM**: Isolation prevents webpage interference

## Troubleshooting

### Common Issues

1. **APIs not available**: 
   - Ensure you're using a supported Chrome version (138+)
   - Check API availability in the settings popover
   - Enable required Chrome flags if needed
2. **Model download required**: 
   - First use may require downloading Gemini Nano model (22GB)
   - Ensure you have sufficient storage space
   - Use an unmetered internet connection for initial download
3. **Hardware requirements**: 
   - Check that your system meets the minimum requirements
   - GPU inference requires 4GB+ VRAM
   - CPU inference requires 16GB RAM + 4 cores
4. **Selection not working**:
   - Ensure the correct mode is selected (text vs drag box)
   - Check that no popover is currently open
   - Try refreshing the page if issues persist
5. **Voice input not working**:
   - Grant microphone permissions when prompted
   - Ensure your browser supports speech recognition
   - Check that you're using a supported language

## Acknowledgments

- **Google Chrome Team** for the revolutionary on-device AI APIs
- **Lucide** for the beautiful and consistent icon set
- **Chrome Extensions Team** for the robust extension platform
- **Web Standards Community** for Shadow DOM and modern web APIs
