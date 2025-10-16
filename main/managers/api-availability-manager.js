/**
 * ApiAvailabilityManager - Manages Chrome AI API availability state
 * Handles availability checking, debug overrides, and locale management
 */

export class ApiAvailabilityManager {
  constructor(config = {}) {
    // Initial availability state
    this.availability = {
      prompt: 'unknown',
      summarizer: 'unknown',
      writer: 'unknown'
    };

    this.locale = navigator.language || 'en-US';
    this.isInitialized = false;

    // Configuration callbacks
    this.onAvailabilityChange = config.onAvailabilityChange || (() => {});
    this.onLocaleChange = config.onLocaleChange || (() => {});
    this.onApiAvailable = config.onApiAvailable || (() => {});

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for availability changes
   */
  setupEventListeners() {
    // Listen for overrides from settings popover
    window.addEventListener('selectionAiAvailabilityOverride', (e) => {
      this.handleAvailabilityOverride(e.detail);
    });

    // Listen for availability refresh (when real API state is re-checked after download)
    window.addEventListener('selectionAiAvailabilityRefresh', (e) => {
      this.handleAvailabilityRefresh(e.detail);
    });
  }

  /**
   * Handle availability override from settings
   * @param {Object} overrides - Override data
   */
  handleAvailabilityOverride(overrides) {
    try {
      const effective = { ...this.availability };
      ['prompt', 'summarizer', 'writer'].forEach(key => {
        if (overrides[key] && overrides[key].state) {
          effective[key] = overrides[key].state;
        }
      });
      this.availability = effective;
      this.onAvailabilityChange(this.availability);
    } catch (error) {
      console.error('Failed to handle availability override:', error);
    }
  }

  /**
   * Handle availability refresh event
   * @param {Object} detail - Event detail { key, status }
   */
  handleAvailabilityRefresh(detail) {
    try {
      const { key, status } = detail || {};
      if (key && status) {
        this.availability[key] = status;
        this.onAvailabilityChange(this.availability);
        
        // If a new API became available, notify
        if (status === 'available') {
          this.onApiAvailable(key);
        }
      }
    } catch (error) {
      console.error('Failed to handle availability refresh:', error);
    }
  }

  /**
   * Check availability of all AI APIs
   * @returns {Promise<Object>} Availability status for all APIs
   */
  async checkAvailability() {
    try {
      // Load persisted locale
      await this.loadLocale();

      // Apply stored debug overrides first
      const overrides = await this.loadDebugOverrides();

      // Check Prompt API (LanguageModel)
      this.availability.prompt = await this.checkPromptAPI(overrides);

      // Check Summarizer API
      this.availability.summarizer = await this.checkSummarizerAPI(overrides);

      // Check Writer API
      this.availability.writer = await this.checkWriterAPI(overrides);

      this.isInitialized = true;
      this.onAvailabilityChange(this.availability);

      return this.availability;
    } catch (error) {
      console.error('AI APIs not available:', error);
      return this.availability;
    }
  }

  /**
   * Check Prompt API availability
   * @param {Object} overrides - Debug overrides
   * @returns {Promise<string>} Availability status
   */
  async checkPromptAPI(overrides = {}) {
    if ('LanguageModel' in self && typeof LanguageModel.availability === 'function') {
      const status = await LanguageModel.availability();
      return overrides.prompt?.state || status || 'available';
    } else {
      return overrides.prompt?.state || 'unavailable';
    }
  }

  /**
   * Check Summarizer API availability
   * @param {Object} overrides - Debug overrides
   * @returns {Promise<string>} Availability status
   */
  async checkSummarizerAPI(overrides = {}) {
    if ('Summarizer' in self && typeof Summarizer.availability === 'function') {
      const status = await Summarizer.availability();
      return overrides.summarizer?.state || status || 'available';
    } else {
      return overrides.summarizer?.state || 'unavailable';
    }
  }

  /**
   * Check Writer API availability
   * @param {Object} overrides - Debug overrides
   * @returns {Promise<string>} Availability status
   */
  async checkWriterAPI(overrides = {}) {
    if ('Writer' in self && typeof Writer.availability === 'function') {
      const status = await Writer.availability();
      return overrides.writer?.state || status || 'available';
    } else {
      return overrides.writer?.state || 'unavailable';
    }
  }

  /**
   * Load debug overrides from storage
   * @returns {Promise<Object>} Debug overrides
   */
  async loadDebugOverrides() {
    try {
      const result = await chrome.storage.local.get(['selection_ai_debug_overrides']);
      return result.selection_ai_debug_overrides || {};
    } catch (error) {
      console.error('Failed to load debug overrides:', error);
      return {};
    }
  }

  /**
   * Load locale from storage
   * @returns {Promise<string>} Locale
   */
  async loadLocale() {
    try {
      const result = await chrome.storage.local.get(['selection_ai_locale']);
      if (result.selection_ai_locale) {
        this.locale = result.selection_ai_locale;
        try { 
          window.__selection_ai_cached_locale = result.selection_ai_locale; 
        } catch (_) { }
        this.onLocaleChange(this.locale);
      }
      return this.locale;
    } catch (error) {
      console.error('Failed to load locale:', error);
      return this.locale;
    }
  }

  /**
   * Get current availability
   * @returns {Object} Current availability state
   */
  getAvailability() {
    return { ...this.availability };
  }

  /**
   * Get current locale
   * @returns {string} Current locale
   */
  getLocale() {
    return this.locale;
  }

  /**
   * Check if a specific API is available
   * @param {string} apiName - API name (prompt, summarizer, writer)
   * @returns {boolean}
   */
  isAvailable(apiName) {
    return this.availability[apiName] === 'available';
  }

  /**
   * Check if any API is available
   * @returns {boolean}
   */
  hasAnyAvailable() {
    return Object.values(this.availability).some(status => status === 'available');
  }

  /**
   * Check if all APIs are available
   * @returns {boolean}
   */
  hasAllAvailable() {
    return Object.values(this.availability).every(status => status === 'available');
  }

  /**
   * Check if any API needs attention (not available)
   * @returns {boolean}
   */
  needsAttention() {
    return ['prompt', 'summarizer', 'writer'].some(
      k => this.availability[k] && this.availability[k] !== 'available'
    );
  }

  /**
   * Set locale
   * @param {string} locale - New locale
   */
  setLocale(locale) {
    this.locale = locale;
    this.onLocaleChange(locale);
  }

  /**
   * Update availability for a specific API
   * @param {string} apiName - API name
   * @param {string} status - Availability status
   */
  updateAvailability(apiName, status) {
    if (this.availability.hasOwnProperty(apiName)) {
      this.availability[apiName] = status;
      this.onAvailabilityChange(this.availability);
    }
  }

  /**
   * Reset availability to unknown state
   */
  reset() {
    this.availability = {
      prompt: 'unknown',
      summarizer: 'unknown',
      writer: 'unknown'
    };
    this.isInitialized = false;
    this.onAvailabilityChange(this.availability);
  }

  /**
   * Check if manager is initialized
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized;
  }
}

