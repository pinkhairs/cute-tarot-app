<script>
  import TitleBar from '@/src/components/TitleBar.svelte';
  import Toasts from '@/src/components/Toasts.svelte';
  import Loader from '@/src/components/Loader.svelte';
  import { onMount } from 'svelte';
  import { push, replace } from 'svelte-spa-router';
  import { Preferences } from '@capacitor/preferences';
  import fetchData from '@/src/fetchData.js';

  let notifications = [];
  let loading = true;
  let first_name;
  let last_name;
  let email;
  let avatar;

  onMount(() => {
    loading = false;
    setup();
  });

  async function setup() {
    first_name = (await Preferences.get({ key: 'first_name' })).value;
    last_name = (await Preferences.get({ key: 'last_name' })).value;
    email = (await Preferences.get({ key: 'email' })).value;
  }

  function close() {
    push('/you');
  }

  async function logOut() {
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'email' });
    await Preferences.remove({ key: 'first_name' });
    await Preferences.remove({ key: 'last_name' });
    await Preferences.remove({ key: 'deck' });
    await Preferences.remove({ key: 'avatar' });

    replace('/login');
  }

  async function updateSettings() {
    const password = document.getElementById('password').value ? document.getElementById('password').value : null;
    const newAvatar = document.getElementById('new_avatar').files ? document.getElementById('new_avatar').files[0] : null;
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;

    const send = { first_name, last_name, email };
    if (password) {
      send.password = password;
    }
    if (newAvatar) {
      send.avatar = newAvatar;
    }

    const response = await fetchData('settings', send, 'POST');

    if (response.error) {
      notifications = [...notifications, { message: response.error, type: 'error' }];
    } else {
      await Preferences.set({ key: 'first_name', value: response.first_name });
      await Preferences.set({ key: 'last_name', value: response.last_name });
      await Preferences.set({ key: 'email', value: response.email });

      if (newAvatar) {
        await Preferences.set({ key: 'avatar', value: response.avatar });
      }

      document.getElementById('password').value = '';
      notifications = [...notifications, { message: 'Success! Your settings have been updated.', type: 'success' }];
    }
  }

  function updateAvatar() {
    avatar = URL.createObjectURL(document.getElementById('new_avatar').files[0]);
  }
</script>

<Toasts {notifications}></Toasts>
{#if loading}
  <Loader />
{:else}
  <TitleBar title="Settings">
    <div slot="left-action">
      <button on:click={close} class="close-button">&lt;</button>
    </div>
    <div slot="right-action"></div>
  </TitleBar>
  <div class="px-6 flex flex-col gap-6">
  <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-3 w-full rounded-2xl">
    <label for="first_name" class="label opacity-80 font-serif">First name</label>
    <input id="first_name" name="first_name" placeholder="First name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value={first_name} />
  </div>

  <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-3 w-full rounded-2xl">
    <label for="last_name" class="label opacity-80 font-serif">Last name</label>
    <input id="last_name" name="last_name" placeholder="Last name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value={last_name} />
  </div>

  <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-3 w-full rounded-2xl">
    <label for="email" class="label opacity-80 font-serif">Email</label>
    <input type="email" id="email" name="email" placeholder="example@cutetarot.com" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value={email} />
  </div>

  <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-3 w-full rounded-2xl">
    <label for="new_avatar" class="label opacity-80 w-full text-center font-serif">
      Avatar
      {#if avatar}
        <img src={avatar} on:click={() => avatar = null} class="rounded-xl mt-2 w-16 h-16 mx-auto" />
      {:else}
        <div class="border-dashed border-2 font-sans text-lg border-[#B5BECE] py-2.5 mt-2 w-full rounded-xl">Upload</div>
      {/if}
      <input id="new_avatar" on:input={updateAvatar} name="avatar" class="hidden" type="file" />
    </label>
  </div>

  <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-3 w-full rounded-2xl">
    <label for="password" class="label opacity-80 font-serif">Password (only if changing)</label>
    <input type="password" id="password" name="password" placeholder="• • • • •" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
  </div>
  
  <button on:click={updateSettings} id="account-button" type="submit" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Save Information</button>
  <div class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
    <button on:click={logOut} id="logout-button" class="text-brand font-bold text-lg" type="button">Log out</button>
  </div>
  <div class="h-6"></div>
  </div>
{/if}