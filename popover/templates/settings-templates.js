import { DEBUG_MODE } from '../config.js';
import { BG_RGB, FG_RGB, PRIMARY_COLOR_HEX } from '../../config.js';

export function getModelDownloadButtonHTML({
    dataKey,
}) {
    return `<button class="action-btn" data-action="download" data-key="${dataKey}"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg></button>`;
}

export function getCircularDownloadProgressHTML({
    size,
    stroke,
    r,
    c,
    pct,
    offset
}) {
    return `
<div style="position:relative; width:${size}px; height:${size}px; display:inline-flex; align-items:center; justify-content:center; padding: 2px 8px;">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="rgba(${FG_RGB}, 0.5)" stroke-width="${stroke}" fill="none" />
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="${PRIMARY_COLOR_HEX}" stroke-width="${stroke}" fill="none" stroke-linecap="round"
        stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})" />
    </svg>
    <div style="position:absolute; font-size:8px; color:rgba(${FG_RGB}, 0.9); font-weight:600;">${pct}%</div>
</div>`;
}

export function getDebugSelectHTML({
    key,
    state,
}) {
    return `
    <select class="debug-state" data-key="${key}" style="padding:4px 6px; border-radius:8px; border:1px solid rgba(${FG_RGB}, 0.5); background:rgba(${FG_RGB}, 0.05); font-size:12px;">
        ${['default', 'available', 'downloadable', 'downloading', 'unavailable'].map(v => `<option value="${v}" ${((state || 'default') === v) ? 'selected' : ''}>${v}</option>`).join('')}
    </select>
`;
}

export function getSettingsAPIRowHTML({
    icon,
    label,
    description,
    actionHTML,
    debugSelectHTML,
    statusBadgeHTML,
}) {
    debugSelectHTML = DEBUG_MODE ? `<div style="display:flex; align-items:center; gap:8px;">${debugSelectHTML}</div>` : '';

    return `<div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; gap:16px;">
    <div style="display:flex; align-items:flex-start; gap:12px; min-width:160px;">
        ${icon}
        <div style="display:flex; flex-direction:column; gap:4px; max-width:260px;">
            <span>${label}</span>
            <div style="font-size:12px; color:rgba(${FG_RGB}, 0.7);">${description}</div>
        </div>
    </div>
    <div style="display:flex; align-items:center; justify-content:flex-end; gap:8px;">${statusBadgeHTML} ${actionHTML}</div>
</div>`;
}

export function getSettingsViewHTML({
    apiRowsHTML,
    languageOptions,
    t,
}) {
    return `
<div style="display:flex; flex-direction:column; gap:16px;">
    <div>
        <div style="font-weight:600; color:rgba(${FG_RGB}, 1); margin-bottom:8px;">${t('settings_api_availability')}</div>
        <div style="font-size:12px; color:rgba(${FG_RGB}, 0.7); margin-bottom:8px;">${t('settings_api_availability_description')}</div>
        ${apiRowsHTML}
        <div style="margin-top:8px; font-size:12px; color:rgba(${FG_RGB}, 0.7);">${t('settings_flags_help')}</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
            <button class="ghost-btn" id="open-flags">
                ${t('settings_open_flags')}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-up-right-icon lucide-move-up-right"><path d="M13 5H19V11"/><path d="M19 5L5 19"/></svg>
            </button>
            <button class="ghost-btn" id="open-internals">
                ${t('settings_open_internals')}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-up-right-icon lucide-move-up-right"><path d="M13 5H19V11"/><path d="M19 5L5 19"/></svg>
            </button>
        </div>
    </div>

    <div>
        <div style="font-weight:600; color:rgba(${FG_RGB}, 0.8); margin-bottom:8px;">${t('settings_language')}</div>
        <select id="language-select" style="padding:8px 10px; border-radius:10px; border:1px solid rgba(${FG_RGB}, 0.5); background:rgba(${FG_RGB}, 0.05); color:rgba(${FG_RGB}, 0.8); font-size:13px;">
            ${languageOptions}
        </select>
    </div>
</div>`;
}
