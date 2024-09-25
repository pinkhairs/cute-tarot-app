<script>
  import { onMount } from 'svelte';
  import { Preferences } from '@capacitor/preferences';
  import fetchData from '@/src/fetchData.js';
  import Toasts from '@/src/components/Toasts.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import Router, { push, location } from 'svelte-spa-router';
  import lightBg from '@/assets/light-bg.png';
  import darkBg from '@/assets/dark-bg.png';
  import TabDock from '@/src/components/TabDock.svelte';
  import DailyIndex from '@/src/components/DailyIndex.svelte';
  import DailyEntries from '@/src/components/DailyEntries.svelte';
  import DailyEntry from '@/src/components/DailyEntry.svelte';
  import Signup from '@/src/components/Signup.svelte';
  import Login from '@/src/components/Login.svelte';

  let notifications = [];
  let loading = true;
  let user = null;

  const routes = {
    '/signup': Signup,
    '/login': Login,
    '/': DailyIndex,
    '/daily-entries': DailyEntries,
    '/daily-entries/:id': DailyEntry,
  };

  onMount(async () => {
    const tokenObj = await Preferences.get({ key: 'token' });
    const emailObj = await Preferences.get({ key: 'email' });
    const token = tokenObj.value;
    const email = emailObj.value;
    
    if (!token || !email) {
      user = null;
      loading = false;
      if ($location !== '/signup' && $location !== '/login') {
        push('/signup');
      }
    } else {
      const response = await fetchData('validate', { token, email }, 'POST');
      if (response.error) {
        user = null;
        if ($location !== '/signup' && $location !== '/login') {
          push('/signup');
        }
      } else {
        user = response;
        await Preferences.set({ key: 'token', value: user.token });
        if ($location.includes('/signup')
          || $location.includes('/login')) {
          push('/');
        }
      }
      loading = false;
    }
  });

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
  <div class="h-6 lg:h-8 flex-shrink-0"></div>
  <div id="content" class="h-full w-full mx-auto max-w-2xl flex flex-col gap-8 relative z-30">
    <Router {routes} />
  </div>
  {#if user}
    <TabDock />
  {/if}

  <Toasts {notifications} />

  {#if !user}
    <div
      id="background"
      class="bg-cover dark:hidden bg-no-repeat bg-center fixed top-0 left-0 w-full h-full z-20"
      style="background-image: url({lightBg});"
    ></div>
    <div
      id="background"
      class="bg-cover hidden dark:block opacity-[0.35] bg-no-repeat bg-center fixed top-0 left-0 w-full h-full z-20"
      style="background-image: url({darkBg});"
    ></div>
  {/if}
{/if}
