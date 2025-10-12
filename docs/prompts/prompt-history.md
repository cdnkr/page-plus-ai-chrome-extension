### 🧠 Context

Currently, in my Chrome extension, the **popover modes** (“Prompt” and “Write”) allow users to submit prompts (text or image).
Each submission currently triggers a new, stateless response — i.e., follow-up prompts are treated as fresh queries without any memory.

---

### 🎯 Goal

Implement **prompt history** and **context persistence** for each instance of a popover.

---

### 🧩 Requirements

1. **Persist Prompt History**

   * Each **instance** (a unique “prompt” or “write” session created from a text or drag-box selection) should maintain its own history.
   * A history includes:

     * User messages (prompts)
     * AI responses

2. **Storage**

   * Store this history in **Chrome extension storage** (e.g., `chrome.storage.local`) for persistence and future-proofing.
   * Each instance should have a unique key or ID to separate histories.

3. **Usage in Follow-ups**

   * When the user submits a follow-up prompt in the same instance:

     * Retrieve existing history
     * Include it in the next query to preserve conversational context

4. **UI Updates**

   * In the response element (popover):

     * Show both user messages and AI responses in chronological order.


