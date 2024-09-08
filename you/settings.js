import { removeToken, fetchWithAuth } from '@/auth';
import { trackEvent, identify, getUserId } from '@/logsnag';

class YouSettings extends HTMLElement {
  constructor() {
    super();
    this.first_name = '';
    this.last_name = '';
    this.email = '';
  }

  async fetchProfile() {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_account_info`, { }, false);
      const profile = await response.json();
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



    <div class="field flex items-center justify-between p-4 text-black bg-brand gap-3 w-full rounded-2xl">
    <div class="flex items-center gap-3">
    <div>
<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="28" cy="28" r="28" fill="#F6D072"/>
<circle cx="28" cy="28" r="22.9375" class="stroke-brand" stroke-width="3"/>
<path d="M20.5002 36.7489L21.1829 32.2183C21.2764 31.5958 21.0579 30.9673 20.5997 30.5378L17.2537 27.4058C16.0976 26.3236 16.6839 24.3838 18.2469 24.1246L22.767 23.374C23.388 23.2715 23.9185 22.8691 24.1853 22.2994L26.1311 18.15C26.8033 16.7152 28.829 16.6745 29.5585 18.0807L31.6686 22.1486C31.958 22.7078 32.5051 23.0876 33.1291 23.1645L37.6763 23.7312C39.2483 23.9271 39.913 25.8413 38.8007 26.9702L35.5843 30.2348C35.1427 30.6824 34.9498 31.32 35.0688 31.9379L35.934 36.4385C36.2339 37.9939 34.6182 39.2177 33.2014 38.5094L29.1033 36.4596C28.5411 36.1777 27.8749 36.1913 27.3248 36.4957L23.3126 38.7083C21.926 39.474 20.2636 38.3164 20.5002 36.7489Z"class="fill-brand"/>
</svg>

    </div>
    <div>
    <div class="label opacity-80 font-serif text-white">Pentacles</div>
    <h1 class="text-3xl font-serif text-white">100</h1>

    </div>
    </div>
    <div>      <button hx-get="/you-pentacles.html" hx-target="#content" type="button" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-accent font-serif text-black rounded-xl px-4 py-2">Get More</button>
</div>
  </div>
  <p class="text-center text-sm opacity-80">Pentacles are credits you can use around the app. No subscription—just a pay-as-you-go system so you can invest more in your manifestations.</p>
  
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
      <button id="account-button" type="submit" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Save Information</button>
    </form>
    <div class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <button id="logout-button" class="text-brand font-bold text-lg" type="button">Log out</button>
    </div>
    <div class="h-4"></div>
    `;

    htmx.process(this);

    document.getElementById('account-button').addEventListener('click', async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('first_name', document.getElementById('first_name').value);
      formData.append('last_name', document.getElementById('last_name').value);
      formData.append('email', document.getElementById('email').value);
      formData.append('password', document.getElementById('password').value);
      
      trackEvent('your-account', 'Update account', '🔒');
      const loggify = await identify({
        user_id: await getUserId(),
        email: document.getElementById('email').value,
        name: document.getElementById('first_name').value + ' ' + document.getElementById('last_name').value
      });
      console.log(loggify);

      try {
        await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_account_info`, {
          method: 'POST',
          body: formData,
        }, false);
        if (formData.get('password')) {
          await removeToken();
          htmx.ajax('GET', '/account-login-page.html', { target: '#content' });
        }
      } catch (error) {
        console.error('Error saving account info:', error);
      }
    });

    document.getElementById('logout-button').addEventListener('click', async (e) => {
      await removeToken();
      trackEvent('your-account', 'Log out', '🔒', false);
      htmx.ajax('GET', '/account-login-page.html', { target: '#content' });
      return;
    });
  }
}

customElements.define('you-settings', YouSettings);
