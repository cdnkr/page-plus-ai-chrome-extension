/**
 * SettingsManager - Manages settings view and AI model configuration
 * Handles API availability, model downloads, and language settings
 */

import { DEBUG_SIMULATE_DOWNLOAD } from '../config.js';
import {
    getModelDownloadButtonHTML,
    getCircularDownloadProgressHTML,
    getDebugSelectHTML,
    getSettingsAPIRowHTML,
    getSettingsViewHTML
} from '../templates/settings-templates.js';

export class SettingsManager {
    constructor(popover) {
        this.popover = popover;
        this.shadowRoot = popover.shadowRoot;
        
        // Store cleanup functions for event listeners
        this.cleanupFunctions = [];
    }

    // ==================== Settings View ====================

    async startSettingsView(selectedText) {
        try {
            await this.popover.loadI18nOnce();
            let payload = {};
            try { payload = JSON.parse(selectedText || '{}'); } catch (_) { }
            let availability = payload.availability || {};  // Changed to let so it can be updated
            const locale = payload.locale || (navigator.language || 'en-US');

            const t = this.popover.t || ((k) => k);
            const apiRows = [
                { key: 'prompt', label: t('api_prompt'), description: t('api_prompt_description'), icon: `<svg style="flex-shrink:0; margin-top: 5px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-more-icon lucide-message-circle-more"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>` },
                { key: 'summarizer', label: t('api_summarizer'), description: t('api_summarizer_description'), icon: `<svg style="flex-shrink:0; margin-top: 5px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-text-icon lucide-book-text"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/></svg>` },
                { key: 'writer', label: t('api_writer'), description: t('api_writer_description'), icon: `<svg style="flex-shrink:0; margin-top: 5px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-line-icon lucide-pencil-line"><path d="M13 21h8"/><path d="m15 5 4 4"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>` }
            ];

            const statusBadge = (status, progress) => {
                if (status === 'downloading' || status === 'downloadable') return '';

                const map = {
                    available: { text: '<svg style="flex-shrink:0;" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>', color: '#10b981' },
                    unavailable: { text: '<svg style="flex-shrink:0;" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert-icon lucide-circle-alert"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>', color: '#ef4444' },
                    unknown: { text: '<svg style="flex-shrink:0;" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-question-mark-icon lucide-shield-question-mark"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>', color: '#6b7280' }
                };
                const s = map[status] || map.unknown;
                return `<span style="display:inline-block; padding:2px 8px; border-radius:9999px; font-size:11px; color:${s.color};">${s.text}</span>`;
            };

            const render = async () => {
                const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
                const overrides = overridesObj.selection_ai_debug_overrides || {};
                const effective = { ...availability };
                apiRows.forEach(r => {
                    if (overrides[r.key] && overrides[r.key].state) {
                        effective[r.key] = overrides[r.key].state;
                    }
                });

                const apiRowsHTML = apiRows.map(r => {
                    const o = overrides[r.key] || {};
                    const status = (DEBUG_SIMULATE_DOWNLOAD && o.state !== 'downloading') ? 'downloadable' : (effective[r.key] || 'unknown');
                    const progress = o.progress;
                    const actionHtml = status === 'downloadable'
                        ? getModelDownloadButtonHTML({
                            dataKey: r.key
                        })
                        : status === 'downloading'
                            ? (() => {
                                const size = 28; // px
                                const stroke = 3;
                                const r = (size - stroke) / 2;
                                const c = 2 * Math.PI * r;
                                const pct = Math.max(0, Math.min(100, Number(progress ?? 0)));
                                const offset = c * (1 - pct / 100);
                                return getCircularDownloadProgressHTML({
                                    size,
                                    stroke,
                                    r,
                                    c,
                                    pct,
                                    offset
                                });
                            })()
                            : '';
                    // Debug controls
                    const debugSelect = getDebugSelectHTML({
                        key: r.key,
                        state: o.state
                    });
                    return getSettingsAPIRowHTML({
                        icon: r.icon,
                        label: r.label,
                        description: r.description,
                        status: status,
                        progress: progress,
                        actionHTML: actionHtml,
                        debugSelectHTML: debugSelect,
                        statusBadgeHTML: statusBadge(status, progress)
                    })
                }).join('');

                this.popover.responseSection.style.display = 'flex';
                this.popover.responseContent.innerHTML = getSettingsViewHTML({
                    apiRowsHTML: apiRowsHTML,
                    languageOptions: this.languageOptions(locale),
                    t: t
                });

                // Wire actions
                const flagsBtn = this.shadowRoot.querySelector('#open-flags');
                const internalsBtn = this.shadowRoot.querySelector('#open-internals');
                const langSel = this.shadowRoot.querySelector('#language-select');
                const downloadButtons = this.shadowRoot.querySelectorAll('[data-action="download"]');
                const debugSelects = this.shadowRoot.querySelectorAll('.debug-state');
                const debugProgress = this.shadowRoot.querySelectorAll('.debug-progress');
                const clearBtn = this.shadowRoot.querySelector('#clear-debug');

                if (flagsBtn) flagsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openUrl('chrome://flags');
                });
                if (internalsBtn) internalsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openUrl('chrome://on-device-internals');
                });
                if (langSel) langSel.addEventListener('change', async (e) => {
                    const newLocale = e.target.value;
                    try {
                        await chrome.storage.local.set({ selection_ai_locale: newLocale });
                        window.location.reload();
                    } catch (err) {
                        console.error('Failed to save locale', err);
                    }
                });
                downloadButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Trigger a user-gesture download via availability API if supported
                        this.triggerModelDownload(btn.getAttribute('data-key'));
                    });
                });

                const saveOverrides = async (newOverrides) => {
                    await chrome.storage.local.set({ selection_ai_debug_overrides: newOverrides });
                    // Notify content script to refresh badge/icons
                    window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: newOverrides }));
                    // Re-render to reflect changes
                    render();
                };

                const currentOverrides = overrides; // from earlier await

                debugSelects.forEach(sel => {
                    sel.addEventListener('change', async (e) => {
                        const key = sel.getAttribute('data-key');
                        const val = sel.value;
                        const next = { ...currentOverrides };
                        next[key] = next[key] || {};
                        if (val === 'default') {
                            delete next[key];
                        } else {
                            next[key].state = val;
                            if (val !== 'downloading') delete next[key].progress;
                        }
                        await saveOverrides(next);
                    });
                });

                debugProgress.forEach(slider => {
                    slider.addEventListener('input', async () => {
                        const key = slider.getAttribute('data-key');
                        const val = Number(slider.value);
                        const next = { ...currentOverrides };
                        next[key] = next[key] || {};
                        if ((next[key].state || 'default') === 'downloading') {
                            next[key].progress = val;
                            await saveOverrides(next);
                        }
                    });
                });

                if (clearBtn) clearBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await saveOverrides({});
                });
            };

            // Initial render
            render();

            // Listen for availability override updates to re-render
            const handleOverrideUpdate = () => {
                render();
            };
            window.addEventListener('selectionAiAvailabilityOverride', handleOverrideUpdate);
            this.cleanupFunctions.push(() => {
                window.removeEventListener('selectionAiAvailabilityOverride', handleOverrideUpdate);
            });

            // Listen for availability refresh (when real API state is re-checked)
            const handleAvailabilityRefresh = (e) => {
                const { key, status } = e.detail || {};
                if (key && status) {
                    availability[key] = status;  // Update the availability object with fresh data
                    render();  // Re-render with updated availability
                }
            };
            window.addEventListener('selectionAiAvailabilityRefresh', handleAvailabilityRefresh);
            this.cleanupFunctions.push(() => {
                window.removeEventListener('selectionAiAvailabilityRefresh', handleAvailabilityRefresh);
            });

        } catch (e) {
            console.error('Failed to render settings view', e);
            this.popover.showError('Failed to load settings');
        }
    }

    // ==================== Language Settings ====================

    languageOptions(current) {
        const options = [
            'en-US', 'es-ES', 'ja-JP'
        ];
        return options.map(code => `<option value="${code}" ${code === current ? 'selected' : ''}>${code}</option>`).join('');
    }

    // ==================== URL Opening ====================

    async openUrl(url) {
        try {
            await chrome.runtime.sendMessage({ action: 'openUrl', url });
        } catch (e) {
            console.error('openUrl failed', e);
        }
    }

    // ==================== Model Download Management ====================

    async triggerModelDownload(key) {
        try {
            // Real API call for actual download with progress tracking
            const createOptions = {
                monitor: (m) => {
                    m.addEventListener('downloadprogress', async (e) => {
                        const progress = Math.round(e.loaded * 100);

                        // Get current overrides
                        const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
                        const overrides = overridesObj.selection_ai_debug_overrides || {};

                        // Update progress
                        const next = { ...overrides };
                        next[key] = { state: 'downloading', progress };

                        await chrome.storage.local.set({ selection_ai_debug_overrides: next });
                        window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: next }));

                        if (progress === 100) {
                            await this.setDownloadComplete(key);
                        }
                    });
                }
            };

            // Set initial downloading state
            const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
            const overrides = overridesObj.selection_ai_debug_overrides || {};
            const next = { ...overrides };
            next[key] = { state: 'downloading', progress: 0 };
            await chrome.storage.local.set({ selection_ai_debug_overrides: next });
            window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: next }));

            this.popover.showNotification('Model download started');

            // Start download with progress monitoring
            if (DEBUG_SIMULATE_DOWNLOAD) {
                await this.simulateDownloadProgress(key);
            } else {
                if (key === 'prompt' && 'LanguageModel' in self) {
                    await LanguageModel.create(createOptions);
                } else if (key === 'summarizer' && 'Summarizer' in self) {
                    await Summarizer.create(createOptions);
                } else if (key === 'writer' && 'Writer' in self) {
                    await Writer.create(createOptions);
                }
            }

            // Set to available state after download completes, then re-check real availability
            this.popover.showNotification('Model download completed');
        } catch (e) {
            console.error('Failed to request model download', e);
            this.popover.showNotification('Failed to request download');
        }
    }

    async removeDownloadOverride(key) {
        const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
        const overrides = overridesObj.selection_ai_debug_overrides || {};
        const next = { ...overrides };
        delete next[key];
        await chrome.storage.local.set({ selection_ai_debug_overrides: next });
        window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: next }));
    }

    async setDownloadComplete(key) {
        // Remove the download override
        await this.removeDownloadOverride(key);

        // Re-check actual API availability to get fresh state
        try {
            let realStatus = 'unknown';
            if (key === 'prompt' && 'LanguageModel' in self && typeof LanguageModel.availability === 'function') {
                realStatus = await LanguageModel.availability();
            } else if (key === 'summarizer' && 'Summarizer' in self && typeof Summarizer.availability === 'function') {
                realStatus = await Summarizer.availability();
            } else if (key === 'writer' && 'Writer' in self && typeof Writer.availability === 'function') {
                realStatus = await Writer.availability();
            }

            // Dispatch event to trigger UI refresh with fresh availability
            window.dispatchEvent(new CustomEvent('selectionAiAvailabilityRefresh', {
                detail: { key, status: realStatus }
            }));
        } catch (e) {
            console.error('Failed to re-check availability', e);
        }
    }

    async simulateDownloadProgress(key) {
        try {
            // Simulate download over 5 seconds
            const duration = 5000;
            const steps = 20;
            const stepDuration = duration / steps;

            for (let i = 1; i <= steps; i++) {
                await new Promise(resolve => setTimeout(resolve, stepDuration));

                const progress = Math.round((i / steps) * 100);

                // Get current overrides
                const overridesObj = await chrome.storage.local.get(['selection_ai_debug_overrides']);
                const overrides = overridesObj.selection_ai_debug_overrides || {};

                // Update progress
                const next = { ...overrides };
                if (next[key] && next[key].state === 'downloading') {
                    next[key].progress = progress;

                    await chrome.storage.local.set({ selection_ai_debug_overrides: next });
                    window.dispatchEvent(new CustomEvent('selectionAiAvailabilityOverride', { detail: next }));
                } else {
                    // Download was cancelled
                    return;
                }
            }

            // Set to available state after download completes
            await this.setDownloadComplete(key);
            this.popover.showNotification('Model download completed');
        } catch (e) {
            console.error('Failed to simulate download progress', e);
        }
    }

    // ==================== Cleanup ====================

    destroy() {
        // Clean up all event listeners
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
    }
}
