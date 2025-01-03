<script>
  import TitleBar from '@/src/components/TitleBar.svelte';
  import fetchData from '@/src/fetchData.js';
  import { Preferences } from '@capacitor/preferences';
  import Toasts from '@/src/components/Toasts.svelte';
  import { pop, push, querystring } from 'svelte-spa-router'; // Import push for navigation
  import { user, customAvatar } from '@/src/store.js';

  let notifications = [];
  let email = '';
  let password = '';
  let otp;

  const handleSubmit = async () => {
    const response = await fetchData('login', { otp: 1, email, password,
      first_card: (await Preferences.get({ key: 'today-id' })).value,
      today: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    }, 'POST');

    if (response.error) {
      notifications = [...notifications, { message: response.error, type: 'error' }];
    } else {
      await Preferences.set({ key: 'token', value: response.token });
      notifications = [...notifications, { message: 'Success! Redirecting you now...', type: 'success' }];

      const login = response.user;
      const newUser = login.new_user;
      window.ls("setUserId", login.email);

      await Preferences.set({ key: 'email', value: login.email });
      await Preferences.set({ key: 'deck', value: login.deck });
      await Preferences.set({ key: 'first_name', value: login.first_name });
      await Preferences.set({ key: 'avatar', value: login.avatar });
      customAvatar.set(login.avatar);

      window.ls('track', {
        event: newUser ? 'Signup' : 'Login',
        channel: 'account',
        icon: '🔑',
      });
      
      user.set(true);

      push('/');
    }
  };

  const sendOtp = async () => {
    otp = true;
    const response = await fetchData('otp', { email }, 'POST');

    if (response.error) {
      notifications = [...notifications, { message: response.error, type: 'error' }];
    } else {
      notifications = [...notifications, { message: 'Success! Check your email for a one-time password.', type: 'success' }];
    }
  };

  const close = () => {
    pop();
  };
</script>

<Toasts {notifications} />
<TitleBar title="Happy you're here." subtitle="Sign up or log in with this form to access all features." />
<form
  on:submit|preventDefault={() => password ? handleSubmit() : null}
  class="w-full mx-auto flex-col px-4 flex-1 flex items-center justify-start gap-6"
>

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
  {#if otp}
    <div
      class="field flex flex-col items-center justify-between p-3.5 text-black bg-translucent gap-3 w-full rounded-2xl"
    >
      <label for="password" class="label opacity-80 font-serif">Password 🪄</label>
      <input
        required
        type="text"
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
      Log In
    </button>
    <button
      on:click={() => {
        otp = false;
        password = '';
      }}
      type="button"
      class="text-brand font-bold text-lg"
    >
      Start Over
    </button>
  {:else}
    <button
      type="button"
      disabled={!email}
      on:click={sendOtp}
      class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-4 py-3"
    >
      Send One-time Password
    </button>
  {/if}
</form>
