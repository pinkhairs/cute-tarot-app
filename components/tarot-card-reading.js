class TarotCardReading extends HTMLElement {
  constructor() {
    super();
    this.card = '';
    this.cardId = null;
  }

  connectedCallback() {
    this.render();

    document.getElementById('flip-card-button').addEventListener('click', this.flipCard);

    const deck = async () => {
      const response = await fetch(`/pwa.php?action=get_deck`);
      return await response.json();
    }

    deck().then(data => {
      if (JSON.parse(data).deck === 'Spoopy Tarot') {
        this.card = 'https://cutetarot.com/wp-content/uploads/2024/08/spoopy-79.png';
      } else {
        this.card =' https://cutetarot.com/wp-content/uploads/2024/08/kawaii-79.png';
      }

      document.getElementById('card-back').setAttribute('src', this.card);
      hideLoadingScreen();
    });
   }
  
  async flipCard() {
    const flipCardButton = document.getElementById('flip-card-button');

    const quantumPick = async () => {
      const response = await fetch(`/pwa.php?action=quantum_pick`);
      const data = await response.json();
      return data;
    }

    const saveReading = async (cardId) => {
      const response = await fetch(`/pwa.php?action=save_reading&card=${cardId}`);
      const data = await response.json();
      return data;
    }

    flipCardButton.classList.add('opacity-0');

    await quantumPick().then(data => {
      const card = JSON.parse(data);
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
            <a href="/app/tarot/set-intention.html" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Set Intention</a>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define('tarot-card-reading', TarotCardReading);