import { fetchWithAuth } from '@/auth'; // Ensure the path is correct
import { Preferences } from '@capacitor/preferences';


class VisionBoardEntries extends HTMLElement {
  constructor() {
    super();
    this.entries = [];
  }

  async connectedCallback() {
    await this.fetchEntries();
  }

  async fetchEntries() {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=vision_boards`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      this.entries = await response.json();
      this.render();
      hideLoadingScreen();
    } catch (error) {
      console.error('Error fetching vision board entries:', error);
    }
  }

  render() {
    const entriesHtml = this.entries.map(entry => `
      <li class="flex break-all pb-4 mb-4">
        <button type="button" hx-target="#content" hx-get="/vision-boards-entry.html" data-slug="${entry.slug}" class="load-entry flex text-left items-center">
          <div>
            <div class="w-20 h-20 p-4  flex-shrink-0 flex items-center justify-center rounded-xl bg-neutral bg-cover bg-no-repeat bg-center" style="background-image: ${entry.icon.includes('//') ? `url(${entry.icon})` : `${entry.icon}`}">
            ${entry.icon.includes('//') ? '' : entry.firstCharacter}
            </div>
          </div>
          <div class="flex-grow pl-4">
            <h3 class="mb-2 break-all">${entry.title}</h3>
            <p class="leading-relaxed">${entry.imageCount} images</p>
            <p class="leading-relaxed opacity-80 text-sm">Created ${entry.created}</p>
          </div>
        </button>
      </li>
    `).join('');

    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-index.html" class="w-full" title="Entries"></title-bar>
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
        // Save the slug to Capacitor Preferences instead of using cookies
        await Preferences.set({
          key: 'board-slug',
          value: button.getAttribute('data-slug')
        });
      });
    });
  }
}

customElements.define('vision-board-entries', VisionBoardEntries);
