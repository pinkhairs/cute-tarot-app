import { fetchWithAuth } from '@/auth'; // Ensure the path to fetchWithAuth is correct
import { Preferences } from '@capacitor/preferences';
import { trackEvent } from '@/logsnag';

class VisionBoardsEntry extends HTMLElement {
  constructor() {
    super();
    this.slug = null; // To store the slug extracted from Capacitor Preferences
    this.entry = null; // To store the fetched entry data
  }

  async connectedCallback() {
    const result = await Preferences.get({ key: 'board-slug' });
    this.slug = result.value;

    if (this.slug) {
      this.fetchPostBySlug(this.slug); // Fetch the post data using the slug
    }
  }

  async fetchPostBySlug(slug) {
    trackEvent('vision-boards', 'Vision board', '🔮', false, { slug });
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=vision_board&slug=${slug}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Failed to fetch the post');
      }

      this.entry = await response.json();
      this.render();
      hideLoadingScreen();
    } catch (error) {
      console.error('Error fetching vision board entry:', error);
      // Optionally, display an error message to the user
    }
  }

  render() {
    const title = this.entry.title;
    const images = this.entry.inspiration || [];
    const imagesHtml = images.map(image => `
      <img src="${image}" class="w-full rounded-xl h-auto" alt="">
    `).join('');

    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-index.html" data-settings-link="/vision-board-settings.html" class="w-full" title="${title}"></title-bar>
    <div class="px-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      ${imagesHtml}
    </div>
    <div class="h-4"></div>
    `;
  }
}

customElements.define('vision-boards-entry', VisionBoardsEntry);
