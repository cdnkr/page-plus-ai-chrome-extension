class KnowAI {
  constructor() {
    this.init();
  }

  async init() {
    const { SelectionAI } = await import(chrome.runtime.getURL('main/index.js'));
    return new SelectionAI();
  }
}

new KnowAI();