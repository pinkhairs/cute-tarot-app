<script>
  import { onMount } from 'svelte';
  import fetchData from '@/src/fetchData.js';
  import TitleBar from '@/src/components/TitleBar.svelte';
  import { fade } from 'svelte/transition';
  import { push } from 'svelte-spa-router';
  import { loading } from '@/src/store.js';

  let kawaii = [];
  let spoopy = [];
  let selectedNumber = null;
  let selectedSuit = null;

  onMount(async () => {
    getTarotCards();
  });

  async function getTarotCards() {
    spoopy = await fetchData('history', { handle: 'spoopy-tarot-meaning', posts_per_page: 78 }, 'POST');
    kawaii = await fetchData('history', { handle: 'card-meaning', posts_per_page: 78 }, 'POST');
  }

  function getSuit(cardName) {
    if (cardName.includes('Pentacles')) return 'Pentacles';
    if (cardName.includes('Cups')) return 'Cups';
    if (cardName.includes('Wands')) return 'Wands';
    if (cardName.includes('Swords')) return 'Swords';
    return 'Major';
  }

  const filterCards = () => {
    const cards = document.querySelectorAll('.reference-card');
    cards.forEach(card => {
      const numberMatches = card.getAttribute('data-number-matches').includes(',') ? card.getAttribute('data-number-matches').split(','): [card.getAttribute('data-number-matches')];
      numberMatches.forEach((num, i) => {
        numberMatches[i] = parseInt(num);
      });

      const suit = card.getAttribute('data-suit');
      const nothingSelected = selectedNumber === null && selectedSuit === null;
      const numberMatchesSelected = numberMatches.includes(selectedNumber);
      const suitMatchSelected = suit === selectedSuit;
      const hiddenClasses = ['scale-x-0', 'max-w-0'];
      let showCard;

      if (selectedNumber !== null && selectedSuit !== null) {
        if (numberMatchesSelected && suitMatchSelected) {
          showCard = true;
        } else {
          showCard = false;
        }
      } else if (selectedNumber !== null && selectedSuit === null) {
        if (numberMatchesSelected) {
          showCard = true;
        } else {
          showCard = false;
        }
      } else if (selectedNumber === null && selectedSuit !== null) {
        if (suitMatchSelected) {
          showCard = true;
        } else {
          showCard = false;
        }
      } else if (nothingSelected) {
        showCard = true;
      }

      if (showCard) {
        card.classList.remove('hidden');
        hiddenClasses.map(className => card.classList.remove(className));

        setTimeout(() => {
        }, 500);
      } else {
        hiddenClasses.map(className => card.classList.add(className));

        setTimeout(() => {
          card.classList.add('hidden');
        }, 500);
      }
    });
  };

  function getNumbers(deckName, cardName) {
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
      'The Wheel of Fortune': 10,
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

    const deck = deckName === 'kawaii' ? kawaiiTarotCardNumbers : spoopyTarotCardNumbers;
    const cardNumber = deck[cardName];

    const digits = Array.from(new Set(String(cardNumber).split('').map(Number)));
    const combinations = digits.includes(cardNumber) ? digits : [...digits, cardNumber];

    return combinations.join(',');
  }

  function handleCardClick(cardId) {
    push('/reference-entry/' + cardId);
  }

</script>

<TitleBar title="Reference" />

<div class="flex flex-col gap-4 opacity-{$loading ? 0 : 100}">
  <div class="flex w-full gap-1 px-6">
    {#each Array(10) as _, number}
      <button class="number-filter {selectedNumber === number ? 'bg-accent text-black' : ''}  flex-1 aspect-square flex items-center text-sm justify-center rounded-full font-['Madimi_One']" on:click={() => {
        selectedNumber = selectedNumber === number ? null : number;
        filterCards();
      }}>
        {number}
      </button>
    {/each}
  </div>
  <div class="flex w-full gap-1 px-6">
    {#each ['Major', 'Pentacles', 'Cups', 'Wands', 'Swords'] as suit}
      <button class="suit-filter {selectedSuit === suit ? 'bg-accent text-black' : ''} px-2 py-1.5 flex items-center text-sm justify-center flex-1 rounded-xl font-['Madimi_One']" on:click={() => {
        selectedSuit = selectedSuit === suit ? null : suit;
        filterCards();
      }}>
        {suit}
      </button>
    {/each}
  </div>
</div>

<div class="flex flex-col gap-4 opacity-{$loading ? 0 : 100} overflow-x-hidden">
  <h2 class="px-6">Spoopy Tarot</h2>
  <div class="flex items-center justify-start gap-4 py-4 overflow-x-auto no-scrollbar px-6">
    {#each spoopy as card}
      <img
      in:fade={{ delay: 0, duration: 444 }}
      on:click={() => handleCardClick(card.id)}
      src={card.image} alt={card.title} class="reference-card w-24 short:w-16 short:rounded-lg rounded-2xl transition-all origin-left duration-500" data-number-matches={getNumbers('spoopy', card.title)} data-suit={getSuit(card.title)} />
    {/each}
  </div>

  <h2 class="px-6">Kawaii Tarot</h2>
  <div class="flex items-center justify-start gap-4 py-4 overflow-x-auto no-scrollbar px-6">
    {#each kawaii as card}
      <img
      in:fade={{ delay: 0, duration: 444 }} 
      on:click={() => handleCardClick(card.id)}
      src={card.image} alt={card.title} class="reference-card w-24 short:w-16 short:rounded-lg rounded-2xl transition-all origin-left duration-1000" data-number-matches={getNumbers('kawaii', card.title)} data-suit={getSuit(card.title)} />
    {/each}
  </div>
</div>
