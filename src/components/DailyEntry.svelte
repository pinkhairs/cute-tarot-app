<script>
  import { onMount } from 'svelte';
  import { push, params, querystring } from 'svelte-spa-router';
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import fetchData from '@/src/fetchData.js';
  import pentacle from '@/assets/pentacle.png';

  let entry = null;
  let loading = true;
  let notifications = [];
  let id;
  let backLink;
  let emote;
  let todayReading;
  let guidance;
  let intention;

  $: if (guidance) {
    console.log('Guidance updated:', guidance);
  }

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

  function goToYou() {
    push('/you');
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
  
  function handleCardClick(cardId) {
    push('/reference-entry/' + cardId);
  }
</script>

<Toasts {notifications} />
{#if loading}
  
{:else if entry}
  <TitleBar title={relativeTime(entry.date)} subtitle={entry.date}>
    <div slot="left-action">
      <button on:click={close} class="close-button">&lt;</button>
    </div>
    <div slot="right-action">
    </div>
  </TitleBar>

  <div class="w-full px-6 flex-1 flex items-center flex-col text-center gap-6">
    <button on:click={() => handleCardClick(entry.fields.card.post_name)} type="button">
      <img src={entry.image} alt="" class="h-64 rounded-xl" />
    </button>
    <h2>{entry.title}</h2>
    <p>{entry.card_snippet}</p>
    {#if entry.reading}
    <div class="flex flex-col text-left gap-2">
      {@html entry.reading.replace(/\n/g, '<br>')}
    </div>
    {/if}
    <div class="field flex flex-col items-center justify-between p-3.5 text-black bg-translucent gap-3 w-full rounded-2xl">
      <label for="intention" class="label opacity-80 font-serif">What's on your mind?</label>
      <div id="fake-height" data-value={intention} class="textarea-field w-full">
        <textarea
          required
          type="text"
          id="intention"
          name="intention"
          bind:value={intention}
          on:input={() => updateSize(event)}
          on:blur={() => debouncedHandleSubmit(event)}
          placeholder="Let it flow"></textarea>
      </div>
    </div>
    <p class="px-4 text-sm">Your story matters! The more context you document here, the more likely you are to get badges for serendipity. <button type="button" class="border border-t-0 border-l-0 border-r-0 border-b-white border-opacity-40" on:click={goToYou}>Examples</button></p>
  </div>
  <div class="h-6 flex-shrink-0"></div>
{/if}