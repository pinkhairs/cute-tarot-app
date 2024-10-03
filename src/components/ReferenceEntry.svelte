<script>
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import pentacle from '@/assets/pentacle.png';
  import fetchData from '@/src/fetchData.js';
  import { params, push } from 'svelte-spa-router';
  import { onMount } from 'svelte';
  
  let entry;
  let id;
  let loading = true;
  let notifications = [];


  async function getTarotCard() {
    params.subscribe(async value => {
      if (value) {
        entry = await fetchData('history', { handle: value.id }, 'POST');
        loading = false;
      }
    });
  }

  onMount(() => {
    getTarotCard();
  });

  function close() {
    push('/reference');
  }

</script>

<Toasts {notifications} />
{#if loading}
  <Loader />
{:else if entry}
  <TitleBar title={entry.title} subtitle={entry.fields.snippet}>
    <div slot="left-action">
      <button on:click={close} class="close-button">&lt;</button>
    </div>
    <div slot="right-action">
    </div>
  </TitleBar>

  <div class="w-full px-6 flex-1 flex items-center flex-col text-center gap-6">
    <img src={entry.image} alt="" class="h-64 rounded-xl" />
    <div class="text-left card-meaning">
      {@html entry.content}
    </div>
  </div>
  <div class="h-6 flex-shrink-0"></div>
{/if}