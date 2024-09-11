import { fetchWithAuth } from '@/auth';
import { Preferences } from '@capacitor/preferences';
import kawaiiCardBack from '@/assets/kawaii/kawaii-79.png';
import spoopyCardBack from '@/assets/spoopy/spoopy-79.png';

class DigitalIndex extends HTMLElement {
  constructor() {
    super();
    this.entries = [];
    this.data = '';
    this.placeCreateNew = null;
  }

  async connectedCallback() {
    this.getDeckPreference().then(async data => {
      this.deck = data;
      this.render();
      hideLoadingScreen();
    });
  }

  async getDeckPreference() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_deck_preference`)
    return await response.text();
  }

  render() {
    const entriesHtml = [];
    for (let i = 1; i <= 78; i++) {
      entriesHtml.push(`
        <button type="button" hx-target="#content" hx-get="/digital-entry.html" class="load-entry flex flex-col items-center">
          <img src="${this.deck !== 'Spoopy Tarot' ? kawaiiCardBack : spoopyCardBack}" alt="Pick a Card" class="rounded-xl">
        </button>
      `);
    }

    this.innerHTML = `
    <title-bar data-entries-link="/digital-entries.html" root="true" class="w-full mb-2" title="Digital Tarot" subtitle="Ask a question &amp; choose a card"></title-bar>
    <div class="grid grid-cols-3 items-center px-6 gap-4">
      ${entriesHtml.join('')}
    </div>
    `;

    htmx.process(this);
  }
}

customElements.define('digital-index', DigitalIndex);
