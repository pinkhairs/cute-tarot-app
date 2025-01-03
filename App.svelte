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
  import DigitalIndex from '@/src/components/DigitalIndex.svelte';
  import DigitalEntries from '@/src/components/DigitalEntries.svelte';
  import DigitalEntry from '@/src/components/DigitalEntry.svelte';
  import ReferenceIndex from '@/src/components/ReferenceIndex.svelte';
  import ReferenceEntry from '@/src/components/ReferenceEntry.svelte';
  import You from '@/src/components/You.svelte';
  import YouPentacles from '@/src/components/YouPentacles.svelte';
  import YouSettings from '@/src/components/YouSettings.svelte';
  import Interpretation from '@/src/components/Interpretation.svelte';
  import SignupLogin from './src/components/SignupLogin.svelte';
  import { user, customAvatar, loading } from '@/src/store.js';

  let notifications = [];
  let validating = true;
  let loggedIn = null;

  user.subscribe((value) => {
    loggedIn = value;
    console.log('loggedIn', loggedIn);
    if (typeof loggedIn === 'boolean') {
      validating = false;
    }
  });

  const routes = {
    '/signup-or-login': SignupLogin,
    '/': DailyIndex,
    '/daily-entries': DailyEntries,
    '/daily-entries/:id': DailyEntry,
    '/digital': DigitalIndex,
    '/digital-entries': DigitalEntries,
    '/digital-entries/:id': DigitalEntry,
    '/reference': ReferenceIndex,
    '/reference-entry/:id': ReferenceEntry,
    '/interpretation/:id': Interpretation,
    '/you': You,
    '/you-pentacles': YouPentacles,
    '/you-settings': YouSettings,
  };
  
  async function setup() {
    customAvatar.set((await Preferences.get({ key: 'avatar' })).value);
    if (!loggedIn && (await Preferences.get({ key: 'deck' })).value !== 'Spoopy Tarot' && (await Preferences.get({ key: 'deck' })).value !== 'Kawaii Tarot') {
      await Preferences.set({ key: 'deck', value: 'Spoopy Tarot' });
    }
    validate();
  }
 
  async function validate() {
    if ((await Preferences.get({ key: 'token' })).value) {
      const response = await fetchData('validate', { token: (await Preferences.get({key: 'token'})).value, email: (await Preferences.get({key: 'email'})).value }, 'POST');
      if (response.token) {
        await Preferences.set({ key: 'token', value: response.token });
        user.set(true);
        window.ls("setUserId", (await Preferences.get({ key: 'email' })).value);
        return true;
      } else {
        user.set(false);
        await Preferences.remove({ key: 'token' });
      }
    } else {
      user.set(false);
    }
  }

  onMount(() => {
    setup();
    loading.set(false);
  });
</script>
<Loader />
<Toasts {notifications} />
<div class="h-6 lg:h-8 flex-shrink-0"></div>
<div id="content" class="flex-1 h-full w-full mx-auto max-w-2xl flex flex-col gap-8 relative z-30">
  <Router {routes} />
</div>
<TabDock />
{#if $location == '/signup-or-login'}
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