import { fetchWithAuth } from '@/auth'; // Ensure the path is correct
import { Preferences } from '@capacitor/preferences';

class VisionBoardsIndex extends HTMLElement {
  constructor() {
    super();
    this.entries = [];
    this.placeCreateNew = null;
  }

  async connectedCallback() {
    await this.fetchEntries(); // Fetch the entries when the component is connected
  }

  async fetchEntries() {
    try {
      // Fetch the vision boards entries using JWT authentication
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=vision_boards`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch vision boards entries');
      }
      this.entries = await response.json();

      // Fetch the position for creating a new board
      const createNewResponse = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=place_create_new`, { credentials: 'include' });
      if (!createNewResponse.ok) {
        this.placeCreateNew = 'first';
      } else {
        this.placeCreateNew = await createNewResponse.text();
      }

      this.render();
      hideLoadingScreen();
    } catch (error) {
      console.error('Error fetching vision boards:', error);
    }
  }

  render() {
    const entriesHtml = this.entries.map(entry => `
      <button type="button" hx-target="#content" hx-get="/vision-boards-entry.html" data-slug="${entry.slug}" class="load-entry flex flex-col items-center">
        <div class="text-2xl w-[72px] h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0 flex items-center justify-center rounded-xl bg-neutral text-black bg-cover bg-no-repeat bg-center" style="background-image: ${entry.icon.includes('//') ? `url(${entry.icon})` : `${entry.icon}`}">
        ${entry.icon.includes('//') ? '' : entry.firstCharacter}
        </div>
        <p class="w-[72px] lg:w-[96px] mt-2 text-center opacity-80 text-sm break-all">${entry.title}</p>
      </button>
    `).join('');

    this.innerHTML = `
    <title-bar data-settings-link="/vision-boards-settings.html" root="true" class="w-full mb-2" title="Vision Boards" subtitle="Dream it. See it. Feel it."></title-bar>
    <div class="grid grid-cols-4 px-6 gap-x-2 gap-y-4">
      ${this.placeCreateNew === 'first' ? `<button type="button" hx-target="#content" hx-get="/vision-boards-new.html" class="flex flex-col items-center">
        <div class="text-xl w-[72px] h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0 flex items-center justify-center rounded-xl bg-brand text-white font-serif">
        New
        </div>
        <p class="w-[72px] lg:w-[96px] mt-2 text-center opacity-80 text-sm break-words">Create New</p>
      </button>` : ''}
      ${entriesHtml}
      ${this.placeCreateNew === 'last' ? `<button type="button" hx-target="#content" hx-get="/vision-boards-new.html" class="flex flex-col items-center">
        <div class="text-2xl w-[72px] h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0 flex items-center justify-center rounded-xl bg-brand text-white font-serif">
        New
        </div>
        <p class="w-[72px] lg:w-[96px] mt-2 text-center opacity-80 text-sm break-words">Create New</p>
      </button>` : ''}
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

customElements.define('vision-boards-index', VisionBoardsIndex);
