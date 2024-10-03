<script>
  import kawaii from '@/assets/kawaii/kawaii-79.png';
  import spoopy from '@/assets/spoopy/spoopy-79.png';
  import { Preferences } from '@capacitor/preferences';
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import { onMount } from 'svelte';
  import DeckSwitcher from '@/src/components/DeckSwitcher.svelte';
  import { push } from 'svelte-spa-router';
  import fetchData from '@/src/fetchData.js';
  import Loader from '@/src/components/Loader.svelte';

  let deck;
  let notifications = [];
  const range = Array.from({ length: 78 }, (_, index) => index);
  let loading;
  $: selectedCards = [];

  const setup = async () => {
    if ((await Preferences.get({ key: 'deck' })).value === 'Spoopy Tarot') {
      deck = spoopy;
    } else {
      deck = kawaii;
    }
  }

  const goToEntries = () => {
    push(`/digital-entries`);
  }


  function selectCard(card) {
    const cardButtons = document.querySelectorAll('.digital-card');

    if (selectedCards.includes(card)) {
      selectedCards = selectedCards.filter(c => c !== card);
    } else {
      if (selectedCards.length < 3) {
        selectedCards.push(card);
      }
    }

    cardButtons.forEach((btn) => {
      btn.classList.add('opacity-50');
    });
    
    selectedCards.forEach((card) => {
      cardButtons[card].classList.remove('opacity-50');
    });

    if (selectedCards.length === 3) {
      goToEntry();
    }
  }

  const goToEntry = async () => {
    loading = true;
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const pick = await fetchData('pick', { today }, 'POST');
    push(`/digital-entries/${pick.id}`);
    loading = false;
  }

  onMount(() => {
    setup();
  });

  function handleDeckChange(event) {
    const deckChange = event.detail.deck;

    if (deckChange === 'Spoopy Tarot') {
      deck = spoopy;
    } else {
      deck = kawaii;
    }
  }
</script>

<Toasts {notifications}></Toasts>
{#if loading}
  <Loader />
{:else}
  <TitleBar title="Digital Tarot" subtitle="Think a question & pick 3 cards">
    <div slot="left-action">
      <button type="button" on:click={goToEntries}>
        <svg fill="currentColor" class="w-5 h-5" width="21" height="20" viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="20" height="3" rx="1.5" />
          <rect x="0.5" y="8.5" width="20" height="3" rx="1.5" />
          <rect x="0.5" y="16.5" width="20" height="3" rx="1.5" />
        </svg>
      </button>
    </div>
    <div slot="right-action">
      <DeckSwitcher on:deckChange={handleDeckChange} />
    </div>
  </TitleBar>
  <div class="grid grid-cols-3 px-6 gap-4">
    {#each range as card}
      <button 
        on:click={() => selectedCards.length < 3 ? selectCard(card) : null}
        type="button" 
        class="digital-card digital-card-{card} load-entry flex flex-col items-center duration-1000 transition-opacity">
        <img src={deck} alt="Pick a Card" class="rounded-2xl">
      </button>
    {/each}
    <div class="h-[104px] flex-shrink-0"></div>
  </div>
{/if}