import Cookies from 'js-cookie'
import star from '@/assets/star.svg';

class TarotEntries extends HTMLElement {
  constructor() {
    super();
    this.entries = [];
  }
  
  connectedCallback() {
    this.getNonce().then(nonce => {
      this.fetchEntries(nonce);
    });
  }

  async getNonce() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_credentials`, {
        credentials: 'include'
    });
    const userInfo = await response.json();
    return userInfo.nonce;
  }

  async fetchEntries(nonce) {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=tarot_entries&_wpnonce=${nonce}`, { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    this.entries = await response.json();
    this.render();
    hideLoadingScreen();
  }

  render() {
    const entriesHtml = this.entries.map(entry => `
      <li class="flex pb-4 mb-4">
        <button type="button" hx-target="#content" hx-get="/tarot-entry.html" class="load-entry text-left flex" data-slug="${entry.slug}">
          <div>
            <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-xl bg-translucent">
              <img src="${entry.card_image}" alt="" class="h-[53px] rounded-md">
            </div>
            <p class="w-20 mt-2 text-center opacity-80 text-sm break-words">${entry.card_title}</p>
          </div>
          <div class="flex-grow pl-4">
            <h3 class="mb-2">${entry.title}</h3>
            <p class="leading-loose">${entry.intention}
            </p>
            ${entry.manifested ? `<p class="bg-accent text-black font-serif inline-flex gap-1 px-2 py-[5px] items-center rounded-md text-sm"><img class="h-3" src="${star}" alt=""> Manifested</p>` : ''}
          </div>
        </button>
      </li>
    `).join('');

    this.innerHTML = `
    <title-bar class="w-full" title="Entries" data-back-link="/tarot-index.html"></title-bar>
    <div class="w-full px-6 flex-1 flex items-start justify-center">
      <div class="flex-1">
        <ul class="">
          ${entriesHtml}
        </ul>
      </div>
    </div>
    `;

    htmx.process(this);

    document.querySelectorAll('.load-entry').forEach(button => {
      button.addEventListener('click', () => {
        Cookies.set('tarot-slug', button.getAttribute('data-slug'));
      });
    });
  }
}

customElements.define('tarot-entries', TarotEntries);