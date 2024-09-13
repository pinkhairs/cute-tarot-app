import { fetchWithAuth } from '@/auth'; // Ensure the path to fetchWithAuth is correct
import { Preferences } from '@capacitor/preferences';


class DigitalEntry extends HTMLElement {
  constructor() {
    super();
    this.slug = null; // To store the slug extracted from Capacitor Preferences
    this.entry = null; // To store the fetched entry data
    this.title = null; // To store the fetched entry data
    this.today = null; // To store the fetched entry data
    this.pentacles = null;
  }

  async connectedCallback() {
    this.getPentacles().then(async data => {
      this.pentacles = data;
      const result = await Preferences.get({ key: 'digital-slug' });
      this.slug = result.value;

      this.fetchPostBySlug(this.slug); // Fetch the post data using the slug
    });
  }

  async getPentacles() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_pentacles`);
    return await response.text();
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

  async fetchPostBySlug(slug) {
    try {
      // localized date September 10, 2024
      this.today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=digital_reading&slug=${slug ? slug : `&today=${this.today}`}`);

      this.entry = await response.json();
      this.title = slug ? this.getRelativeTime(this.entry.title) : 'Today';

      this.render();

      Preferences.set({
        key: 'digital-slug',
        value: ''
      });
      hideLoadingScreen();
    } catch (error) {
      console.error('Error fetching digital tarot entry:', error);
      // Optionally, display an error message to the user
    }
  }

  render() {
    this.innerHTML = `
    <title-bar root="true" data-back-link="${this.slug ? '/digital-entries.html' : '/digital-index.html'}" class="w-full" title="${this.title}" subtitle="${this.entry.title ? this.entry.title : this.today}"></title-bar>
    <div class="px-6 grid grid-cols-1 gap-2 md:grid-cols-2">
      <div class="flex flex-col items-center">
        <img src="${this.entry.card_image}" alt="${this.title}" class="w-24 rounded-xl">
        <h2 class="text-2xl font-semibold text-center mt-4 mb-2">${this.entry.card_name}</h2>
        <p class="text-lg text-center">${this.entry.card_content}</p>
      </div>
      <form class="flex flex-col items-center justify-between p-4 bg-translucent gap-3 w-full rounded-2xl text-center mt-4">
        <div class="field flex flex-col items-center justify-between gap-3 w-full rounded-2xl text-center">
          <label class="label opacity-80 font-serif">Question</label>
          <textarea id="question" name="question" placeholder="Type here" class="text-center focus:outline-none focus:bg-white transition-colors h-16 w-full rounded-xl p-3 bg-transparent">${this.entry.question ? this.entry.question : ''}</textarea>
        </div>
      </form>
      <div class="mt-4 flex flex-col items-center justify-center gap-2">
      ${this.entry.reading ? `<h2 class="mb-2">Reading</h2><p>${this.entry.reading}</p>` : `
      <h3>Get a reading</h3>
      <button type="button" class="mt-4 inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
          </svg>
        <div class="opacity-80 font-serif text-sm" hx-get="/you-pentacles.html" hx-target="#content">You will spend 1 pentacle</div>
      </button>
      <button type="button" id="${this.pentacles > 0 ? 'get-reading' : 'no-pentacles'}" class="w-max mx-auto mt-4 transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Go</button>
      `}
    </div>
    <div class="h-4"></div>
    </div>
    `;
    
    if (!this.entry.reading) {
      if (this.pentacles > 0) {
    document.getElementById('get-reading').addEventListener('click', async () => {
      showLoadingScreen();
      const formData = new FormData();
      formData.append('question', this.entry.question);
      formData.append('card', this.entry.card_name);
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_reading&slug=${this.slug}`, {
        method: 'POST',
        body: formData,
      }, false);
      const result = await response.text();

      Preferences.set({
        key: 'digital-slug',
        value: result
      });

      htmx.ajax('GET', '/digital-entry.html', '#content');
    });
  }
}
 if (this.pentacles <= 0 && !this.entry.reading) {
  document.getElementById('no-pentacles').addEventListener('click', async () => {
    if (confirm('You need 1 more pentacle to get a reading. Click OK to purchase.') === true) {
      htmx.ajax('GET', '/you-pentacles.html', '#content');
    }
  });
}

    document.getElementById('question').addEventListener('blur', async (event) => {
      const question = event.target.value;
      const formData = new FormData();
      formData.append('question', question);
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_digital_question&slug=${this.slug}`, {
        method: 'POST',
        body: formData,
      }, false);

      if (!response.ok) {
        console.error('Failed to save question');
      }
    });
  }
}

customElements.define('digital-entry', DigitalEntry);
