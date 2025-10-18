import { BG_RGB, FG_RGB, PRIMARY_COLOR_HEX, SELECTION_COLOR_HEX } from '../../config.js';

export const selectionActionButtonsCSS = `

  .selection-ai-buttons.visible {
    opacity: 1;
    filter: blur(0px);
  }
  
  .selection-ai-buttons-inner {
    padding: 8px;
    display: flex;
    gap: 8px;
    border-radius: 25px;
    background: rgba(${BG_RGB}, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .selection-ai-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    color: rgba(${FG_RGB}, 0.5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    position: relative;
    background: transparent;
  }
  
  .selection-ai-button:hover {
    background: rgba(${FG_RGB}, 0.1);
    color: rgba(${FG_RGB}, 1);
  }
  
  .selection-ai-button svg {
    width: 20px;
    height: 20px;
  }
`;


export const selectionHighlightCSS = `
  ::selection {
    background-color: ${SELECTION_COLOR_HEX} !important;
    color: black !important;
  }
  ::-moz-selection {
    background-color: ${SELECTION_COLOR_HEX} !important;
    color: black !important;
  }
`;


export const modeSwitcherCSS = `
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 10000;
`;

export const modeSwitcherRootCSS = `
  .mode-switcher {
    display: flex;
    background: rgba(${BG_RGB}, 1);
    backdrop-filter: blur(10px);
    border-radius: 12px 25px 25px 12px;
    padding: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    position: relative;
    transition: all 0.4s ease;
    gap: 4px;
  }

  .mode-switcher:has(.hidden:nth-child(2)) {
    border-radius: 12px 12px 12px 12px;
  }

  .mode-switcher.hidden {
    opacity: 0;
    filter: blur(20px);
  }

  .mode-switcher .home-button {
    width: 36px;
    height: 36px;
    /* background: ${PRIMARY_COLOR_HEX}; */
    border-radius: 50%;
    flex-shrink: 0;
    cursor: pointer !important;
  }

  .mode-switcher .home-button:active {
    scale: 1.05;
  }
  
  .mode-switcher .mode-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer !important;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: rgba(${FG_RGB}, 0.5);
  }

  .mode-btn.hidden {
    display: none;
  }

  .mode-switcher .mode-btn,
   .mode-switcher .mode-btn svg,
   .mode-switcher .mode-btn path,
   .mode-switcher .mode-btn svg rect,
   .mode-switcher .mode-btn svg line,
   .mode-switcher .mode-btn svg polyline,
   .mode-btn canvas {
    cursor: pointer !important;
  }
  
  .mode-btn.active {
    background: rgba(${FG_RGB}, 1);
    color: rgba(${BG_RGB}, 1);
  }
  
  .mode-btn:hover:not(.active) {
    background: rgba(${FG_RGB}, 0.05);
    color: rgba(${FG_RGB}, 1);
  }
  
  /* Override cursor for mode switcher */
  .mode-switcher {
    cursor: default !important;
  }
  
  .mode-switcher * {
    cursor: default !important;
  }
  
  .mode-btn {
    cursor: pointer !important;
  }
`;

export const cursorCSS = `
  body.text-mode-active {
    cursor: text !important;
  }
  
  body.drag-mode-active {
    cursor: crosshair !important;
  }
  
  body.drag-mode-active * {
    cursor: crosshair !important;
  }
  
  /* Override cursor for extension UI elements - more specific selectors */
  .selection-ai-popover,
  .selection-ai-popover *,
  .selection-ai-buttons,
  .selection-ai-buttons *,
  .selection-ai-mode-switcher,
  .selection-ai-mode-switcher *,
  .selection-ai-drag-box-container,
  .selection-ai-drag-box-container * {
    cursor: default !important;
  }
  
  /* Additional overrides for shadow DOM elements */
  [class*="selection-ai"] {
    cursor: default !important;
  }
  
  [class*="selection-ai"] * {
    cursor: default !important;
  }
`;

export const dragBoxContainerCSS = `
  position: absolute;
  left: 0px;
  top: 0px;
  pointer-events: none;
  z-index: 10000;
`;

export const dragBoxCSS = `
  .drag-box {
    position: absolute;
    border: 2px dashed ${SELECTION_COLOR_HEX};
    pointer-events: none;
  }
`;
