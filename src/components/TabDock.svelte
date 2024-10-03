<script>
  import { onMount } from 'svelte';
  import { location, push } from 'svelte-spa-router'; // Import the location store
  import reference from '@/assets/reference.png';
  import calendar from '@/assets/calendar.png';
  import today from '@/assets/today.png';
  import { Preferences } from '@capacitor/preferences';

  let isIndex = false;
  let translateY;
  let zIndexForContainer = 'z-40';
  let avatar;

  const updateAvatar = async () => {
    const avatarPreference = await Preferences.get({ key: 'avatar' });
    avatar = avatarPreference.value;
  };
  
  onMount(() => {
    updateAvatar();
  });

  $: {
    isIndex = $location === '/' || $location === '/digital' || $location === '/reference' || $location === '/you';
    if (isIndex) {
      setTimeout(() => {
        zIndexForContainer = 'z-40';
        translateY = 0;
      }, 0);
    } else {
      setTimeout(() => {
        zIndexForContainer = '-z-40';
        translateY = '150%';
      }, 0);
    }
  }
</script>
<div class="w-max {zIndexForContainer} fixed bottom-5 left-1/2 -translate-x-1/2">
  <nav
    id="tab-nav"
    class="inline-flex justify-center items-center transition-transform duration-1000 z-[100] ease-out relative"
    style="transform: translateY({translateY});"
  >
    <div
      class="w-max p-3 grid grid-cols-4 backdrop-blur-md bg-[rgba(255,255,255,.85)] shadow-[0_0_40px_-8px_rgba(85,123,193,0.2)] items-center rounded-3xl h-20 justify-center gap-2"
    >
      <!-- Calendar Button -->
      <div class="flex items-center">
        <button
          type="button"
          class="w-14 h-14 bg-cover flex items-end justify-center rounded-2xl"
          style="background-image: url({calendar})"
          on:click={() => push('/')}
        >
          <h2 class="text-[#F1789F] text-[34px] font-['Madimi_One'] mb-[0.1rem]">
            {new Date().getDate()}
          </h2>
        </button>
      </div>

      <!-- Deck Button -->
      <div class="flex items-center">
        <button
          style="background-image: url({today})"
          class="w-14 h-14 bg-cover rounded-2xl"
          type="button"
          on:click={() => push('/digital')}
        ></button>
      </div>

      <!-- Photo Button -->
      <!-- <div class="flex items-center">
        <button type="button" on:click={() => push('/photo')}>
          <img src={photo} alt="IRL Readings" class="rounded-2xl h-14" />
        </button>
      </div> -->

      <!-- Reference Button -->
      <div class="flex items-center">
        <button type="button" on:click={() => push('/reference')}>
          <img src={reference} alt="Reference" class="rounded-2xl h-14" />
        </button>
      </div>

      <!-- Avatar Button -->
      <div class="flex items-center">
        <button
          id="avatar"
          style="background-image: url({avatar})"
          class="rounded-2xl w-14 h-14 bg-cover bg-center bg-no-repeat"
          type="button"
          on:click={() => push('/you')}
        ></button>
      </div>
    </div>
  </nav>
</div>
