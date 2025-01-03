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
  import interpretation from '@/assets/interpretation.png';

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

    window.ls('track', {
      event: 'Intention saved',
      channel: 'digital',
      icon: '📓',
    });

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

  function goToInterpretation(id) {
    push('/interpretation/' + id);
  }
</script>

<Toasts {notifications} />
{#if entry}
  <TitleBar title="Reading" subtitle={entry.date}>
    <div slot="left-action">
      <button on:click={close} class="close-button">&lt;</button>
    </div>
    <div slot="right-action">
      <button
      data-event="Go to interpretation"
      data-channel="digital"
      data-icon="🔮"
      on:click={() => goToInterpretation(entry.id)} class="absolute h-20 -top-9 right-0 block">
        <svg width="22" height="30" viewBox="0 0 22 30" class="fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2406_818)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.8636 6.56407L8.5102 4.57404C9.23056 2.35699 12.3671 2.35699 13.0875 4.57404L13.7341 6.56407H15.8265C18.1576 6.56407 19.1269 9.5471 17.241 10.9173L15.5481 12.1472L16.1947 14.1373C16.9151 16.3543 14.3776 18.1979 12.4916 16.8277L10.7988 15.5978L9.10601 16.8277C7.22007 18.1979 4.68256 16.3543 5.40292 14.1373L6.04952 12.1472L4.3567 10.9173C2.47076 9.5471 3.44 6.56407 5.77115 6.56407H7.8636ZM5.77115 3.68407C7.35365 -1.18636 14.244 -1.18636 15.8265 3.68407C20.9476 3.68407 23.0768 10.2372 18.9338 13.2473C20.5163 18.1177 14.9419 22.1678 10.7988 19.1577C6.6558 22.1678 1.08138 18.1177 2.66388 13.2473C-1.47915 10.2372 0.650084 3.68407 5.77115 3.68407ZM9.82767 26.2403C8.5328 26.2403 7.48309 25.1906 7.48309 23.8957C7.48309 22.6008 8.5328 21.5511 9.82767 21.5511C11.1226 21.5511 12.1723 22.6008 12.1723 23.8957C12.1723 25.1906 11.1226 26.2403 9.82767 26.2403ZM2.80547 27.1211C2.80547 28.0655 3.57101 28.831 4.51535 28.831C5.45969 28.831 6.22523 28.0655 6.22523 27.1211C6.22523 26.1768 5.45969 25.4112 4.51535 25.4112C3.57101 25.4112 2.80547 26.1768 2.80547 27.1211Z"/>
          </g>
        </svg>
      </button>
    </div>
  </TitleBar>

  <div class="w-full px-6 flex-1 flex items-center flex-col text-center gap-6">
    <div class="flex my-4 items-center justify-center gap-4">
      <button class="-rotate-6 pr-1" on:click={() => handleCardClick(entry.fields.card_1.post_name)} type="button">
        <img src={entry.images[0]} alt="" class="h-36 rounded-xl" />
      </button>
      <button on:click={() => handleCardClick(entry.fields.card_2.post_name)} type="button">
        <img src={entry.images[1]} alt="" class="h-36 -mt-8 rounded-xl" />
      </button>
      <button class="rotate-6 pl-1" on:click={() => handleCardClick(entry.fields.card_3.post_name)} type="button">
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
{/if}