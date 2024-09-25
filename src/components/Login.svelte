<script>
  import TitleBar from '@/src/components/TitleBar.svelte';
  import fetchData from '@/src/fetchData.js';
  import { Preferences } from '@capacitor/preferences';
  import Toasts from '@/src/components/Toasts.svelte';
  import { userStore } from '@/src/stores.js';
  import { push } from 'svelte-spa-router'; // Import push for navigation

  let notifications = [];
  let email = '';
  let password = '';

  const handleSubmit = async () => {
    const response = await fetchData('login', { email, password }, 'POST');

    if (response.error) {
      notifications = [...notifications, { message: response.error, type: 'error' }];
    } else {
      await Preferences.set({ key: 'token', value: response.token });
      notifications = [
        ...notifications,
        { message: 'Success! Redirecting you now...', type: 'success' },
      ];

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

      push('/');
    }
  };

  // Handler for "Signup instead" button
  const goToSignup = () => {
    push('/signup'); // Navigate to the signup page
  };
</script>

<Toasts {notifications} />
<TitleBar title="Hello again" subtitle="Welcome back!" />
<form
  on:submit|preventDefault={handleSubmit}
  class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6"
>
  <div
    class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-3 w-full rounded-2xl"
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
    class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-3 w-full rounded-2xl"
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
    id="login-button"
    type="submit"
    class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3"
  >
    Log In
  </button>
  <a
    href="https://cutetarot.com/wp-login.php?action=lostpassword"
    target="_blank"
    class="text-brand dark:text-neutral font-bold text-lg"
    >Forgot password?</a
  >
  <button
    type="button"
    on:click={goToSignup}
    class="text-brand dark:text-neutral font-bold text-lg"
  >
    Signup instead
  </button>
</form>
