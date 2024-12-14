<script>
  import kawaii from '@/assets/kawaii/kawaii-79.png';
  import spoopy from '@/assets/spoopy/spoopy-79.png';
  import { Preferences } from '@capacitor/preferences';
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import { onMount } from 'svelte';
  import DeckSwitcher from '@/src/components/DeckSwitcher.svelte';
  import { push } from 'svelte-spa-router';
  import fetchData from '@/src/fetchData.js';
  import star from '@/assets/star.svg';
  import pentacle from '@/assets/pentacle.png';
  
  let deck;
  let notifications = [];
  $: todayReading = true;
  let id;
  let loading;
  let reading;

  async function handleSubmit() {
    loading = true;
    if (!reading) {
      await fetchData('guidance', { id }, 'POST');
    }
    goToEntry(id);
    loading = false;
  }

  const setup = async () => {
    loading = true;
    const flipCardButton = document.getElementById('flip-card-button');
    flipCardButton.classList.add('hidden');

    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    todayReading = await fetchData('history', { handle: today, posts_per_page: 1 }, 'POST');

    if (todayReading) {
      id = todayReading.id;
      const cardContent = todayReading.snippet;
      const cardTitle = todayReading.title;
      const cardImage = todayReading.image;
      const cardDeck = todayReading.deck;
      reading = todayReading.reading;

      if (cardDeck === 'spoopy-tarot-meaning') {
        deck = spoopy;
      } else {
        deck = kawaii;
      }

      const cardElement = document.getElementById('card');
      const cardInfoElement = document.getElementById('card-info');
      const cardImageElement = document.getElementById('card-image');
      const cardTitleElement = document.getElementById('card-title');
      const cardTitleText = document.getElementById('card-title-text');
      const cardDescription = document.getElementById('card-description');
      const getGuidanceButton = document.getElementById('get-guidance');

      cardInfoElement ? cardInfoElement.classList.remove('-z-20') : null;
      cardTitleText.innerText = cardTitle;
      cardImageElement.setAttribute('src', cardImage);
      flipCardButton.remove();
      cardTitleElement.classList.remove('opacity-0');
      cardDescription.classList.remove('opacity-0');
      cardDescription.innerText = cardContent;
      getGuidanceButton.classList.remove('opacity-0');

      //load cardImage
      cardImageElement.onload = () => {
        setTimeout(() => cardElement.classList.add('flipped'), 777);
      }
    } else {
      if ((await Preferences.get({ key: 'deck' })).value === 'Spoopy Tarot') {
        deck = spoopy;
      } else {
        deck = kawaii;
      }
      flipCardButton.classList.remove('hidden');
    }
  }

  const goToEntries = () => {
    push(`/daily-entries/`);
  }

  const goToEntry = (id) => {
    push(`/daily-entries/${id}/?back=`);
  }

  onMount(() => {
    setup();
    loading = false;
  });

  async function flipCard() {
    todayReading = true;
    document.querySelector('.card-1').classList.add('shuffle');
    document.querySelector('.card-2').classList.add('shuffle');
    document.querySelector('.card-3').classList.add('shuffle');

    const flipCardButton = document.getElementById('flip-card-button');
    flipCardButton.classList.add('opacity-0');
    flipCardButton.classList.add('-z-20');

    todayReading = await fetchData('shuffle', { today: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }, 'POST');

    document.querySelector('.card-1').classList.remove('shuffle');
    document.querySelector('.card-2').classList.remove('shuffle');
    document.querySelector('.card-3').classList.remove('shuffle');
    document.querySelector('.card-1').classList.add('invisible');
    document.querySelector('.card-2').classList.add('invisible');
    document.querySelector('.card-3').classList.add('invisible');
    document.querySelector('#card').classList.remove('invisible');
    document.getElementById('card-info').classList.remove('-z-20');

    id = todayReading.id;
    const cardTitle = todayReading.title;
    const cardContent = todayReading.snippet;
    const cardImage = todayReading.image;

    // Flip the card
    const cardElement = document.getElementById('card');
    const cardDescription = document.getElementById('card-description');
    const cardImageElement = document.getElementById('card-image');
    const cardTitleElement = document.getElementById('card-title');
    const cardTitleText = document.getElementById('card-title-text');
    const getGuidanceButton = document.getElementById('get-guidance');
    cardElement.classList.add('duration-1000');
    cardTitleText.innerText = cardTitle;
    cardDescription.innerText = cardContent;
    cardImageElement.setAttribute('src', cardImage);

    setTimeout(() => {
      cardElement.classList.toggle('flipped');
    }, 777);
    setTimeout(() => {
      flipCardButton.classList.add('hidden');
      cardTitleElement.classList.remove('opacity-0');
    }, 1000);
    setTimeout(() => {
      cardDescription.classList.remove('opacity-0');
    }, 2000);
    setTimeout(() => {
      getGuidanceButton.classList.remove('opacity-0');
    }, 3000);
  }

  function handleDeckChange(event) {
    const deckChange = event.detail.deck;

    if (deckChange === 'Spoopy Tarot') {
      deck = spoopy;
    } else {
      deck = kawaii;
    }
  }
