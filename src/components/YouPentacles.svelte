<script>
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import intentions from '@/assets/intentions.png';
  import inspired from '@/assets/inspired.png';
  import vision from '@/assets/vision.png';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import pentacles from '@/assets/pentacles.png';

  let notifications = [];
  let loading = true;
  let pentaclesBalance = 1999;

  onMount(() => {
    loading = false;
  });

  function close() {
    push('/you');
  }
</script>

<Toasts {notifications}></Toasts>
{#if loading}
  <Loader />
{:else}
  <TitleBar title="Pentacles" subtitle="You get 1 free per daily reading">
    <div slot="left-action">
      <button on:click={close} class="close-button">&lt;</button>
    </div>
    <div slot="right-action"></div>
  </TitleBar>
  <form id="account-form" class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
    <img src={pentacles} class="w-24" alt="Pentacles">
  
    <div class="w-full grid grid-cols-3 gap-2" id="pentacles">
      {#each [{id: 'product-1', price: '$1.99', quantity: 10}, {id: 'product-2', price: '$11.99', quantity: 66}, {id: 'product-3', price: '$99.99', quantity: 888}] as product}
        <div class="flex items-center flex-col justify-center rounded-2xl bg-brand text-center p-2">
          <p class="text-white text-2xl font-serif">{product.quantity}</p>
          <h2 class="text-white font-sans text-sm opacity-80 mb-2">Pentacles</h2>
          <button on:click={() => handleButtonClick(`${product.quantity}credits`)} class="w-full mx-auto transition-opacity origin-top duration-1000 bg-accent font-serif text-black rounded-xl px-4 py-2">
            {product.price}
          </button>
        </div>
      {/each}
    </div>
  </form>
  <div class="px-6 flex flex-col gap-6">
    <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-6 w-full rounded-2xl">
      <h3 class="text-center">What can I redeem with Pentacles?</h3>
      <p class="text-center">Personalized to your aesthetics, lifestyle, personality, and vision:</p>
      <div class="flex flex-col gap-6 w-full">
        <div class="w-full flex text-left items-center gap-3">
          <div class="w-20 h-20 p-1.5  bg-[#FFDEF6] flex items-center justify-center rounded-2xl flex-shrink-0"><img src={intentions} alt=""></div>
          <div class="flex flex-col gap-1.5">
            <h3>Daily guidance</h3>
            <p>Manifest intentionally and watch life sparkle.</p>
            <div class="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
              </svg>
              <div class="opacity-80 font-serif text-sm">Spend 1 pentacle</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-6 w-full">
        <div class="w-full flex text-left items-center gap-3">
          <div class="w-20 h-20 p-4 bg-[#DACCFF] flex items-center justify-center rounded-2xl flex-shrink-0"><img src={vision} alt=""></div>
          <div class="flex flex-col gap-1.5">
            <h3>Personal readings</h3>
            <p>Insightful readings anytime.</p>
            <div class="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
              </svg>
              <div class="opacity-80 font-serif text-sm">Spend 3 pentacles</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-6 w-full">
        <div class="w-full flex text-left items-center gap-3">
          <div class="w-20 h-20 p-4 bg-[#C0EFFF] flex items-center justify-center rounded-2xl flex-shrink-0"><img src={inspired} alt=""></div>
          <div class="flex flex-col gap-1.5">
            <h3>Gift tarot decks</h3>
            <p>Buy a Cute Tarot deck or gift to a friend!</p>
            <div class="inline-flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
              </svg>
              <div class="opacity-80 font-serif text-sm">Spend 222 pentacles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-3 w-full rounded-2xl">
      <h3>Why the Pentacles system?</h3>
      <p class="text-center">Pentacles are credits you can use around the app. No subscription—just a pay-as-you-go system so you can invest more into your manifestations.</p>
    </div>
    <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-3 w-full rounded-2xl">
      <h3 class="text-center">Do Pentacles expire?</h3>
      <p class="text-center">Pentacles never expire. However, our policy does not cover refunds.</p>
    </div>
    <div class="h-6"></div>
  </div>
{/if}