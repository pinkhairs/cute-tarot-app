class TitleBar extends HTMLElement {
  constructor() {
    super();
    this.subtitle = this.getAttribute('subtitle');
    this.title = this.getAttribute('title');
    this.root = this.getAttribute('root') || false;
    this.subDirLink = '/tarot';

    if (window.location.pathname === '/' || window.location.pathname.startsWith('/tarot/')) {
      this.subDirLink = '/tarot';
    } else if (window.location.pathname.startsWith('/vision-boards')) {
      this.subDirLink = '/vision-boards';
    } else if (window.location.pathname.startsWith('/you')) {
      this.subDirLink = '/you';
    }

    this.backLink = this.subDirLink+'.html' === '/tarot.html' ? '/' : this.subDirLink+'.html';
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <div class="flex flex-col gap-2 pb-6 md:pb-6 lg:pb-6">
      <header class="pt-6 px-4">
        <div class="flex items-center justify-center">
          <div class="w-8">
            ${this.root ? `<div>
              <a href="${this.subDirLink}/entries.html">
                <img src="/assets/entries-icon.svg" alt="Entries" class="w-5 h-5">
              </a>
            </div>` : ''}
          </div>
          <div class="flex-grow text-center">
            <h1>${this.title}</h1>
          </div>
          <div class="flex items-center justify-end w-8">
            ${this.root ? `
            <div>
              <a href="${this.subDirLink}/settings.html">
                <img src="/assets/settings-icon.svg" alt="Settings" class="w-8 h-8">
              </a>
            </div>` : `<div>
              <a href="${this.backLink}">
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