</script>

{#if loading}
  
{:else}
<Toasts {notifications}></Toasts>
  <TitleBar title="Today">
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
      {#if !todayReading}
        <DeckSwitcher on:deckChange={handleDeckChange} />
      {/if}
    </div>
  </TitleBar>
  <div class="flex flex-col px-6 gap-4 md:gap-6 w-full">
    <div class="w-full relative card-container h-64 md:h-80 short:h-56 lg:h-64 xl:h-80">
      <div id="card" class="relative card transition-all duration-1000 h-64 md:h-80 short:h-56 lg:h-64 xl:h-80">
        <div class="card-face card-front">
          <img src={deck} id="card-back" class="rounded-3xl bg-[rgba(255,255,255,.85)] h-64 md:h-80 short:h-56 lg:h-64 xl:h-80" alt="">
        </div>
        <div class="card-face card-back">
          <img id="card-image" class="rounded-3xl bg-[rgba(255,255,255,.85)] h-64 md:h-80 short:h-56 lg:h-64 xl:h-80" alt="">
        </div>
        <img src={deck} class="card-1 top-0 w-auto rounded-3xl bg-[rgba(255,255,255,.85)] h-64 md:h-80 short:h-56 lg:h-64 xl:h-80" alt="" />
        <img src={deck} class="card-2 top-0 w-auto rounded-3xl bg-[rgba(255,255,255,.85)] h-64 md:h-80 short:h-56 lg:h-64 xl:h-80" alt="" />
        <img src={deck} class="card-3 w-auto rounded-3xl bg-[rgba(255,255,255,.85)] h-64 md:h-80 short:h-56 lg:h-64 xl:h-80" alt="" />
      </div>
    </div>
    <div class="flex flex-col">
      <button on:click={flipCard} id="flip-card-button" type="button" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand hidden text-xl font-serif text-white rounded-xl px-6 py-3">Get Reading</button>
      <div id="card-info" class="flex -z-20 items-center justify-center gap-4 flex-col">
        <div id="card-title" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
          <h2 id="card-title-text"></h2>
        </div>
        <div id="card-description" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
          <p id="card-content"></p>
        </div>
        <div id="get-guidance" class="opacity-0 transition-opacity  duration-1000 flex flex-col items-center gap-4">
          <button
            type="button"
            id="get-guidance-button"
            on:click={() => push('/daily-entries/'+id)}
            class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white flex items-center gap-2 rounded-xl px-6 py-3">
            See More
          </button>
        </div>
        <div class="h-[104px] flex-shrink-0"></div>
      </div>
    </div>
  </div>
  {/if}