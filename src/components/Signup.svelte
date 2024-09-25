<script>
  import TitleBar from '@/src/components/TitleBar.svelte';
  import fetchData from '@/src/fetchData.js';
  import { Preferences } from '@capacitor/preferences';
  import Toasts from '@/src/components/Toasts.svelte';
  import { userStore } from '@/src/stores.js';
  import { push } from 'svelte-spa-router'; // Import push for navigation

  let notifications = [];
  let first_name = '';
  let email = '';
  let password = '';

  const handleSubmit = async () => {
    const response = await fetchData('signup', { first_name, email, password }, 'POST');

    if (response.error) {
      notifications = [...notifications, { message: response.error, type: 'error' }];
    } else {
      await Preferences.set({ key: 'token', value: response.token });
      notifications = [...notifications, { message: 'Success! Redirecting you now...', type: 'success' }];

      const login = response.user;

      userStore.set({
        first_name: login.first_name,
        last_name: login.last_name,
        avatar: login.avatar,
        pentacles: login.pentacles,
        badges: login.badges,
        readings: login.readings,
        insights: login.insights,
        topics: login.topics,
        lookups: login.lookups,
      });

      await Preferences.set({ key: 'email', value: login.email });
      await Preferences.set({ key: 'deck', value: login.deck });
      await Preferences.set({
        key: 'timezone',
        value: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      // Navigate to the home page after successful signup
      push('/'); // Use push from svelte-spa-router to navigate
    }
  };

  // Handler for "Log In Instead" button
  const goToLogin = () => {
    push('/login'); // Navigate to the login page
  };
</script>

<Toasts {notifications} />
<TitleBar title="Welcome!" subtitle="Create an account to get started" />
<form
  on:submit|preventDefault={handleSubmit}
  class="w-full mx-auto flex-col px-4 flex-1 flex items-center justify-start gap-6"
>
  <div
    class="field flex flex-col items-center justify-between p-3.5 text-black bg-translucent gap-3 w-full rounded-2xl"
  >
    <label for="first_name" class="label opacity-80 font-serif">First name</label>
    <input
      id="first_name"
      name="first_name"
      placeholder="Your first name"
      bind:value={first_name}
    />
  </div>

  <div
    class="field flex flex-col items-center justify-between p-3.5 text-black bg-translucent gap-3 w-full rounded-2xl"
  >
    <label for="email" class="label opacity-80 font-serif">Email address</label>
    <input
      required
      id="email"
      type="email"
      name="email"
      placeholder="example@cutetarot.com"
      bind:value={email}
    />
  </div>

  <div
    class="field flex flex-col items-center justify-between p-3.5 text-black bg-translucent gap-3 w-full rounded-2xl"
  >
    <label for="password" class="label opacity-80 font-serif">Password</label>
    <input
      required
      type="password"
      id="password"
      name="password"
      placeholder="• • • • •"
      bind:value={password}
    />
  </div>
  <button
    type="submit"
    class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-4 py-3"
  >
    Sign Up &amp; Continue
  </button>
  <!-- Update the button to include on:click handler -->
  <button
    type="button"
    on:click={goToLogin}
    class="text-brand dark:text-neutral font-bold text-lg"
  >
    Log In Instead
  </button>
</form>
