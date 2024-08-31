class TitleBar extends HTMLElement {
  constructor() {
    super();
    this.subtitle = this.getAttribute('subtitle');
    this.title = this.getAttribute('title');
    this.root = this.getAttribute('root') || false;
    this.backLink = this.getAttribute('back-link') || '';
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <div class="flex flex-col gap-2 pb-6 md:pb-6 lg:pb-6">
      <header class="pt-6 px-4">
        <div class="flex items-center justify-center">
          <div class="flex-1">
            ${this.root ? `<div>
              <button type="button" hx-push-url="true" hx-get="/tarot/entries.html" hx-target="#main" hx-trigger="click">
                <img src="/assets/entries-icon.svg" alt="Entries" class="w-5 h-5">
              </button>
            </div>` : ''}
          </div>
          <div class="flex-1 text-center">
            <h1>${this.title}</h1>
          </div>
          <div class="flex-1 flex items-center justify-end">
            ${this.root ? `
            <div>
              <button type="button" hx-push-url="true" hx-get="/tarot/settings.html" hx-target="#main" hx-trigger="click">
                <img src="/assets/settings-icon.svg" alt="Settings" class="w-8 h-8">
              </button>
            </div>` : `<div>
              <div hx-push-url="true" hx-get="/" hx-target="#main" hx-trigger="click">
                <img src="/assets/close-icon.svg" alt="Back" class="w-4 h-4">  
              </a>
            </div>`}
          </div>
        </div>
      </header>
      ${this.subtitle ? `<div class="pt-2 text-center text-xl">${this.subtitle}</div>` : ''}
    </div>`;
  }
}

customElements.define('title-bar', TitleBar);