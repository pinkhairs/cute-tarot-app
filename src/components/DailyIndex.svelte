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
  import { user } from '@/src/store.js';
  import { get } from 'svelte/store';
  
  let deck;
  let notifications = [];
  $: todayReading = true;
  let id;
  let reading;
  let ready = false;
  let loggedIn = null;

  user.subscribe((value) => {
    loggedIn = value;
  });

  const setup = async () => {
    const tokenBeforeClear = (await Preferences.get({ key: 'token' })).value;
    if ((await Preferences.get({ key: 'today-day' })).value !== new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })) {
      const deckBeforeClear = (await Preferences.get({ key: 'deck' })).value;
      await Preferences.set({ key: 'deck', value: deckBeforeClear });
    }
    if (tokenBeforeClear) {
      await Preferences.set({ key: 'token', value: tokenBeforeClear });
    }
    const flipCardButton = document.getElementById('flip-card-button');
    flipCardButton.classList.add('hidden');
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (loggedIn) {
      todayReading = await fetchData('history', { handle: today, posts_per_page: 1 }, 'POST');
    } else {
      todayReading = (await Preferences.get({ key: 'today-image' })).value != 'null' ? (await Preferences.get({ key: 'today-image' })).value : false;
    }

    if (todayReading) {
      id = todayReading.id || null;
      const cardContent = todayReading.snippet || (await Preferences.get({ key: 'today-snippet' })).value;
      const cardTitle = todayReading.title || (await Preferences.get({ key: 'today-title' })).value;
      const cardImage = todayReading.image || (await Preferences.get({ key: 'today-image' })).value;
      const cardDeck = todayReading.deck || (await Preferences.get({ key: 'today-deck' })).value;
      reading = todayReading.reading;

      if (cardDeck.toLowerCase().includes('spoopy')) {
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
      cardTitleText.innerText = loggedIn ? cardTitle : (await Preferences.get({ key: 'today-title' })).value;
      cardImageElement.setAttribute('src', loggedIn ? cardImage : (await Preferences.get({ key: 'today-image' })).value);
      flipCardButton.remove();
      cardTitleElement.classList.remove('opacity-0');
      cardDescription.classList.remove('opacity-0');
      cardDescription.innerText = loggedIn ? cardContent : (await Preferences.get({ key: 'today-snippet' })).value;
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
    ready = true;
  }

  const goToEntries = () => {
    push(`/daily-entries/`);
  }

  onMount(() => {
    setup();
  });

  async function flipCard() {
    todayReading = true;
    if ($user) {
      window.ls('track', {
        event: 'Earned pentacle',
        description: `Earned 1 free pentacle`,
        channel: 'pentacles',
        icon: '⭐',
      });
    }
    document.querySelector('.card-1').classList.add('shuffle');
    document.querySelector('.card-2').classList.add('shuffle');
    document.querySelector('.card-3').classList.add('shuffle');

    const flipCardButton = document.getElementById('flip-card-button');
    flipCardButton.classList.add('opacity-0');
    flipCardButton.classList.add('-z-20');

    todayReading = await fetchData('shuffle', { deck, today: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }, 'POST');

    if (!loggedIn) {
      await Preferences.set({ key: 'today-image', value: todayReading.image });
      await Preferences.set({ key: 'today-title', value: todayReading.title });
      await Preferences.set({ key: 'today-snippet', value: todayReading.snippet });
      await Preferences.set({ key: 'today-deck', value: deck === spoopy ? 'Spoopy Tarot' : 'Kawaii Tarot' });
      await Preferences.set({ key: 'today-id', value: todayReading.handle });
      await Preferences.set({ key: 'today-day', value: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) });
    }

    document.querySelector('.card-1').classList.remove('shuffle');
    document.querySelector('.card-2').classList.remove('shuffle');
    document.querySelector('.card-3').classList.remove('shuffle');
    document.querySelector('.card-1').classList.add('invisible');
    document.querySelector('.card-2').classList.add('invisible');
    document.querySelector('.card-3').classList.add('invisible');
    document.querySelector('#card').classList.remove('invisible');
    document.getElementById('card-info').classList.remove('-z-20');

    id = todayReading.id;
    const cardTitle = loggedIn ? todayReading.title : (await Preferences.get({ key: 'today-title' })).value;
    const cardContent = loggedIn ? todayReading.snippet : (await Preferences.get({ key: 'today-snippet' })).value;
    const cardImage = loggedIn ? todayReading.image : (await Preferences.get({ key: 'today-image' })).value;

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

  function loginNotice(message) {
    notifications = [...notifications, { message, type: 'error' }];
  }
</script>

<Toasts {notifications}></Toasts>
<TitleBar title="Today">
  <div slot="left-action">
      <button class={!loggedIn ? 'opacity-60' : ''} type="button" on:click={() => loggedIn ? goToEntries() : loginNotice('Log in to save & view history')}>
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

<div class="flex flex-col px-6 gap-4 md:gap-6 w-full transition-opacity">
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
  <div class="flex flex-col gap-4">
    <button
      data-event="Daily pick"
      data-channel="daily"
      data-icon="🗓️"
    on:click={flipCard} id="flip-card-button" type="button" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand hidden text-xl font-serif text-white rounded-xl px-6 py-3">Get Reading</button>
    <div id="card-info" class="flex -z-20 items-center justify-center gap-4 flex-col">
      <div id="card-title" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
        <h2 id="card-title-text"> </h2>
      </div>
      <div id="card-description" class="duration-1000 opacity-0 transition-opacity text-center items-center justify-center">
        <p id="card-content"></p>
      </div>
      <div id="get-guidance" class="opacity-0 transition-opacity  duration-1000 flex flex-col items-center gap-4">
        <button
          data-event="Go deeper{ loggedIn ? '' : ' (logged out)' }"
          data-channel="daily"
          data-icon="🔍"
          type="button"
          on:click={() => loggedIn ? push('/daily-entries/'+id) : push('/signup-or-login')}
          class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white flex items-center gap-2 rounded-xl px-6 py-3">
          {loggedIn ? 'See More' : 'Log In to See More'}
        </button>
      </div>
    </div>
  </div>
</div>