class TarotIndex extends HTMLElement {
  constructor() {
    super();
    this.reading = null;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const todayDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    this.innerHTML = `
      <title-bar root="true" class="w-full pb-6 short:pb-2" title="Today" subtitle="${todayDate}"></title-bar>
      <div class="w-full px-4 flex-1 flex items-start justify-center">
        <tarot-card-reading class="flex flex-1 items-start justify-center"></tarot-card-reading>
      </div>
    `;
  }
}

customElements.define('tarot-index', TarotIndex);