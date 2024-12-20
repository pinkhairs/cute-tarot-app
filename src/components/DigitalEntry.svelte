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
  let question;

  async function handleSubmit(event) {
    question = event.target.value;

    if (!question) {
      return;
    }
    
    await fetchData('postmeta', { name: 'question', value: question, id }, 'POST');
    notifications = [...notifications, { message: 'Intention saved', type: 'success' }];

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
      question = entry.fields.question;
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
  
  function handleCardClick(cardId) {
    push('/reference-entry/' + cardId);
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

  function goToYou() {
    push('/you');
  }
</script>

<Toasts {notifications} />
{#if loading}
  
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
      <button on:click={() => handleCardClick(entry.fields.card_1.post_name)} type="button">
        <img src={entry.images[0]} alt="" class="h-36 rounded-xl" />
      </button>
      <button on:click={() => handleCardClick(entry.fields.card_2.post_name)} type="button">
        <img src={entry.images[1]} alt="" class="h-36 -mt-8 rounded-xl" />
      </button>
      <button on:click={() => handleCardClick(entry.fields.card_3.post_name)} type="button">
        <img src={entry.images[2]} alt="" class="h-36 rounded-xl" />
      </button>
    </div>
    <h2>{entry.title}</h2>
    <div class="text-center px-4">{entry.snippet}</div>

    <div class="field flex flex-col items-center justify-between p-3.5 text-black bg-translucent gap-3 w-full rounded-2xl">
      <label for="question" class="label opacity-80 font-serif">What's on your mind?</label>
      <div id="fake-height" data-value={question} class="textarea-field w-full">
        <textarea
          required
          type="text"
          id="question"
          name="question"
          bind:value={question}
          on:input={() => updateSize(event)}
          on:blur={() => debouncedHandleSubmit(event)}
          disabled={reading}
          placeholder="Let it flow"></textarea>
      </div>
    </div>
    <p class="px-4 text-sm">Your story matters! The more context you document here, the more likely you are to get badges for serendipity. <button type="button" class="border border-t-0 border-l-0 border-r-0 border-b-white border-opacity-40" on:click={goToYou}>Examples</button></p>
  </div>
  <div class="h-6 flex-shrink-0"></div>
{/if}