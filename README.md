![Logo](https://github.com/cdnkr/page-plus-ai-chrome-extension/blob/main/icons/logo_dark.png?raw=true)

# Page Plus AI Chrome Extension

A Chrome extension that uses Google's new in-browser AI APIs (Prompt, Summarizer, and Writer) to provide AI-powered text and image analysis and generation directly in your browser.

## Installation & Testing

### Prerequisites
- **Chrome Version**: Chrome 138+ (stable) required
- **Storage**: At least 22 GB free space for model download
- **Hardware**: 16 GB RAM + 4 CPU cores OR 4+ GB VRAM
- **OS**: Windows 10/11, macOS 13+, Linux, or ChromeOS

### Installation (No Build Step Required)
1. **Download/Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the root directory of this extension
5. **Extension is ready** - no build step needed.

## Features

### Selection Modes
- **Text Selection**: 
   - Activated by clicking the *I* icon on the extension menu (bottom left)

![Text Selection Menu](/assets/screenshots/text-selection-menu.png)

   - While active, select any text on a webpage to trigger AI actions
   - Select the action:
      - Prompt
      - Summarize
      - Write

![Text Selection](https://github.com/cdnkr/page-plus-ai-chrome-extension/blob/main/assets/screenshots/text-selection-2.png?raw=true)

- **Drag Box Selection**: 
   - Activated by clicking the *Dashed box* icon on the extension menu (bottom left)
   
![Drag Selection Menu](/assets/screenshots/drag-selection-menu.png)

   - Draw a selection box anywhere on the page to capture screenshots for analysis
      - Prompt
      - Get colors of area

![Drag Selection](https://github.com/cdnkr/page-plus-ai-chrome-extension/blob/main/assets/screenshots/drag-selection-3.png?raw=true)

- **Page Mode**: 
   - Select the *Page* icon on the extension menu (bottom left)
      - Prompt the current page content

![Page Query](https://github.com/cdnkr/page-plus-ai-chrome-extension/blob/main/assets/screenshots/page-query.png?raw=true)

### AI Capabilities
- **Prompt**: Ask questions about selected text, images, or entire pages using Google's Prompt API
- **Summarize**: Generate summaries using Google's Summarizer API
- **Write**: Create new content based on selected text using Google's Writer API
- **Color Analysis**: Extract the 6 most prominent colors from image selections

### Advanced Features
- **Conversation History**: Persistent chat history for each session

![History](https://github.com/cdnkr/page-plus-ai-chrome-extension/blob/main/assets/screenshots/history.png?raw=true)

- **Voice Input**: Speech-to-text input using browser's speech recognition
- **Streaming Responses**: Real-time streaming of AI responses
- **Context Awareness**: Maintains conversation context across interactions

### User Experience
- **Modern UI**: Clean, minimal design with smooth animations
- **Draggable popovers**: For better positioning
- **Copy & Share**: Easy copying and sharing of AI-generated content
- **Multi-language Support**: English, Spanish, and Japanese localization
- **Settings Management**: API status monitoring and configuration

![Config](/assets/screenshots/config.png)

### Technical Features
- **Shadow DOM**: Style isolation from webpage styles
- **API Availability Management**: Real-time monitoring of Google AI API status, including the triggering and handling of model downloads.
- **Screenshot Capture**: Automatic screenshot capture for drag box selections
- **Position Management**: Smart positioning to keep elements in viewport

## Chrome API Integration

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

## Privacy & Security

- **Local Processing**: All AI processing happens locally in the browser using Google's on-device AI models
- **No External Servers**: No data is sent to external servers - everything runs on your device
- **Local Storage**: Selected text and conversation history stored locally in extension storage
- **Screenshot Privacy**: Screenshots are processed locally and not transmitted anywhere
- **API Compliance**: Follows Google's Generative AI Prohibited Uses Policy
- **Permission Minimal**: Only requests necessary permissions (storage, activeTab, tabs)
- **Shadow DOM**: Isolation prevents webpage interference

### Testing Checklist

#### Basic Functionality Tests
1. **Text Selection Mode**:

   - Navigate to any webpage (e.g., news article, Wikipedia)
   - Select any text on the page
   - Verify 3 circular buttons appear: Prompt, Summarize, Write
   - Test each button to ensure popover opens

2. **Drag Box Selection Mode**:

   - Click the mode switcher (top-left corner of extension UI)
   - Switch to "Drag Box" mode
   - Drag to create a selection box on any part of the page
   - Verify 2 buttons appear: Prompt, Colors
   - Test both buttons

3. **Page Mode**:

   - Switch to "Page" mode using the mode switcher
   - Click the prompt button to query the entire page
   - Verify AI responds with page content analysis

#### AI Feature Tests
1. **Prompt API**:
   - Select text and click "Prompt"
   - Ask: "What is this text about?"
   - Verify streaming response appears
   - Test follow-up questions in the same conversation

2. **Summarizer API**:
   - Select text and click "Summarize"
   - Verify summary is generated

3. **Writer API**:
   - Select text and click "Write"
   - Ask to rewrite or expand the content
   - Verify new content is generated

4. **Color Analysis**:
   - Switch to Drag Box mode
   - Select an image or colorful area
   - Click "Colors" button
   - Verify 6 prominent colors are extracted

#### Advanced Feature Tests
1. **Voice Input**:
   - Click microphone button in popover
   - Grant microphone permission when prompted
   - Speak a question and verify text appears
   - Test voice input with different languages

2. **Conversation History**:

   - Have a conversation with the AI
   - Close and reopen the popover
   - Verify conversation history is preserved
   - Test history navigation

3. **Settings & API Status**:
   - Click settings button in popover
   - Verify API availability status is shown
   - Test language switching (EN/ES/JP)
   - Check model download status

4. **Drag & Drop**:
   - Open any popover
   - Drag the popover by its header
   - Verify it moves smoothly
   - Test positioning on different screen areas

#### Edge Cases & Error Handling
1. **API Unavailable**:
   - Test behavior when APIs are not available
   - Verify appropriate error messages
   - Check settings for API status

2. **Model Download**:
   - If first time use, verify model download prompt
   - Test with insufficient storage space
   - Verify download progress indicators

3. **Selection Edge Cases**:
   - Test with very short text selections
   - Test with images vs text
   - Test on different website types
   - Test with overlapping selections

4. **Performance**:
   - Test with large text selections
   - Test multiple rapid selections
   - Verify smooth animations
   - Check memory usage in DevTools

#### Cross-Site Testing
Test on various websites:
- **News sites** (CNN, BBC, etc.)
- **Wikipedia** articles
- **Social media** (Twitter, LinkedIn)
- **E-commerce** (Amazon product pages)
- **Documentation** (GitHub, Stack Overflow)
- **Images** (Google Images, Unsplash)

#### Browser Compatibility
- Test on different Chrome versions (138+)
- Verify Shadow DOM isolation works
- Test on different screen sizes
- Verify responsive design

### Expected Behavior
- **Smooth animations** for all interactions
- **Real-time streaming** responses from AI
- **Context-aware** conversations
- **No external network** requests (all local processing)
- **Persistent** conversation history
- **Multi-language** support
- **Error handling** for API unavailability

### Troubleshooting

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
