import { fetchWithAuth } from '@/auth';

class YouSettings extends HTMLElement {
  constructor() {
    super();
    this.first_name = '';
    this.last_name = '';
    this.email = '';
  }

  async fetchProfile() {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_account_info`);
      const profile = await response.json();
      console.log(profile);
      this.first_name = profile.first_name;
      this.last_name = profile.last_name;
      this.email = profile.email;
      this.render();
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  connectedCallback() {
    this.fetchProfile();
    hideLoadingScreen();
  }

  render() {
    this.innerHTML = `
    <title-bar data-back-link="/you-index.html" class="w-full" title="Settings" subtitle="Remember to save changes"></title-bar>
    <form id="account-form" method="post" class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
        <label for="first_name" class="label opacity-80 font-serif">First name</label>
        <input id="first_name" name="first_name" placeholder="First name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value="${this.first_name}" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
        <label for="last_name" class="label opacity-80 font-serif">Last name</label>
        <input id="last_name" name="last_name" placeholder="Last name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value="${this.last_name}" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
        <label for="email" class="label opacity-80 font-serif">Email</label>
        <input type="email" id="email" name="email" placeholder="example@cutetarot.com" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value="${this.email}" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
        <label for="password" class="label opacity-80 font-serif">Password (only if changing)</label>
        <input type="password" id="password" name="password" placeholder="• • • • •" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>
      <button type="submit" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Save Information</button>
    </form>
    <form id="logout-form" method="post" class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <button class="text-brand font-bold text-lg" type="submit">Log out</button>
    </form>
    <div class="h-4"></div>
    `;

    document.getElementById('account-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('first_name', document.getElementById('first_name').value);
      formData.append('last_name', document.getElementById('last_name').value);
      formData.append('email', document.getElementById('email').value);
      formData.append('password', document.getElementById('password').value);
      
      try {
        await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_account_info`, {
          method: 'POST',
          body: formData,
        });
        if (formData.get('password')) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error saving account info:', error);
      }
    });

    document.getElementById('logout-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=log_out`, { method: 'POST' });
        window.location.href = '/account-login-page.html';
      } catch (error) {
        console.error('Error logging out:', error);
      }
    });
  }
}

customElements.define('you-settings', YouSettings);
