// Background script for Chrome extension screenshot capture
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureVisibleTab') {
    // Capture the visible tab
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error('Screenshot capture failed:', chrome.runtime.lastError);
        sendResponse({ error: chrome.runtime.lastError.message });
        return;
      }
      
      // Send the full screenshot back to content script for cropping
      sendResponse({ dataUrl: dataUrl, cropArea: request.cropArea });
    });
    
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'openUrl' && request.url) {
    try {
      chrome.tabs.create({ url: request.url }, () => {
        if (chrome.runtime.lastError) {
          console.error('Failed to open URL:', chrome.runtime.lastError);
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ ok: true });
        }
      });
    } catch (e) {
      console.error('Unexpected error opening URL:', e);
      sendResponse({ error: String(e) });
    }
    return true;
  }
});
