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

  let entry = null;
  let loading;
  let error = null;
  let notifications = [];
  let id;
  let backLink;
  let emote;
  let reading;

  async function getReading() {
    loading = true;
    const pentacles = await fetchData('usermeta', { name: 'pentacles' }, 'POST');
    if (parseInt(pentacles) >= 3) {
      const response = await fetchData('reading', { id, cards: entry.title, question: document.getElementById('question').value }, 'POST');
      reading = response.reading;
    } else {
      notifications = [...notifications, { message: 'You need at least 1 pentacle', type: 'error' }];
    }

    loading = false;
  }

  async function handleSubmit(event) {
    const question = event.target.value;

    if (!question) {
      return;
    }
    
    await fetchData('postmeta', { name: 'question', value: question, id }, 'POST');
    notifications = [...notifications, { message: 'Question saved', type: 'success' }];

    entry = await fetchData('history', { handle: id, posts_per_page: 1 }, 'POST');
  }
  
  onMount(() => {
    backLink = '/digital';
    params.subscribe(value => {
      if (value) {
        id = value.id;
        fetchEntry();
      }
    });
  });

  async function fetchEntry() {
    try {
      entry = await fetchData('history', { handle: id, posts_per_page: 1 }, 'POST');
      reading = entry.reading;
      emote = entry.fields.emote;
    } catch (err) {
      notifications = [...notifications, { message: 'Failed to load entry.', type: 'error' }];
      error = err;
    } finally {
      loading = false;
    }
  }

  function close() {
    push(backLink);
  }

  function updateSize(event) {
    event.target.parentNode.dataset.value = event.target.value;
  }

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  async function setEmote(emote) {
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

  const debouncedHandleSubmit = debounce(handleSubmit, 0);
</script>

<Toasts {notifications} />
{#if loading}
  <Loader />
{:else if entry}
  <TitleBar title="Reading" subtitle={entry.date}>
    <div slot="left-action">
      <button on:click={close} class="close-button">&lt;</button>
    </div>
    <div slot="right-action">
    </div>
  </TitleBar>

  <div class="w-full px-6 flex-1 flex items-center flex-col text-center gap-6">
    <div class="flex my-4 items-center justify-center gap-4">
      <img src={entry.images[0]} alt="" class="h-36 rounded-xl" />
      <img src={entry.images[1]} alt="" class="h-36 -mt-8 rounded-xl" />
      <img src={entry.images[2]} alt="" class="h-36 rounded-xl" />
    </div>
    <h2>{entry.title}</h2>
    <div class="text-center">{entry.snippet}</div>

    <div class="field flex flex-col items-center justify-between p-3.5 text-black bg-translucent gap-3 w-full rounded-2xl">
      <label for="question" class="label opacity-80 font-serif">Question {reading ? '' : '(saves automatically)'}</label>
      <div id="fake-height" data-value={entry.fields.question} class="textarea-field w-full">
        <textarea
          required
          type="text"
          id="question"
          name="question"
          on:input={() => updateSize(event)}
          on:blur={() => debouncedHandleSubmit(event)}
          disabled={reading}
          placeholder="Type here">{entry.fields.question ?? ''}</textarea>
      </div>
    </div>
    {#if reading}
      <h2>Reading</h2>
      <div class="text-left">
        {@html reading.replace(/\n/g, "<br>")}
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
    {#if !reading}
      <span class="text-sm items-center inline-flex justify-center gap-1 text-opacity-80">
        <img src={pentacle} alt="Pentacle" class="w-4 h-4 inline-block" />
        A personal reading costs 3 pentacles
      </span>
      <button
        type="button"
        id="reading"
        on:click={() => getReading()}
        class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl flex items-center gap-2 px-6 py-3">
        Get Reading
        <img src={pentacle} alt="Pentacle" class="w-5 h-5 inline-block" />
      </button>
    {/if}
  </div>
  <div class="h-6 flex-shrink-0"></div>
{/if}