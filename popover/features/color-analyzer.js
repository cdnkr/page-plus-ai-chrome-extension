/**
 * ColorAnalyzer - Manages color extraction from images
 * Analyzes image data and extracts dominant colors
 */

import { getColorsGridHTML } from '../templates/colors-extraction-templates.js';

export class ColorAnalyzer {
    constructor(popover) {
        this.popover = popover;
        this.shadowRoot = popover.shadowRoot;
    }

    // ==================== Color Analysis ====================

    async startColorAnalysis(imageDataUrl) {
        try {
            // Show loading
            this.popover.showLoading();

            // Analyze colors from the image
            const colors = await this.analyzeImageColors(imageDataUrl);

            if (colors && colors.length > 0) {
                this.displayColors(colors);
                this.popover.showActionButtons();
            } else {
                this.popover.showError('Could not analyze colors from the image');
            }
        } catch (error) {
            this.popover.showError(error.message);
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

    displayColors(colors) {
        this.popover.currentResponse = getColorsGridHTML({
            colors
        });

        this.popover.updateResponse(this.popover.currentResponse);

        // Add click handlers for copy buttons
        setTimeout(() => {
            const copyButtons = this.shadowRoot.querySelectorAll('.copy-color-btn');
            copyButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const color = btn.getAttribute('data-color');
                    navigator.clipboard.writeText(color).then(() => {
                        this.popover.showNotification(`Copied ${color} to clipboard!`);
                    }).catch(err => {
                        console.error('Failed to copy color:', err);
                    });
                });
            });
        }, 100);
    }
}
