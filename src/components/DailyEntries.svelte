<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import fetchData from '@/src/fetchData.js';
  import star from '@/assets/star.svg';

  let entries = [];
  let loading = true;
  let error = null;
  let notifications = [];
  let offset = 0;
  let hasMore = true;
  let isLoadingMore = false;

  onMount(() => {
    fetchEntries();
  });

  function handleEntryClick(entry) {
    push(`/daily-entries/${entry.id}/?back=daily-entries`);
  }

  function intersectionObserver(node) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore) {
            fetchEntries();
          }
        });
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0,
      }
    );

    observer.observe(node);

    return {
      destroy() {
        observer.unobserve(node);
      },
    };
  }

  async function fetchEntries() {
    if (isLoadingMore || !hasMore) {
      loading = false;
      return;
    }
    isLoadingMore = true;

    const newEntries = await fetchData(
      'history',
      { handle: 'reading', posts_per_page: 10, offset },
      'POST'
    );
    
    if (newEntries) {
      entries = [...entries, ...newEntries];
      offset += newEntries.length;
    }

    loading = false;
    isLoadingMore = false;
  }


  function close() {
    push('/');
  }
</script>

<Toasts {notifications} />

<TitleBar title="Entries">
  <div slot="left-action"></div>
  <div slot="right-action">
    <button on:click={close} class="close-button">+</button>
  </div>
</TitleBar>

<div class="w-full px-6 flex-1 flex items-start justify-center">
  <div class="flex-1">
      <ul>
        {#each entries as entry}
        <li class="flex pb-4 mb-4">
          <button
            type="button"
            class="text-left flex"
            on:click={() => handleEntryClick(entry)}
          >
            <div>
              <div
                class="w-20 h-20 p-4 flex-shrink-0 flex items-center justify-center rounded-xl bg-translucent"
              >
                <img src={entry.image} alt="" class="h-[53px] rounded-md" />
              </div>
              <p class="w-20 mt-2 text-center opacity-80 text-sm break-words">
                {entry.title}
              </p>
            </div>
            <div class="flex-grow pl-4 flex-col">
              <h3 class="mb-2">{entry.date}</h3>
              <p class="my-2">{entry.snippet}</p>
            </div>
          </button>
          </li>
        {/each}
      </ul>

    {#if hasMore}
      <div use:intersectionObserver></div>
    {/if}
  </div>
</div>

<style>
  .close-button {
    transform: rotate(45deg);
  }
</style>