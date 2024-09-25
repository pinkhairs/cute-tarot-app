<script>
  import star from '@/assets/star.svg';
  import { onDestroy, onMount } from 'svelte';
  import { push, params, querystring } from 'svelte-spa-router';
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import fetchData from '@/src/fetchData.js';

  let entry = null;
  let loading = true;
  let error = null;
  let notifications = [];
  let id;
  let backLink;

  async function handleSubmit(manifested = false) {
    loading = true;
    const intention = document.getElementById('intention').value;

    if (manifested) {
      await fetchData('postmeta', { name: 'manifested', value: true, id }, 'POST');
      notifications = [...notifications, { message: 'Yay! Success', type: 'success' }];
    } else {
      await fetchData('postmeta', { name: 'intention', value: intention, id }, 'POST');
      notifications = [...notifications, { message: 'Intention saved', type: 'success' }];
    }

    entry = await fetchData('history', { handle: id, posts_per_page: 1 }, 'POST');

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
    try {
      entry = await fetchData('history', { handle: id, posts_per_page: 1 }, 'POST');
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
    <p>{entry.snippet}</p>

    <div data-value="" class="field flex flex-col items-center justify-between p-3.5 text-black bg-translucent gap-3 w-full rounded-2xl">
      <label for="intention" class="label opacity-80 font-serif">Intention</label>
      <div class="textarea-field w-full">
        <textarea
          disabled={relativeTime(entry.date) !== 'Today' || entry.fields.manifested}
          required
          type="text"
          id="intention"
          name="intention"
          on:input={updateSize}
          placeholder="None this day.">{entry.fields.intention ?? ''}</textarea>
      </div>
    </div>
    {#if relativeTime(entry.date) === 'Today'}
      {#if entry.fields.intention}
        {#if entry.fields.manifested}
          <button
            type="button"
            id="manifested"
            disabled
            class="w-max mx-auto transition-opacity origin-top duration-1000 bg-accent text-xl font-serif text-black rounded-xl px-6 py-3 inline-flex gap-2 justify-center items-center">
            <img class="h-4" src="{star}" alt="" /> Manifested
          </button>
        {:else}
          <button
            type="button"
            on:click={() => handleSubmit()}
            id="manifested"
            class="w-max mx-auto transition-opacity origin-top duration-1000 bg-accent text-xl font-serif text-black rounded-xl px-6 py-3">
            Save New Intention
          </button>
          <button
            type="button"
            on:click={() => handleSubmit(true)}
            id="manifested"
            class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">
            I Manifested This!
          </button>
        {/if}
      {:else}
      <button
        type="button"
        on:click={() => handleSubmit()}
        class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">
        Save Intention
      </button>
      {/if}
    {:else}
      {#if entry.fields.manifested}
        <button
          type="button"
          id="manifested"
          disabled
          class="w-max mx-auto transition-opacity origin-top duration-1000 bg-accent text-xl font-serif text-black rounded-xl px-6 py-3 inline-flex gap-2 justify-center items-center">
          <img class="h-4" src="{star}" alt="" /> Manifested
        </button>
      {/if}
    {/if}
  </div>
  <div class="h-6 flex-shrink-0"></div>
{/if}

<style>
  .close-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 48px;
    line-height: 1;
    color: currentColor;
    font-weight: 200;
  }
</style>
