import star from '@/assets/star.svg';
import { Preferences } from '@capacitor/preferences';
import { fetchWithAuth } from '@/auth'; // Ensure the correct path is used


class TarotEntry extends HTMLElement {
  constructor() {
    super();
    this.entry = null; // To store the fetched entry data
  }

  connectedCallback() {
    this.fetchPostBySlug(); // Fetch the post data using the slug
  }

  async fetchPostBySlug() {
    const getSlug = await Preferences.get({ key: 'tarot-slug' });
    const slug = getSlug.value;
    const todayInMonthNameDayCommaYear = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=tarot_entry&slug=${slug}&today=${todayInMonthNameDayCommaYear}`);
    if (!response.ok) {
      throw new Error('Failed to fetch the post');
    }

    const posts = await response.json();
    this.entry = posts[0];
    this.render();
  }

  getRelativeTime(dateString) {
    // Parse the input date string into a Date object
    const inputDate = new Date(dateString);
    const currentDate = new Date();
  
    // Calculate the difference in time between the input date and the current date
    const diffTime = currentDate - inputDate; // Difference in milliseconds
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Difference in days
  
    // Determine the relative time string based on the difference in days
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 28) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} weeks ago`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} months ago`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return `${diffYears} years ago`;
    }
  }

  render() {
    this.innerHTML = `
      <title-bar data-back-link="/tarot-entries.html" class="w-full" title="${this.getRelativeTime(this.entry.title)}" subtitle="${this.entry.title}"></title-bar>
      <div class="w-full px-6 flex items-start justify-center">
        <img src="${this.entry.card_image}" class="rounded-2xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-32 md:h-48 short:h-24 lg:h-48" alt="">
      </div>
      <div class="px-6 flex items-center justify-center gap-4 flex-col">
        <div class="text-center items-center justify-center">
          <h2>${this.entry.card_title}</h2>
        </div>
        <div class="text-center items-center justify-center">
          <p>${this.entry.card_content}</p>
        </div>
        <form class="flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
          <div class="field flex flex-col items-center justify-between gap-4 w-full rounded-2xl text-center">
            <label class="label opacity-80 font-serif">Today's intention</label>
            <p class="text-lg">${this.entry.intention ? this.entry.intention : '<span class="italic">None this day</span>'}</p>
            ${this.entry.manifested ? `<p class="bg-accent text-black font-serif inline-flex gap-1 px-2 py-[5px] items-center rounded-md text-sm"><img class="h-3" src="${star}" alt=""> Manifested</p>` : ''}
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('tarot-entry', TarotEntry);
