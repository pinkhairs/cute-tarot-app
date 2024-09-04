import { getToken } from '@/auth'; // adjust the path as necessary
import today from '@/assets/today.png';
import visionBoards from '@/assets/vision-boards.png';

class TabDock extends HTMLElement {
  constructor() {
    super();
    this.avatar = '';
  }

  async getAvatar() {
    const token = await getToken(); // Retrieve the JWT from storage
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_avatar`, {
      headers: {
        'Authorization': `Bearer ${token}` // Use the JWT in the Authorization header
      },
      credentials: 'include' // Ensure credentials are included if needed for session handling
    });
    if (!response.ok) {
      throw new Error('Failed to fetch avatar.');
    }
    return await response.text();
  }

  connectedCallback() {
    this.getAvatar().then(avatar => {
      this.avatar = avatar;
      this.render();
    }).catch(error => {
      console.error('Error fetching avatar:', error.message);
      // Handle errors or set a default avatar image if needed
    });
  }

  render() {
    this.innerHTML = `
      <div class="w-max p-3 grid grid-cols-3 backdrop-blur-md bg-[rgba(255,255,255,.85)] shadow-[0_0_40px_-8px_rgba(85,123,193,0.2)] items-center rounded-3xl h-24 justify-center gap-2">
        <div class="flex items-center">
          <button type="button" hx-get="/tarot-index.html" hx-target="#content">
            <img src="${today}" alt="Today" class="rounded-xl h-16">
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
