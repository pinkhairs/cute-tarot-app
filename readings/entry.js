import { Preferences } from '@capacitor/preferences';
import { fetchWithAuth } from '@/auth';


class ReadingsEntry extends HTMLElement {
  constructor() {
    super();
    this.entry = null; // To store the fetched entry data
  }

  connectedCallback() {
    const getSlug = Preferences.get({ key: 'reading-slug' });
    getSlug.then((value) => {
      this.fetchPostBySlug(value.value);
    });
  }

  async fetchPostBySlug(slug) {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=reading_entry&id=${slug}`);
    this.entry = await response.json();
    this.render();
  }

  render() {
    this.innerHTML = `
      <title-bar data-back-link="/readings-index.html" class="w-full" title="Tarot" subtitle="${this.entry.date}"></title-bar>
      <div class="w-full px-6 flex items-start justify-center">
        <img src="${this.entry.image}" class="rounded-2xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-32 md:h-48 short:h-24 lg:h-48" alt="">
      </div>
      <div class="px-6 pt-4 flex items-center justify-center gap-4 flex-col">
        <div class="text-center items-center justify-center">
          <h2>Reading</h2>
        </div>
        <form class="flex flex-col items-center justify-between pb-4 bg-translucent gap-4 w-full rounded-2xl">
          <div class="field flex flex-col items-start justify-between gap-4 w-full rounded-2xl text-left">
            <p>${this.entry.content}</p>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('readings-entry', ReadingsEntry);
