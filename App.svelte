<script>
  import { onMount } from 'svelte';
  import { Preferences } from '@capacitor/preferences';
  import fetchData from '@/src/fetchData.js';
  import Toasts from '@/src/components/Toasts.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import Router, { push, location, replace } from 'svelte-spa-router';
  import lightBg from '@/assets/light-bg.png';
  import darkBg from '@/assets/dark-bg.png';
  import TabDock from '@/src/components/TabDock.svelte';
  import DailyIndex from '@/src/components/DailyIndex.svelte';
  import DailyEntries from '@/src/components/DailyEntries.svelte';
  import DailyEntry from '@/src/components/DailyEntry.svelte';
  import Signup from '@/src/components/Signup.svelte';
  import Login from '@/src/components/Login.svelte';
  import DigitalIndex from '@/src/components/DigitalIndex.svelte';
  import DigitalEntries from '@/src/components/DigitalEntries.svelte';
  import DigitalEntry from '@/src/components/DigitalEntry.svelte';
  import ReferenceIndex from '@/src/components/ReferenceIndex.svelte';
  import ReferenceEntry from '@/src/components/ReferenceEntry.svelte';
  import You from '@/src/components/You.svelte';
  import YouPentacles from '@/src/components/YouPentacles.svelte';
  import YouSettings from '@/src/components/YouSettings.svelte';

  let notifications = [];
  let loading = true;
  $: user = null;

  const routes = {
    '/signup': Signup,
    '/login': Login,
    '/': DailyIndex,
    '/daily-entries': DailyEntries,
    '/daily-entries/:id': DailyEntry,
    '/digital': DigitalIndex,
    '/digital-entries': DigitalEntries,
    '/digital-entries/:id': DigitalEntry,
    '/reference': ReferenceIndex,
    '/reference-entry/:id': ReferenceEntry,
    '/you': You,
    '/you-pentacles': YouPentacles,
    '/you-settings': YouSettings,
  };

  async function validateUser() {
    const token = (await Preferences.get({ key: 'token' })).value;
    const email = (await Preferences.get({ key: 'email' })).value;

    if (!token || !email) {
      console.log('No token or email');
      user = null;
      if ($location !== '/signup' && $location !== '/login') {
        push('/signup');
      }
      loading = false;
      return;
    }

    const response = await fetchData('validate', { token, email }, 'POST');
    
    if (response.error) {
      user = null;
      if ($location !== '/signup' && $location !== '/login') {
        push('/signup');
      }
    } else {
      user = response;
      await Preferences.set({ key: 'token', value: user.token });
      if ($location.includes('/signup') || $location.includes('/login')) {
        replace('/');
      }
    }
    loading = false;
  }

  onMount(() => {
    validateUser();
  });

  $: if ($location) {
    loading = true;
    validateUser();
  }

  $: if (!loading) {
    if (!user) {
      if ($location !== '/signup' && $location !== '/login') {
        push('/signup');
      }
    }
  }
</script>

{#if loading}
  <Loader />
{:else}
  {#key user}
    <Toasts {notifications} />
    <div class="h-6 lg:h-8 flex-shrink-0"></div>
    <div id="content" class="flex-1 h-full w-full mx-auto max-w-2xl flex flex-col gap-8 relative z-30">
      <Router {routes} />
    </div>
    {#if user}
      <TabDock />
    {:else}
      <div
        id="background"
        class="bg-cover dark:hidden bg-no-repeat bg-center fixed top-0 left-0 w-full h-full z-20"
        style="background-image: url({lightBg});"
      ></div>
      <div
        id="background"
        class="bg-cover hidden dark:block opacity-[0.35] bg-no-repeat bg-center fixed top-0 left-0 w-full h-full z-20"
        style="background-image: url({darkBg});">
      </div>
    {/if}
  {/key}
{/if}
