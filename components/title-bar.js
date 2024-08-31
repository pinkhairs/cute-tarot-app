import entries from '@/assets/entries-icon.svg';
import settings from '@/assets/settings-icon.svg';
import close from '@/assets/close-icon.svg';

class TitleBar extends HTMLElement {
  constructor() {
    super();
    this.subtitle = this.getAttribute('subtitle');
    this.title = this.getAttribute('title');
    this.root = this.getAttribute('root') || false;
    this.subDirLink = '/app/tarot';

    if (window.location.pathname === '/' || window.location.pathname.startsWith('/app/tarot/')) {
      this.subDirLink = '/app/tarot';
    } else if (window.location.pathname.startsWith('/app/vision-boards')) {
      this.subDirLink = '/app/vision-boards';
    } else if (window.location.pathname.startsWith('/app/you')) {
      this.subDirLink = '/app/you';
    }

    this.backLink = this.subDirLink+'.html' === '/app/tarot.html' ? '/app/' : this.subDirLink+'.html';
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
                <img src="${entries}" alt="Entries" class="w-5 h-5">
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
                <img src="${settings}" alt="Settings" class="w-8 h-8">
              </a>
            </div>` : `<div>
              <a href="${this.backLink}">
                <img src="${close}" alt="Back" class="w-4 h-4">  
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