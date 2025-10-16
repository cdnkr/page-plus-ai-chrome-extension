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
        placeholder_ask_page: 'Ask something about this page...',
        settings_title: 'Settings',
        settings_api_availability: 'API Availability',
        settings_api_availability_description: 'The following browser based APIs in Chrome are needed for features to work correctly. These APIs harness on-device AI capabilities, keeping your data private.',
        settings_flags_help: 'Some of these APIs require flags to be enabled in Chrome. Click the "Open Flags" button to open the flags page and search for the required flags and enable them before returning here to download them.',
        settings_language: 'Language',
        settings_debug: 'Debug Mode',
        settings_debug_help: 'Override API states for testing. “Default” uses the detected state.',
        settings_open_flags: 'Open Flags',
        settings_open_internals: 'Device Internals',
        settings_clear_overrides: 'Clear Overrides',
        api_prompt: 'Ask API',
        api_prompt_description: 'This is a powerful on-device AI Model. This extension uses this for Text, Image and Page Prompt capabilities.',
        api_summarizer: 'Summarizer API',
        api_summarizer_description: 'This on-device AI Model is used for Text summarization.',
        api_writer: 'Writer API',
        api_writer_description: 'This on-device AI Model is used for writing generation based on Text content.',
        api_downloading: 'Downloading…',
        api_downloadable: 'Downloadable',
        err_prompt_unavailable: 'Ask API not available.',
        err_writer_unavailable: 'Writer API not available.',
        err_summarizer_unavailable: 'Summarizer API not available.',
        err_writer_not_available: 'Writer unavailable.',
        err_summarizer_not_available: 'Summarizer unavailable.',
        err_generic: 'Failed to process request. Please try again.',
        colors_title: 'Image → Colors',
        selected_area: 'Selected Area',
        mode_current_page: 'Query Current Page',
        button_history: 'History',
        header_history: 'Conversations',
        history_no_conversations: 'No conversations yet'
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
        placeholder_ask_page: 'Haz una pregunta sobre esta página...',
        settings_title: 'Configuración',
        settings_api_availability: 'Disponibilidad de la API',
        settings_api_availability_description: 'Las siguientes API de navegador en Chrome son necesarias para que las funciones funcionen correctamente. Estas API aprovechan capacidades de IA en el dispositivo, manteniendo tus datos privados.',
        settings_flags_help: 'Algunas de estas API requieren flags para ser habilitadas en Chrome. Haz clic en el botón "Abrir flags" para abrir la página de flags y buscar las flags requeridas y habilitarlas antes de volver aquí para descargarlos.',
        settings_language: 'Idioma',
        settings_debug: 'Modo de depuración',
        settings_debug_help: 'Sobrescribe el estado de las API para pruebas. “Predeterminado” usa el detectado.',
        settings_open_flags: 'Abrir flags',
        settings_open_internals: 'Internos del dispositivo',
        settings_clear_overrides: 'Borrar sobrescrituras',
        api_prompt: 'API de Preguntas',
        api_prompt_description: 'Esta es una potente IA en el dispositivo. Esta extensión usa esta para las capacidades de Preguntas de Texto, Imagen y Página.',
        api_summarizer: 'API de Resumen',
        api_summarizer_description: 'Esta IA en el dispositivo es usada para la resumen de Texto.',
        api_writer: 'API de Escritura',
        api_writer_description: 'Esta IA en el dispositivo es usada para la generación de escritura basada en el contenido de Texto.',
        api_downloading: 'Descargando…',
        api_downloadable: 'Disponible para descargar',
        err_prompt_unavailable: 'La API de Preguntas no está disponible.',
        err_writer_unavailable: 'La API de Escritura no está disponible.',
        err_summarizer_unavailable: 'La API de Resumen no está disponible.',
        err_writer_not_available: 'El escritor no está disponible.',
        err_summarizer_not_available: 'El resumidor no está disponible.',
        err_generic: 'No se pudo procesar la solicitud. Inténtalo de nuevo.',
        colors_title: 'Imagen → Colores',
        selected_area: 'Área seleccionada',
        mode_current_page: 'Consultar Página Actual',
        button_history: 'Historial',
        header_history: 'Conversaciones',
        history_no_conversations: 'Aún no hay conversaciones'
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
        placeholder_ask_page: 'このページについて何か質問がありますか...',
        settings_title: '設定',
        settings_api_availability: 'API の利用状況',
        settings_api_availability_description: '以下の Chrome ブラウザベースの API が機能するために必要です。これらの API はデバイス上の AI 機能を活用し、データをプライバシー保護します。',
        settings_flags_help: 'これらの API には、Chrome でフラグを有効にする必要があります。「フラグを開く」ボタンをクリックしてフラグページを開き、必要なフラグを検索して有効にし、ここに戻ってダウンロードしてください。',
        settings_language: '言語',
        settings_debug: 'デバッグモード',
        settings_debug_help: 'テスト用に API 状態を上書きします。「default」は検出された状態を使用します。',
        settings_open_flags: 'フラグを開く',
        settings_open_internals: 'デバイス内部情報',
        settings_clear_overrides: '上書きをクリア',
        api_prompt: '質問 API',
        api_prompt_description: 'これは強力なデバイス上の AI モデルです。この拡張機能は、テキスト、画像、ページの質問機能に使用します。',
        api_summarizer_description: 'このデバイス上の AI モデルは、テキストの要約に使用されます。',
        api_writer_description: 'このデバイス上の AI モデルは、テキストの内容に基づいた書き込み生成に使用されます。',
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
        colors_title: '画像 → カラー',
        selected_area: '選択範囲',
        mode_current_page: '現在のページをクエリ',
        button_history: '履歴',
        header_history: '会話',
        history_no_conversations: 'まだ会話がありません'
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


