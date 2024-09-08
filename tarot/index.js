class TarotIndex extends HTMLElement {
  constructor() {
    super();
    this.reading = null;
  }

  connectedCallback() {
    this.render();
    hideLoadingScreen();
  }

  render() {
    const todayDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    this.innerHTML = `
      <title-bar root="true" data-entries-link="/tarot-entries.html" data-settings-link="/tarot-settings.html" class="w-full" title="Today" subtitle="${todayDate}"></title-bar>
      <tarot-card-reading></tarot-card-reading>
    `;
  }
}

customElements.define('tarot-index', TarotIndex);