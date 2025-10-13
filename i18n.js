// i18n module for Selection AI
// Supported base languages: en, es, ja

const SUPPORTED = ['en', 'es', 'ja'];

const MESSAGES = {
    en: {
        button_prompt: 'Ask',
        button_summarize: 'Summarize',
        button_write: 'Write',
        button_settings: 'Settings',
        mode_text: 'Text Selection',
        mode_drag: 'Box Selection',
        notif_copied: 'Copied to clipboard!',
        notif_copy_failed: 'Couldn’t copy to clipboard.',
        header_text_ask: 'Text → Ask',
        header_image_ask: 'Image → Ask',
        header_page_ask: 'Page → Ask',
        header_text_write: 'Text → Write',
        header_image_write: 'Image → Write',
        header_text_summarize: 'Text → Summarize',
        placeholder_ask_text: 'Ask something about the selected text...',
        placeholder_ask_image: 'Ask something about the selected image...',
        placeholder_write_text: 'What would you like to write about this text?',
        placeholder_write_image: 'What would you like to write about this image?',
        settings_title: 'Settings',
        settings_api_availability: 'API Availability',
        settings_language: 'Language',
        settings_debug: 'Debug Mode',
        settings_debug_help: 'Override API states for testing. “Default” uses the detected state.',
        settings_open_flags: 'Open Flags',
        settings_open_internals: 'Device Internals',
        settings_clear_overrides: 'Clear Overrides',
        api_prompt: 'Ask API',
        api_summarizer: 'Summarizer API',
        api_writer: 'Writer API',
        api_downloading: 'Downloading…',
        api_downloadable: 'Downloadable',
        err_prompt_unavailable: 'Ask API not available.',
        err_writer_unavailable: 'Writer API not available.',
        err_summarizer_unavailable: 'Summarizer API not available.',
        err_writer_not_available: 'Writer unavailable.',
        err_summarizer_not_available: 'Summarizer unavailable.',
        err_generic: 'Failed to process request. Please try again.',
        colors_title: 'Colors',
        selected_area: 'Selected Area'
    },

    es: {
        button_prompt: 'Preguntar',
        button_summarize: 'Resumir',
        button_write: 'Escribir',
        button_settings: 'Configuración',
        mode_text: 'Selección de texto',
        mode_drag: 'Selección por recuadro',
        notif_copied: '¡Copiado al portapapeles!',
        notif_copy_failed: 'No se pudo copiar al portapapeles.',
        header_text_ask: 'Texto → Preguntar',
        header_image_ask: 'Imagen → Preguntar',
        header_page_ask: 'Página → Preguntar',
        header_text_write: 'Texto → Escribir',
        header_image_write: 'Imagen → Escribir',
        header_text_summarize: 'Texto → Resumir',
        placeholder_ask_text: 'Haz una pregunta sobre el texto seleccionado...',
        placeholder_ask_image: 'Haz una pregunta sobre la imagen seleccionada...',
        placeholder_write_text: '¿Qué te gustaría escribir sobre este texto?',
        placeholder_write_image: '¿Qué te gustaría escribir sobre esta imagen?',
        settings_title: 'Configuración',
        settings_api_availability: 'Disponibilidad de la API',
        settings_language: 'Idioma',
        settings_debug: 'Modo de depuración',
        settings_debug_help: 'Sobrescribe el estado de las API para pruebas. “Predeterminado” usa el detectado.',
        settings_open_flags: 'Abrir flags',
        settings_open_internals: 'Internos del dispositivo',
        settings_clear_overrides: 'Borrar sobrescrituras',
        api_prompt: 'API de Preguntas',
        api_summarizer: 'API de Resumen',
        api_writer: 'API de Escritura',
        api_downloading: 'Descargando…',
        api_downloadable: 'Disponible para descargar',
        err_prompt_unavailable: 'La API de Preguntas no está disponible.',
        err_writer_unavailable: 'La API de Escritura no está disponible.',
        err_summarizer_unavailable: 'La API de Resumen no está disponible.',
        err_writer_not_available: 'El escritor no está disponible.',
        err_summarizer_not_available: 'El resumidor no está disponible.',
        err_generic: 'No se pudo procesar la solicitud. Inténtalo de nuevo.',
        colors_title: 'Colores',
        selected_area: 'Área seleccionada'
    },

    ja: {
        button_prompt: '質問',
        button_summarize: '要約',
        button_write: '作成',
        button_settings: '設定',
        mode_text: 'テキスト選択',
        mode_drag: 'ボックス選択',
        notif_copied: 'クリップボードにコピーしました。',
        notif_copy_failed: 'コピーに失敗しました。',
        header_text_ask: 'テキスト → 質問',
        header_image_ask: '画像 → 質問',
        header_page_ask: 'ページ → 質問',
        header_text_write: 'テキスト → 作成',
        header_image_write: '画像 → 作成',
        header_text_summarize: 'テキスト → 要約',
        placeholder_ask_text: '選択したテキストについて質問してください…',
        placeholder_ask_image: '選択した画像について質問してください…',
        placeholder_write_text: '選択したテキストについて何を書きますか？',
        placeholder_write_image: '選択した画像について何を書きますか？',
        settings_title: '設定',
        settings_api_availability: 'API の利用状況',
        settings_language: '言語',
        settings_debug: 'デバッグモード',
        settings_debug_help: 'テスト用に API 状態を上書きします。「default」は検出された状態を使用します。',
        settings_open_flags: 'フラグを開く',
        settings_open_internals: 'デバイス内部情報',
        settings_clear_overrides: '上書きをクリア',
        api_prompt: '質問 API',
        api_summarizer: '要約 API',
        api_writer: 'ライター API',
        api_downloading: 'ダウンロード中…',
        api_downloadable: 'ダウンロード可能',
        err_prompt_unavailable: '質問 API は利用できません。',
        err_writer_unavailable: 'ライター API は利用できません。',
        err_summarizer_unavailable: '要約 API は利用できません。',
        err_writer_not_available: 'ライターは利用できません。',
        err_summarizer_not_available: '要約は利用できません。',
        err_generic: 'リクエストの処理に失敗しました。もう一度お試しください。',
        colors_title: 'カラー',
        selected_area: '選択範囲'
    }
};


let cachedLocale;
let cachedBase = 'en';

export async function initI18n() {
    try {
        const { selection_ai_locale } = await chrome.storage.local.get(['selection_ai_locale']);
        cachedLocale = selection_ai_locale || navigator.language || 'en';
        try { window.__selection_ai_cached_locale = cachedLocale; } catch (_) { }
    } catch (_) {
        cachedLocale = navigator.language || 'en';
    }
    const base = (String(cachedLocale).toLowerCase().split('-')[0]) || 'en';
    cachedBase = SUPPORTED.includes(base) ? base : 'en';
}

export function t(key) {
    return (MESSAGES[cachedBase] && MESSAGES[cachedBase][key]) || (MESSAGES.en[key] || key);
}

export function getUiLocaleOptions() {
    return ['en-US', 'es-ES', 'ja-JP'];
}

export function getBaseLanguage() {
    return cachedBase;
}


