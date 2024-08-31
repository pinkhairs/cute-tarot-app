class TarotIndex extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <title-bar root="true" class="w-full pb-6 short:pb-2" title="Today" subtitle="August 29, 2024"></title-bar>
    <div class="w-full px-4 flex-1 flex items-start justify-center">
      <div class="flex-1">
        <tarot-card-reading class="flex items-start justify-center"></tarot-card-reading>
      </div>
    </div>
    `;
  }
}

customElements.define('tarot-index', TarotIndex);