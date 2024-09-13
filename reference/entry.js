import { Preferences } from '@capacitor/preferences';
import { fetchWithAuth } from '@/auth'; // Ensure the correct path is used


class ReferenceEntry extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.fetchPostBySlug(); // Fetch the post data using the slug
  }

  async fetchPostBySlug() {
    const getSlug = await Preferences.get({ key: 'reference-slug' });
    const slug = getSlug.value;
    const getDeck = await Preferences.get({ key: 'reference-deck' });
    const deck = getDeck.value;
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=reference_entry&slug=${slug}&deck=${deck}`);

    this.entry = await response.json();
    this.render();
    hideLoadingScreen();
  }

  render() {
    this.innerHTML = `
      <title-bar data-back-link="/reference-index.html" class="w-full" title="Card"></title-bar>
      <div class="px-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="flex flex-col items-center mb-4">
        <img src="${this.entry.image}" alt="${this.entry.title}" class="w-24 rounded-xl">
        <div class="h-4"></div>
        <h2 class="text-2xl font-semibold text-center mb-3">${this.entry.title}</h2>
      ${this.entry.content ? `<div>
        <p class="text-justify">${this.entry.content}</p>
      </div>` : ''}
    </div>
    <div class="h-4"></div>
    `;
  }
}

customElements.define('reference-entry', ReferenceEntry);
