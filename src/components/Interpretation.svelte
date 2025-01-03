<script>
  import { onMount } from 'svelte';
  import { push, params, querystring, pop } from 'svelte-spa-router';
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import fetchData from '@/src/fetchData.js';
  import pentacle from '@/assets/pentacle.png';
  import Loader from '@/src/components/Loader.svelte';

  let entry = null;
  let loading = true;
  let notifications = [];
  let id;
  let backLink;
  let intention;
  let reading;
  let hasEnoughPentacles;

  async function handleSubmit() {
    await fetchData('postmeta', { name: 'intention', value: intention, id }, 'POST');
    notifications = [...notifications, { message: 'Intention saved', type: 'success' }];
  }

  const debouncedHandleSubmit = debounce(handleSubmit, 1000);

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
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
    reading = entry.reading;
    intention = entry.fields.intention;
    const pentacles = await fetchData('usermeta', { name: 'pentacles' }, 'POST');
    hasEnoughPentacles = parseInt(pentacles) >= entry.type === 'reading' ? 1 : 3;
    loading = false;
  }

  function close() {
    pop();
  }
  
  function handleCardClick(cardId) {
    push('/reference-entry/' + cardId);
  }

  async function getInterpretation() {
    loading = true;
    reading = (await fetchData('reading', { id: entry.id, cards: entry.title }, 'POST')).reading;
    window.ls('track', {
      event: 'Get reading',
      channel: entry.type === 'reading' ? 'daily' : 'digital',
      icon: '👁️',
    });
    window.ls('track', {
      event: 'Spent pentacles',
      description: `${entry.type === 'reading' ? 1 : 3} pentacles for ${entry.date}`,
      channel: 'pentacles',
      icon: '💳',
    });
    loading = false;
  }

  function goToPentacles() {
    push('/you-pentacles');
    window.ls('track', {
      event: 'Get pentacles',
      channel: 'interpret',
      icon: '🪙',
    });
  }
</script>

<Toasts {notifications} />
{#if loading}
  <Loader />
{/if}
{#if entry}
  <TitleBar title="Interpretation" subtitle={entry.date}>
    <div slot="left-action">
      <button on:click={close} class="close-button">&lt;</button>
    </div>
    <div slot="right-action"></div>
  </TitleBar>

  <div class="w-full px-6 flex-1 flex items-center flex-col text-center gap-6">
    {#if entry.type === 'reading'}
      <button on:click={() => handleCardClick(entry.fields.card.post_name)} type="button">
        <img src={entry.image} alt="" class="h-36 rounded-lg" />
      </button>
    {:else}
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
    {/if}
    <h2 class="text-md">{entry.title}</h2>
    {#if reading}
      <p class="text-left">{@html reading.replace(/\n/g, "<br />")}</p>
    {:else}
      <div class="field flex flex-col items-center justify-between p-3.5 text-black bg-translucent gap-3 w-full rounded-2xl">
        <h3>Get a personalized reading</h3>
        <p class="opacity-80">An in-depth interpretation just for you.</p>
        <p class="text-sm font-semibold">
          <img src={pentacle} alt="Pentacle" class="h-4 inline" />
          {#if hasEnoughPentacles}
            Spend {#if entry.type === 'reading'}1{:else}3{/if} pentacle{#if entry.type === 'digital'}s{/if}
          {:else}
            You need {#if entry.type === 'reading'}1{:else}3{/if} pentacle{#if entry.type === 'digital'}s{/if}
          {/if}
        </p>
        <p>
          <button on:click={hasEnoughPentacles ? getInterpretation : goToPentacles} type="button" class="mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">{#if hasEnoughPentacles}Get Reading{:else}Get Pentacles{/if}</button>
        </p>
      </div>
    {/if}
  </div>
{/if}