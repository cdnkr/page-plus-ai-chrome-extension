export function getColorsGridHTML({
    colors,
}) {
    const colorsHtml = colors.map((color, index) => `
        <div class="color-item">
            <div class="color-swatch" style="background: ${color.rgb};"></div>
            
            <div class="color-info-wrapper">
                <div class="color-info">
                    <div class="color-hex">${color.hex}</div>
                    <div class="color-rgb">${color.rgb}</div>
                </div>
                <button class="copy-color-btn" data-color="${color.hex}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    return `
        <div class="colors-container">
            <div class="colors-grid">
                ${colorsHtml}
            </div>
        </div>
    `;
}
