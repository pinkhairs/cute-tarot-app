import { fetchWithAuth } from '@/auth';
import { Preferences } from '@capacitor/preferences';

class ReferenceIndex extends HTMLElement {
  constructor() {
    super();
    this.kawaii = [];
    this.spoopy = [];
  }

getSuit(cardName) {
  if (cardName.includes('Pentacles')) return 'Pentacles';
  if (cardName.includes('Cups')) return 'Cups';
  if (cardName.includes('Wands')) return 'Wands';
  if (cardName.includes('Swords')) return 'Swords';
  return 'Major';
}

// Main function to return card details
getNumbers(deckName, cardName) {
  const spoopyTarotCardNumbers = {
    'The Fool': 0, // Correct printed number
    'The Magician': 1,
    'The High Priestess': 2,
    'The Empress': 3,
    'The Emperor': 4,
    'The Hierophant': 5,
    'The Haunted House': 6,  // Assuming it's a custom card
    'The Chariot': 7,
    'Strength': 8,
    'The Hermit': 9,
    'Fortune': 10,
    'Justice': 11,
    'The Bat': 12,           // Custom card
    'Death': 13,
    'Temperance': 14,
    'The Devil': 15,
    'The Tower': 16,
    'The Star': 17,
    'The Night': 18,         // Custom card
    'The Full Moon': 19,     // Custom card
    'Judgement': 20,
    'The World': 21,
    // Minor Arcana: Pentacles
    'Ace of Pentacles': 1,
    'Two of Pentacles': 2,
    'Three of Pentacles': 3,
    'Four of Pentacles': 4,
    'Five of Pentacles': 5,
    'Six of Pentacles': 6,
    'Seven of Pentacles': 7,
    'Eight of Pentacles': 8,
    'Nine of Pentacles': 9,
    'Ten of Pentacles': 10,
    'Page of Pentacles': 11,
    'Knight of Pentacles': 12,
    'Queen of Pentacles': 13,
    'King of Pentacles': 14,
    // Minor Arcana: Cups
    'Ace of Cups': 1,
    'Two of Cups': 2,
    'Three of Cups': 3,
    'Four of Cups': 4,
    'Five of Cups': 5,
    'Six of Cups': 6,
    'Seven of Cups': 7,
    'Eight of Cups': 8,
    'Nine of Cups': 9,
    'Ten of Cups': 10,
    'Page of Cups': 11,
    'Knight of Cups': 12,
    'Queen of Cups': 13,
    'King of Cups': 14,
    // Minor Arcana: Wands
    'Ace of Wands': 1,
    'Two of Wands': 2,
    'Three of Wands': 3,
    'Four of Wands': 4,
    'Five of Wands': 5,
    'Six of Wands': 6,
    'Seven of Wands': 7,
    'Eight of Wands': 8,
    'Nine of Wands': 9,
    'Ten of Wands': 10,
    'Page of Wands': 11,
    'Knight of Wands': 12,
    'Queen of Wands': 13,
    'King of Wands': 14,
    // Minor Arcana: Swords
    'Ace of Swords': 1,
    'Two of Swords': 2,
    'Three of Swords': 3,
    'Four of Swords': 4,
    'Five of Swords': 5,
    'Six of Swords': 6,
    'Seven of Swords': 7,
    'Eight of Swords': 8,
    'Nine of Swords': 9,
    'Ten of Swords': 10,
    'Page of Swords': 11,
    'Knight of Swords': 12,
    'Queen of Swords': 13,
    'King of Swords': 14
};

const kawaiiTarotCardNumbers = {
  'The Fool': 0,
  'The Magician': 1,
  'The High Priestess': 2,
  'The Empress': 3,
  'The Emperor': 4,
  'The Hierophant': 5,
  'The Lovers': 6,
  'The Chariot': 7,
  'Strength': 8,
  'The Hermit': 9,
  'Wheel of Fortune': 10,
  'Justice': 11,
  'The Hanged Man': 12,
  'Death': 13,
  'Temperance': 14,
  'The Devil': 15,
  'The Tower': 16,
  'The Star': 17,
  'The Moon': 18,
  'The Sun': 19,
  'Judgement': 20,
  'The World': 21,
  // Minor Arcana: Pentacles
  'Ace of Pentacles': 1,
  'Two of Pentacles': 2,
  'Three of Pentacles': 3,
  'Four of Pentacles': 4,
  'Five of Pentacles': 5,
  'Six of Pentacles': 6,
  'Seven of Pentacles': 7,
  'Eight of Pentacles': 8,
  'Nine of Pentacles': 9,
  'Ten of Pentacles': 10,
  'Page of Pentacles': 11,
  'Knight of Pentacles': 12,
  'Queen of Pentacles': 13,
  'King of Pentacles': 14,
  // Minor Arcana: Cups
  'Ace of Cups': 1,
  'Two of Cups': 2,
  'Three of Cups': 3,
  'Four of Cups': 4,
  'Five of Cups': 5,
  'Six of Cups': 6,
  'Seven of Cups': 7,
  'Eight of Cups': 8,
  'Nine of Cups': 9,
  'Ten of Cups': 10,
  'Page of Cups': 11,
  'Knight of Cups': 12,
  'Queen of Cups': 13,
  'King of Cups': 14,
  // Minor Arcana: Wands
  'Ace of Wands': 1,
  'Two of Wands': 2,
  'Three of Wands': 3,
  'Four of Wands': 4,
  'Five of Wands': 5,
  'Six of Wands': 6,
  'Seven of Wands': 7,
  'Eight of Wands': 8,
  'Nine of Wands': 9,
  'Ten of Wands': 10,
  'Page of Wands': 11,
  'Knight of Wands': 12,
  'Queen of Wands': 13,
  'King of Wands': 14,
  // Minor Arcana: Swords
  'Ace of Swords': 1,
  'Two of Swords': 2,
  'Three of Swords': 3,
  'Four of Swords': 4,
  'Five of Swords': 5,
  'Six of Swords': 6,
  'Seven of Swords': 7,
  'Eight of Swords': 8,
  'Nine of Swords': 9,
  'Ten of Swords': 10,
  'Page of Swords': 11,
  'Knight of Swords': 12,
  'Queen of Swords': 13,
  'King of Swords': 14
};
let deck;
if (deckName === 'spoopy') {
    deck = spoopyTarotCardNumbers;
} else if (deckName === 'kawaii') {
    deck = kawaiiTarotCardNumbers;
} else {
    return 'Invalid deck name';
}

const cardNumber = deck[cardName];
if (cardNumber === undefined) {
    return 'Card not found';
}

// Extract individual digits without redundancy
const digits = Array.from(new Set(String(cardNumber).split('').map(Number)));

// Combine digits and full number, avoiding redundancy
const combinations = digits.includes(cardNumber) ? digits : [...digits, cardNumber];

return combinations.join(',');
}

