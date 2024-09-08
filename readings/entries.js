import { Preferences } from '@capacitor/preferences';
import { fetchWithAuth } from '@/auth'; // Ensure the correct path is used
import { trackEvent } from '@/logsnag';

class ReadingsEntries extends HTMLElement {
  constructor() {
    super();
    this.entries = [];
  }
  
  connectedCallback() {
    this.fetchEntries();
  }

  async fetchEntries() {
    try {
      trackEvent('reading-readings', 'View entries', '🃏');
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=reading_entries`);
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      this.entries = await response.json();
      this.render();
      hideLoadingScreen();
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  render() {
    const getFirstSentence = text => (text.match(/[^.!?]*[.!?]/) || [''])[0].trim();
    const entriesHtml = this.entries.map(entry => `
      <li class="flex pb-4 mb-4">
        <button type="button" hx-target="#content" hx-get="/reading-entry.html" class="load-entry text-left flex items-center" data-slug="${entry.slug}">
          <div>
            <div class="w-20 h-20 p-4  flex-shrink-0 flex items-center justify-center rounded-xl bg-translucent">
              <img src="${entry.image}" alt="" class="h-[53px] rounded-md">
            </div>
          </div>
          <div class="flex-grow pl-4">
            <h3 class="mb-2">${entry.date}</h3>
            <p>${getFirstSentence(entry.content)}</p>
          </div>
        </button>
      </li>
    `).join('');

    this.innerHTML = `
    <title-bar class="w-full" title="Entries" data-back-link="/readings-index.html"></title-bar>
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
      button.addEventListener('click', async () => {
        await Preferences.set({
          key: 'reading-slug',
          value: button.dataset.slug
      });
      });
    });
  }
}

customElements.define('readings-entries', ReadingsEntries);
