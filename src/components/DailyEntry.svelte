<script>
  import star from '@/assets/star.svg';
  import { onDestroy, onMount } from 'svelte';
  import { push, params, querystring } from 'svelte-spa-router';
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import fetchData from '@/src/fetchData.js';
  import pentacle from '@/assets/pentacle.png';
  import nothing from '@/assets/nothing.svg';
  import doubt from '@/assets/doubtful.svg';
  import thoughtful from '@/assets/thoughtful.svg';
  import happy from '@/assets/happy.svg';
  import excited from '@/assets/excited.svg';
  import { get } from 'svelte/store';

  let entry = null;
  let loading = true;
  let error = null;
  let notifications = [];
  let id;
  let backLink;
  let emote;
  let todayReading;
  let guidance;

  async function handleSubmit() {
    if (!entry.reading) {
      loading = true;
      const pentacles = await fetchData('usermeta', { name: 'pentacles' }, 'POST');
      
      if (parseInt(pentacles) >= 1) {
        guidance = await fetchData('guidance', { id }, 'POST');
      } else {
        notifications = [...notifications, { message: 'You need at least 1 pentacle', type: 'error' }];
      }
    }
    loading = false;
  }
  
  onMount(() => {
    backLink = '/'+$querystring.replace('back=', '');
    params.subscribe(value => {
      if (value) {
        id = value.id;
        fetchEntry();
      }
    });
  });

  async function fetchEntry() {
    entry = await fetchData('history', { handle: id, posts_per_page: 1 }, 'POST');
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    if (entry.date === today) {
      todayReading = true;
    }
    if (entry.reading) {
      guidance = entry.reading;
    }

    emote = entry.fields.emote;
    loading = false;
  }

  function close() {
    push(backLink);
  }

  async function setEmote(emoteReaction) {
    if (!todayReading) {
      notifications = [...notifications, { message: 'You can only set your feelings for today', type: 'error' }];
      return;
    }
    emote = emoteReaction;
    const emotes = [
      'Nothing',
      'Doubt',
      'Thoughtful',
      'Happy',
      'Excited'
    ];
    document.querySelector('.'+emote).classList.remove('opacity-50');
    emotes.splice(emotes.indexOf(emote), 1);
    emotes.map((emoteElem) => {
      document.querySelector('.'+emoteElem).classList.add('opacity-50');
    })
    await fetchData('postmeta', { name: 'emote', value: emote, id }, 'POST');
    notifications = [...notifications, { message: `${emote} feeling saved`, type: 'success' }];
  }

  function updateSize(event) {
    event.target.parentNode.dataset.value = event.target.value;
  }

  function relativeTime(dateString) {
    const inputDate = new Date(dateString);
    const currentDate = new Date();
  
    const diffTime = currentDate - inputDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 28) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} weeks ago`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} months ago`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return `${diffYears} years ago`;
    }
  }
</script>

<Toasts {notifications} />
{#if loading}
  <Loader />
{:else if entry}
  <TitleBar title={relativeTime(entry.date)} subtitle={entry.date}>
    <div slot="left-action">
      <button on:click={close} class="close-button">&lt;</button>
    </div>
    <div slot="right-action">
    </div>
  </TitleBar>

  <div class="w-full px-6 flex-1 flex items-center flex-col text-center gap-6">
    <img src={entry.image} alt="" class="h-64 rounded-xl" />
    <h2>{entry.title}</h2>
    <p>{entry.card_snippet}</p>
    {#if entry.reading}
    <div class="flex flex-col text-left gap-2">
      {@html entry.reading.replace(/\n/g, '<br>')}
    </div>
    {/if}
    <h3>How do you feel?</h3>
    <div class="flex items-center gap-3 justify-center">
      <button type="button" on:click={() => setEmote('Nothing')} class="Nothing emote flex transition-opacity duration-1000 items-center justify-center flex-col gap-2">
        <img src={nothing} alt="" style={emote === 'Nothing' ? 'opacity: 100%' : 'opacity: 50%'} class="h-12" />
        <div class="text-center text-sm opacity-80">Nothing</div>
      </button>
      <button type="button" on:click={() => setEmote('Doubt')} class="Doubt emote flex transition-opacity duration-1000 items-center justify-center flex-col gap-2" style={emote === 'Doubt' ? 'opacity: 100%' : 'opacity: 50%'}>
        <img src={doubt} alt="" class="h-12" />
        <div class="text-center text-sm opacity-80">Doubt</div>
      </button>
      <button type="button" on:click={() => setEmote('Thoughtful')} class="Thoughtful emote flex transition-opacity duration-1000 items-center justify-center flex-col gap-2" style={emote === 'Thoughtful' ? 'opacity: 100%' : 'opacity: 50%'}>
        <img src={thoughtful} alt="" class="h-12" />
        <div class="text-center text-sm opacity-80">Thoughtful</div>
      </button>
      <button type="button" on:click={() => setEmote('Happy')} class="Happy emote flex transition-opacity duration-1000 items-center justify-center flex-col gap-2" style={emote === 'Happy' ? 'opacity: 100%' : 'opacity: 50%'}>
        <img src={happy} alt="" class="h-12" />
        <div class="text-center text-sm opacity-80">Happy</div>
      </button>
      <button type="button" on:click={() => setEmote('Excited')} class="Excited emote flex transition-opacity duration-1000 items-center justify-center flex-col gap-2" style={emote === 'Excited' ? 'opacity: 100%' : 'opacity: 50%'}>
        <img src={excited} alt="" class="h-12" />
        <div class="text-center text-sm opacity-80">Excited</div>
      </button>
    </div>
    {#if !entry.reading && todayReading}
    <div id="get-guidance" class="transition-opacity  duration-1000 flex flex-col items-center gap-4">
      <span class="text-sm items-center inline-flex justify-center gap-1 text-opacity-80">
        <img src={pentacle} alt="Pentacle" class="w-4 h-4 inline-block" />
        Personal guidance costs 1 pentacle
      </span>
      <button
        type="button"
        id="get-guidance-button"
        on:click={() => handleSubmit()}
        class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white flex items-center gap-2 rounded-xl px-6 py-3">
        Get Guidance 
        <img src={pentacle} alt="Pentacle" class="w-5 h-5 inline-block"/>
      </button>
    </div>
    {/if}
  </div>
  <div class="h-6 flex-shrink-0"></div>
{/if}