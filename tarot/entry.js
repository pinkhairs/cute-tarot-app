class TarotEntry extends HTMLElement {
  constructor() {
    super();
    this.slug = null; // To store the slug extracted from the URL
    this.entry = null; // To store the fetched entry data
  }

  connectedCallback() {
    this.extractSlugFromURL(); // Extract the slug from the current URL
    if (this.slug) {
      this.fetchPostBySlug(this.slug); // Fetch the post data using the slug
    }
  }

  extractSlugFromURL() {
    // Get the current URL
    const urlParams = new URLSearchParams(window.location.search);
    const slugParam = urlParams.get('id'); // In your URL, 'id' is used to pass the slug

    if (slugParam) {
      this.slug = slugParam;
    } else {
      console.error('No slug found in the URL');
    }
  }

  async fetchPostBySlug(slug) {
    const response = await fetch(`/pwa.php?action=tarot_entry&slug=${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch the post');
    }

    const posts = await response.json();
    this.entry = JSON.parse(posts)[0];
    this.render();
    hideLoadingScreen();
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
      return `${diffDays}d ago`; // Example: 2d ago
    } else {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks}w ago`; // Example: 1w ago
    }
  }

  render() {
    this.innerHTML = `
      <title-bar class="w-full" title="${this.getRelativeTime(this.entry.title)}" subtitle="${this.entry.title}"></title-bar>
      <div class="w-full px-6 flex items-start justify-center">
        <img src="${this.entry.card_image}" class="rounded-2xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-32 md:h-48 short:h-24 lg:h-48" alt="">
      </div>
      <div class="px-6 mt-8 short:mt-4 flex items-center justify-center gap-4 flex-col">
        <div class="text-center items-center justify-center">
          <h2>${this.entry.card_title}</h2>
        </div>
        <div class="text-center items-center justify-center">
          <p>${this.entry.card_content}</p>
        </div>
        <form class="flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
          <div class="field flex flex-col items-center justify-between gap-2 w-full rounded-2xl text-center">
            <label class="label opacity-80 font-serif">Today's intention</label>
            <p class="text-lg">${this.entry.intention ? this.entry.intention : '<span class="italic">None this day</span>'}</p>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('tarot-entry', TarotEntry);