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
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=today_card`, { credentials: 'include' });
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
            ${this.ideas.length ? `<button type="button" class="text-brand font-bold" id="random-idea">Try a suggestion</button>` : ''}
          </div>
          <button id="save_intention" type="button" class="transition-opacity origin-top duration-1000 bg-brand text-lg font-serif text-white rounded-xl px-6 py-3">Save Intention</button>
        </form>
      </div>
    `;

    document.getElementById('save_intention').addEventListener('click', async () => {
      const intentionText = document.getElementById('intention-text').value;
      await saveReading(intentionText);
      window.location.reload();
    });

    if (this.ideas.length) {
      document.getElementById('random-idea').addEventListener('click', () => {
        const randomIdea = this.getRandomIdea();
        document.getElementById('intention-text').value = randomIdea;
      });
    }
  }
}

customElements.define('set-intention', SetIntention);
