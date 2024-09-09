import { fetchWithAuth } from '@/auth'; // Ensure this path is correct


class SetIntention extends HTMLElement {
  constructor() {
    super();
    this.ideas = [];
    this.index = 0;
  }

  getRandomIdea() {
    if (this.index === this.ideas.length - 1) {
      this.index = 0;
    } else {
      this.index++;
    }
    return this.ideas[this.index];
  }

  connectedCallback() {
    this.render();

    // Fetch today's card
    const todayCard = async () => {
      const todayInMonthNameDayCommaYear = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=today_card&title=${todayInMonthNameDayCommaYear}&${Date.now()}=${Date.now()}`);
      const json = await response.json();
      return json;
    };

    todayCard().then(card => {
      document.getElementById('card-title-text').textContent = card.card_title;
      document.getElementById('card-content').textContent = card.card_content;
      document.getElementById('card').setAttribute('src', card.card_image);
    });

    // Fetch today's intention
    const todayIntention = async () => {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=intention`, { credentials: 'include' });
      return await response.json();
    };

    todayIntention().then(data => {
      document.getElementById('intention-text').value = data.intention;
      this.ideas = data.inspired_actions.split(',');
    });

    hideLoadingScreen();
  }

  render() {
    const saveReading = async (intention) => {
      await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_reading&card=0&intention=${encodeURIComponent(intention)}`, { credentials: 'include' });
    };

    this.innerHTML = `
      <title-bar class="w-full" data-back-link="/tarot-index.html" title="Set Intention"></title-bar>
      <div class="w-full px-6 flex items-start justify-center">
        <img id="card" class="rounded-2xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-32 md:h-48 short:h-32 lg:h-48" alt="">
      </div>
      <div class="px-6 flex items-center justify-center gap-4 flex-col">
        <div class="text-center items-center justify-center">
          <h2 id="card-title-text"></h2>
        </div>
        <div class="text-center items-center justify-center">
          <p id="card-content"></p>
        </div>
        <form class=" flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
          <div class="field flex flex-col items-center justify-between gap-4 w-full rounded-2xl text-center">
            <label class="label opacity-80 font-serif">Today's intention</label>
            <textarea id="intention-text" placeholder="Type here" class="text-center focus:outline-none focus:text-black focus:bg-white w-full rounded-xl p-4 bg-transparent"></textarea>
                    <button type="button" class="inline-flex items-center gap-1">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
</svg>

<div class="opacity-80 font-serif text-sm" hx-get="/you-pentacles.html" hx-target="#content">Get 10 ideas = 1 pentacle</div>

</button>
          </div>
          <button id="save_intention" type="button" class="transition-opacity origin-top duration-1000 bg-brand text-lg font-serif text-white rounded-xl px-6 py-3">Save Intention</button>
        </form>
      </div>
    `;

    htmx.process(this);

    document.getElementById('save_intention').addEventListener('click', async () => {
      const intentionText = document.getElementById('intention-text').value;
      await saveReading(intentionText);
      htmx.ajax('GET', '/tarot-index.html', { target: '#content' });
    });
  }
}

customElements.define('set-intention', SetIntention);
