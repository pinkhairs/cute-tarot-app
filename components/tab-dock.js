import { fetchWithAuth } from '@/auth'; // Use fetchWithAuth from your auth module
import today from '@/assets/today.png';
import visionBoards from '@/assets/vision-boards.png';
import readings from '@/assets/readings.png';

class TabDock extends HTMLElement {
  constructor() {
    super();
    this.avatar = '';
  }

  async getAvatar() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_avatar`);
    if (response && response.ok) {
      const avatarText = await response.text();
      return avatarText;
    } else {
      console.error('Failed to get avatar:', response.status, response.statusText);
      return '';  // Return empty string if there's an error
    }
  }

  connectedCallback() {
    this.getAvatar()
      .then(avatar => {
        this.avatar = avatar;
        this.render();
      })
      .catch(error => {
        console.error('Error during connectedCallback:', error.message);
      });
  }

  render() {
    this.innerHTML = `
      <div hx-sync="this:replace last" class="w-max p-3 grid grid-cols-4 backdrop-blur-md bg-[rgba(255,255,255,.85)] shadow-[0_0_40px_-8px_rgba(85,123,193,0.2)] items-center rounded-3xl h-24 justify-center gap-2">
        <div class="flex items-center">
          <button type="button" hx-get="/tarot-index.html" hx-target="#content">
            <img src="${today}" alt="Today" class="rounded-xl h-16">
          </button>
        </div>
        <div class="flex items-center">
          <button type="button" hx-get="/readings-index.html" hx-target="#content">
            <img src="${readings}" alt="Readings" class="rounded-xl h-16">
          </button>
        </div>
        <div class="flex items-center">
          <button type="button" hx-get="/vision-boards-index.html" hx-target="#content">
            <img src="${visionBoards}" alt="Vision Boards" class="rounded-xl h-16">
          </button>
        </div>
        <div class="flex items-center">
          <button id="avatar" class="rounded-xl w-16 h-16 bg-cover bg-center bg-no-repeat" type="button" hx-get="/you-index.html" hx-target="#content" style="background-image: url(${this.avatar})">
          </button>
        </div>
      </div>
    `;

    htmx.process(this); // Re-process the current HTML element with htmx
  }
}

customElements.define('tab-dock', TabDock);