  async getKawaiiTarotCards() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=kawaii_tarot`);
    this.kawaii = await response.json();
    await this.getSpoopyTarotCards();
    this.render();
    hideLoadingScreen();
  }

  connectedCallback() {
    this.getKawaiiTarotCards();
  }

  async getSpoopyTarotCards() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=spoopy_tarot`);
    this.spoopy = await response.json();
  }

  render() {
    const width = 78 * 64 + 77 * 8 + 6;
    this.innerHTML = `
     <title-bar root="true" class="w-full" title="Reference"></title-bar>
      <div id="numbers" class="flex w-full gap-1 px-6 pt-1.5">
        ${[...Array(10).keys()].map(number => `
          <button data-number="${number}" class="number-filter bg-neutral flex-1 aspect-square flex items-center text-sm justify-center rounded-full font-['Madimi_One']">${number}</button>
        `).join('')}
      </div>
      <div id="suits" class="flex w-full gap-1 px-6 pt-1.5">
        ${['Major', 'Pentacles', 'Cups', 'Wands', 'Swords'].map(suit => `
          <button data-suit="${suit}" class="suit-filter bg-neutral px-2 py-1.5 flex items-center text-sm justify-center flex-1 rounded-xl font-['Madimi_One']">${suit}</button>
        `).join('')}
      </div>



     <h2 class="text-center px-6 pt-4 pb-2">Kawaii Tarot</h2>
     <div class="scrollbar w-screen overflow-x-scroll">
     <div class="flex max-w-none gap-2 pl-6 pr-2">
      ${this.kawaii.map((item) => `
        <button data-slug="${item.slug}" data-deck="kawaii" class="card-reference transition-all origin-left duration-1000  w-28 short:w-16" type="button">
          <img class="h-auto inline-block max-w-none rounded-xl w-28 short:w-16" data-number-matches="${this.getNumbers('kawaii', item.name)}" data-suit="${this.getSuit(item.name)}" src="${item.image}" />
        </button>
      `).join('')}
     </div>
     </div>
     <h2 class="text-center px-6 pb-2">Spoopy Tarot</h2>
     <div class="scrollbar w-screen overflow-x-scroll">
     <div class="flex max-w-none gap-2 pl-6 pr-2">
      ${this.spoopy.map((item) => `
        <button data-slug="${item.slug}" data-deck="spoopy" class="card-reference transition-all origin-left duration-1000 w-28 short:w-16" type="button">
          <img class="h-auto inline-block max-w-none rounded-xl w-28 short:w-16" data-number-matches="${this.getNumbers('spoopy', item.name)}" data-suit="${this.getSuit(item.name)}" src="${item.image}" />
        </button>
      `).join('')}
      </div>
     </div>
     `;

     document.querySelectorAll('.card-reference').forEach(card => {
      card.addEventListener('click', async () => {
        await Preferences.set({ key: 'reference-slug', value: card.getAttribute('data-slug') });
        await Preferences.set({ key: 'reference-deck', value: card.getAttribute('data-deck') });
        htmx.ajax('GET', '/reference-entry.html', '#content');
      });
    });

     // Add event listeners for filters
    const numberButtons = document.querySelectorAll('.number-filter');
    const suitButtons = document.querySelectorAll('.suit-filter');
    const cards = document.querySelectorAll('.card-reference');

    let selectedNumber = null;
    let selectedSuit = null;

    // Filter function
    const filterCards = () => {
      cards.forEach(card => {
        const numberMatches = card.getAttribute('data-number-matches').split(',');
        const suit = card.getAttribute('data-suit');
        const nothingSelected = !selectedNumber && !selectedSuit;
        const numberMatchesSelected = numberMatches.includes(selectedNumber);
        const suitMatchesSelected = suit === selectedSuit;
        let showCard = false;
        
        if (nothingSelected) {
          showCard = true;
        } else if (selectedNumber && selectedSuit) {
          showCard = true;
        } else if (numberMatchesSelected && !selectedSuit) {
          showCard = true;
        } else if (suitMatchesSelected && !selectedNumber) {
          showCard = true;
        } else {
          showCard = false;
        }

        if (selectedSuit && selectedNumber) {
          if (numberMatchesSelected && suitMatchesSelected) {
            showCard = true;
          } else {
            showCard = false;
          }
        }

        if (showCard) {
          card.classList.remove('max-w-0');
          card.classList.remove('scale-x-0');
          card.classList.remove('opacity-0');
          card.classList.add('max-w-full');
          card.classList.add('scale-x-100');
          card.classList.add('opacity-1');

          setTimeout(() => {
            card.classList.remove('hidden');
            card.classList.add('inline-block');
          }, 1000);
        } else {
          card.classList.add('max-w-0');
          card.classList.add('scale-x-0');
          card.classList.add('opacity-0');
          card.classList.remove('max-w-full');
          card.classList.remove('scale-x-100');
          card.classList.remove('opacity-1');
          setTimeout(() => {
            card.classList.add('hidden');
            card.classList.remove('inline-block');
          }, 1000);
        }
      });
    };
    

    // Toggle the background color for active/inactive state
    const toggleActiveButton = (buttons, selectedAttribute, selectedValue) => {
      buttons.forEach(button => {
        const buttonValue = button.getAttribute(selectedAttribute);
        if (buttonValue === selectedValue) {
          button.classList.remove('bg-neutral');
          button.classList.add('bg-accent');
        } else {
          button.classList.remove('bg-accent');
          button.classList.add('bg-neutral');
        }
      });
    };

    // Add click listeners for number buttons
    numberButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const number = e.target.getAttribute('data-number');
        selectedNumber = number === selectedNumber ? null : number; // Toggle number filter
        toggleActiveButton(numberButtons, 'data-number', selectedNumber);
        filterCards();
      });
    });

    // Add click listeners for suit buttons
    suitButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const suit = e.target.getAttribute('data-suit');
        selectedSuit = suit === selectedSuit ? null : suit; // Toggle suit filter
        toggleActiveButton(suitButtons, 'data-suit', selectedSuit);
        filterCards();
      });
    });
  }
}

customElements.define('reference-index', ReferenceIndex);
