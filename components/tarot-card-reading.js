class TarotCardReading extends HTMLElement {
  constructor() {
    super();
    this.card = '';
    this.cardId = null;
  }

  async getNonce() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_credentials`, {
        credentials: 'include'
    });
    const userInfo = await response.json();
    return userInfo.nonce; // Extract nonce from user info
  }

  connectedCallback() {
    this.getNonce().then(nonce => {
      this.render();

      document.getElementById('flip-card-button').addEventListener('click', () => this.flipCard(nonce));
  
      const deck = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_deck_preference&_wpnonce=${nonce}`, { credentials: 'include' });
        if (!response.ok) throw new Error('Network response was not ok.');
        return await response.text();
      }

      deck().then(data => {
        if (data !== 'Spoopy Tarot') {
          this.card = `${import.meta.env.VITE_API_BASE_URL}/wp-content/uploads/2024/08/kawaii-79.png`;
        } else {
          this.card = `${import.meta.env.VITE_API_BASE_URL}/wp-content/uploads/2024/08/spoopy-79.png`;
        }
  
        document.getElementById('card-back').setAttribute('src', this.card);
        hideLoadingScreen();
      });
    });
   }
  
  async flipCard(nonce) {
    const flipCardButton = document.getElementById('flip-card-button');

    const quantumPick = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=quantum_pick&_wpnonce=${nonce}`, { credentials: 'include' });
      const data = await response.json();
      return data;
    }

    const saveReading = async (cardId) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_reading&card=${cardId}&_wpnonce=${nonce}`, { credentials: 'include' });
      const data = await response.json();
      return data;
    }

    flipCardButton.classList.add('opacity-0');

    await quantumPick().then(card => {
      document.getElementById('card-info').classList.remove('-z-20');
      document.getElementById('card-title-text').textContent = card.card_title;
      document.getElementById('card-content').textContent = card.card_content;
      document.getElementById('card-image').setAttribute('src', card.card_image);
      saveReading(card.card_id);
    });

    const card = document.getElementById('card');
    const cardDescription = document.getElementById('card-description');
    const cardTitle = document.getElementById('card-title');
    const setIntentionButton = document.getElementById('set-intention-button');
    card.classList.toggle('flipped');
    card.classList.add('duration-1000');
    flipCardButton.classList.add('opacity-0');
    
    setTimeout(() => {
      flipCardButton.classList.add('hidden');
      cardTitle.classList.remove('opacity-0');
    }, 1000);
    setTimeout(() => {
    }, 2000);
    setTimeout(() => {
      cardDescription.classList.remove('opacity-0');
    }, 2000);
    setTimeout(() => {
      setIntentionButton.classList.remove('opacity-0');
    }, 3000);
  }

  render() {
    this.innerHTML = `
    <div class="flex flex-col gap-4 md:gap-6  w-full">
      <div class="w-full card-container h-64 md:h-80 short:h-56 lg:h-64 xl:h-80">
        <div id="card" class="card transition-all duration-1000 h-64 md:h-80 short:h-56 lg:h-64 xl:h-80">
            <div class="card-face card-front">
              <img src="${this.card}" id="card-back" class="rounded-3xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-64 md:h-80 short:h-56 lg:h-64 xl:h-80" alt="">
            </div>
            <div class="card-face card-back">
              <img src="${this.card}" id="card-image" class="rounded-3xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-64 md:h-80 short:h-56 lg:h-64 xl:h-80" alt="">
            </div>
        </div>
      </div>
      <div class="flex flex-col">
        <button id="flip-card-button" type="button" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Get Reading</button>
        <div id="card-info" class="flex -z-20 items-center justify-center gap-4 flex-col">
          <div id="card-title" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
            <h2 id="card-title-text">The Fool</h2>
          </div>
          <div id="card-description" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
            <p id="card-content">Try a new adventure.</p>
          </div>
          <div id="set-intention-button" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
            <button type="button" hx-target="#content" hx-get="/tarot-set-intention.html" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Set Intention</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define('tarot-card-reading', TarotCardReading);