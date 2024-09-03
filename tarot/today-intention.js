import star from '@/assets/star.svg';

class TodayIntention extends HTMLElement {
  constructor() {
    super();
    this.nonce = '';
  }

  async getNonce() {
    const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=get_credentials`, {
        credentials: 'include'
    });
    const userInfo = await response.json();
    this.nonce = userInfo.nonce;
    return userInfo.nonce; // Extract nonce from user info
  }

  connectedCallback() {
    this.getNonce().then(nonce => {
      this.render();
      const todayCard = async () => {
        const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=today_card&_wpnonce=${nonce}`, { credentials: 'include' });
        return await response.json();
      }

      todayCard().then(card => {
        document.getElementById('card-title-text').textContent = card.card_title;
        document.getElementById('card-content').textContent = card.card_content;
        document.getElementById('card').setAttribute('src', card.card_image);

        hideLoadingScreen();
      });

      const manifestationStatus = async () => {
        const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=manifestation_status&_wpnonce=${nonce}`, { credentials: 'include' });
        return await response.json();
      }

      manifestationStatus().then(data => {
        if (data.manifested) {
          document.getElementById('record-manifestation').classList.add('hidden');
          document.getElementById('record-manifestation').classList.remove('flex');
          document.getElementById('manifested').classList.remove('hidden');
          document.getElementById('manifested').classList.add('inline-flex');
        }
      });

      const todayIntention = async () => {
        const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=intention&_wpnonce=${nonce}`, { credentials: 'include' });
        return await response.json();
      };

      todayIntention().then(json => {
        if (!json.intention) {
          document.getElementById('set-intention-button').classList.remove('hidden');
          document.getElementById('set-intention-button').classList.add('flex');
          document.getElementById('set-intention').classList.add('hidden');
        } else {
          document.getElementById('set-intention-button').classList.add('hidden');
          document.getElementById('intention-text').textContent = json.intention;
          document.getElementById('set-intention').classList.remove('hidden');
          document.getElementById('set-intention').classList.add('flex');
        }
      });
    });
  }

  render() {
    const recordManifestation = async (intention) => {
      await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=record_manifestation&_wpnonce=${this.nonce}`, { credentials: 'include' });
    }
    const todayDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    this.innerHTML = `
      <title-bar data-entries-link="/tarot-entries.html" data-settings-link="/tarot-settings.html" root="true" class="w-full" title="Today" subtitle="${todayDate}"></title-bar>
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
        <button id="set-intention-button" type="button" hx-target="#content" hx-get="/tarot-set-intention.html" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Set Intention</button>

        <div id="set-intention" class="hidden  flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
        <a hx-target="#content" hx-get="/tarot-set-intention.html" class="field flex flex-col items-center justify-between gap-2 w-full rounded-2xl text-center">
          <label class="label opacity-80 font-serif">Today's intention</label>
          <p class="text-lg" id="intention-text"></p>
        </a>
        <button type="button" id="record-manifestation" class="transition-opacity origin-top duration-1000 bg-brand text-lg font-serif text-white rounded-xl px-6 py-3">I Manifested This</button>
        <button type="button" id="manifested" class="hidden transition-opacity items-center justify-center gap-2 origin-top duration-1000 bg-accent text-black text-lg font-serif rounded-xl px-6 py-3"><img src="${star}" class="h-4 w-4" alt="" /> Manifested</button>
      </div>
      </div>
    `;
    htmx.process(this);
    document.getElementById('record-manifestation').addEventListener('click', async () => {
      recordManifestation().then(() => {
        window.location.reload();
      });
    });
  }
}

customElements.define('today-intention', TodayIntention);