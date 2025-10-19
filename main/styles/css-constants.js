import { BG_RGB, FG_RGB, PRIMARY_COLOR_HEX, PRIMARY_COLOR_RGB, SELECTION_COLOR_HEX } from '../../config.js';

export const selectionActionButtonsCSS = `

  .selection-ai-buttons {
    transition: all 0.2s ease;
    opacity: 0;
    filter: blur(20px);
  }

  .selection-ai-buttons.visible {
    opacity: 0.5;
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
    background: rgba(${PRIMARY_COLOR_RGB}, 0.2);
    color: rgba(${PRIMARY_COLOR_RGB}, 1);
  }

  .selection-ai-button:active {
    background: rgba(${PRIMARY_COLOR_RGB}, 0.4);
    color: rgba(${PRIMARY_COLOR_RGB}, 1);
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
    position: relative;
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
    position: relative;
  }

  .mode-switcher canvas {
    transition: all 0.2s ease;
  }

  .mode-switcher:hover canvas {
    scale: 1 1;
  }
    
  .mode-switcher .mode-btn:focus-visible {
    outline: none !important;
    border: none !important;
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
    background: rgba(${PRIMARY_COLOR_RGB}, 0.2);
    color: rgba(${PRIMARY_COLOR_RGB}, 1);
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

  /* Tooltip styles */
  .mode-tooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
    background: rgba(${BG_RGB}, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 12px 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
    opacity: 0;
    filter: blur(20px);
    visibility: hidden;
    transition: all 0.418s ease;
    pointer-events: none;
    z-index: 10001;
    width: 250px;
    white-space: normal;
    text-align: left;
  }


  .mode-tooltip.show {
    opacity: 1;
    visibility: visible;
    filter: blur(0px);
  }

  .mode-tooltip-title {
    font-size: 14px;
    color: rgba(${FG_RGB}, 1);
    margin-bottom: 4px;
    line-height: 1.2;
  }

  .mode-tooltip-description {
    font-size: 12px;
    color: rgba(${FG_RGB}, 0.7);
    margin-bottom: 6px;
    line-height: 1.3;
  }

  .mode-tooltip-action {
    font-size: 11px;
    color: rgba(${FG_RGB}, 0.5);
    font-style: italic;
  }

  /* Tooltip arrow 
  .mode-tooltip::after {
    content: '';
    position: absolute;
    top: calc(100% - 24px);
    left: calc(50% - 14px);
    transform: translateX(-50%);
    border: 10px solid transparent;
    background-color: rgba(${BG_RGB}, 0.95);
    border-radius: 6px;
    height: 12px;
    width: 12px;
    transform: rotate(45deg);
  }
    */
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
