class TarotCardReading extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    document.getElementById('flip-card-button').addEventListener('click', () => this.flipCard());
  }
  
  flipCard() {
    const card = document.getElementById('card');
    const flipCardButton = document.getElementById('flip-card-button');
    const cardInfo = document.getElementById('card-info');
    const cardDescription = document.getElementById('card-description');
    const cardTitle = document.getElementById('card-title');
    const setIntentionButton = document.getElementById('set-intention-button');
    card.classList.toggle('flipped');
    flipCardButton.classList.add('opacity-0');
    card.classList.add('duration-1000');
    
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
    <div class="flex flex-col w-full">
      <div class="card-container h-64 md:h-80 short:h-56 lg:h-64">
        <div id="card" class="card transition-all duration-1000 h-64 md:h-80 short:h-56 lg:h-64">
            <div class="card-face card-front">
                <img src="/assets/kt-back.png" class="rounded-3xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-64 md:h-80 short:h-56 lg:h-64" alt="Kawaii Tarot">
            </div>
            <div class="card-face card-back">
                <img src="/assets/kt-back.png" class="rounded-3xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-64 md:h-80 short:h-56 lg:h-64" alt="Kawaii Tarot">
            </div>
        </div>
      </div>
      <div class="flex mt-8 flex-col">
        <button id="flip-card-button" type="button" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-4 py-3">Get Reading</button>
        <div id="card-info" class="flex items-center justify-center gap-4 flex-col">
          <div id="card-title" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
            <h2>The Fool</h2>
          </div>
          <div id="card-description" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
            <p>Try a new adventure.</p>
          </div>
          <div id="set-intention-button" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
            <button hx-get="/tarot/set-intention.html" hx-trigger="click" hx-push-url="true" hx-target="#main" type="button" class="transition-opacity origin-top duration-1000 bg-brand text-lg font-serif text-white rounded-xl px-4 py-3">Set Intention</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define('tarot-card-reading', TarotCardReading);