/**
 * VoiceInputManager - Manages voice input functionality
 * Handles speech recognition and microphone access
 */

import { loadingSpinnerHTML } from '../templates/html-tamplates.js';

export class VoiceInputManager {
    constructor(popover) {
        this.popover = popover;
        this.voiceBtn = popover.voiceBtn;
        this.userInput = popover.userInput;
    }

    // ==================== Voice Input ====================

    startVoiceInput() {
        if (!this.voiceBtn) return;

        const original = this.voiceBtn.innerHTML;
        this.voiceBtn.dataset.original = original;
        this.voiceBtn.innerHTML = loadingSpinnerHTML;
        this.voiceBtn.disabled = true;

        const finish = () => {
            if (!this.voiceBtn) return;
            this.voiceBtn.disabled = false;
            if (this.voiceBtn.dataset.original) {
                this.voiceBtn.innerHTML = this.voiceBtn.dataset.original;
            }
        };

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.popover.showNotification('Microphone not supported in this browser.');
                finish();
                return;
            }

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    try {
                        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                        if (!SpeechRecognition) {
                            this.popover.showNotification('Speech Recognition not supported.');
                            try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                            finish();
                            return;
                        }

                        let locale = 'en-US';
                        try {
                            const base = this.popover.getPreferredBaseLanguage ? this.popover.getPreferredBaseLanguage() : 'en';
                            if (base === 'es') locale = 'es-ES';
                            else if (base === 'ja') locale = 'ja-JP';
                        } catch (_) { }

                        const rec = new SpeechRecognition();
                        rec.lang = locale;
                        rec.interimResults = false;
                        rec.maxAlternatives = 1;

                        rec.onresult = (event) => {
                            try {
                                const transcript = event.results && event.results[0] && event.results[0][0]
                                    ? event.results[0][0].transcript
                                    : '';
                                if (transcript && this.userInput) {
                                    if (this.userInput.value && !this.userInput.value.endsWith(' ')) {
                                        this.userInput.value = `${this.userInput.value} ${transcript}`;
                                    } else if (this.userInput.value) {
                                        this.userInput.value = `${this.userInput.value}${transcript}`;
                                    } else {
                                        this.userInput.value = transcript;
                                    }
                                }
                            } catch (e) {
                                console.warn('Failed to read recognition result', e);
                            } finally {
                                try { rec.stop(); } catch (_) { }
                                try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                                finish();
                            }
                        };

                        rec.onerror = (e) => {
                            console.warn('Speech recognition error', e);
                            this.popover.showNotification('Voice capture failed. Please try again.');
                            try { rec.stop(); } catch (_) { }
                            try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                            finish();
                        };

                        rec.onend = () => {
                            try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                            finish();
                        };

                        rec.start();
                    } catch (err) {
                        console.error('Speech setup failed', err);
                        try { stream.getTracks().forEach(t => t.stop()); } catch (_) { }
                        finish();
                    }
                })
                .catch((err) => {
                    console.warn('Microphone permission denied or unavailable', err);
                    this.popover.showNotification('Microphone permission denied.');
                    finish();
                });

        } catch (error) {
            console.error('startVoiceInput unexpected error', error);
            this.popover.showNotification('Voice capture failed.');
            finish();
        }
    }
}
