import { setToken } from '@/auth';
import { Preferences } from '@capacitor/preferences';

class LoginPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    hideLoadingScreen();
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full" title="Hello again" subtitle="Come on in!"></title-bar>
    <div id="login" class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
        <label for="email" class="label opacity-80 font-serif">Email address</label>
        <input required id="email" type="email" name="email" placeholder="example@cutetarot.com" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
        <label for="password" class="label opacity-80 font-serif">Password</label>
        <input required type="password" id="password" name="password" placeholder="• • • • •" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>
      <button id="login-button" type="button" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Log In</button>
      <a href="https://cutetarot.com/wp-login.php?action=lostpassword" target="_blank" class="text-brand font-bold text-lg">Forgot password?</a>
      <button hx-get="/account-signup-page.html" hx-target="#content" class="text-brand font-bold text-lg" type="button">Signup instead</button>
      <div class="h-4"></div>
    </div>`;

    htmx.process(this);

    document.getElementById('login-button').addEventListener('click', async () => {
      showLoadingScreen();
        const formData = new FormData();
        formData.append('username', document.getElementById('email').value);
        formData.append('password', document.getElementById('password').value);
        const timestamp = Date.now();

        const loginRequest = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=account_login&${timestamp}=${timestamp}`, {
          method: 'POST',
          body: formData
        });

        const loginResponse = await loginRequest.json();

        try {
          await setToken(loginResponse.token);
          const userId = loginResponse.user_id
          await Preferences.set({ key: 'user_id', value: userId });

          // Clear the 'alreadyRedirected' flag upon successful login
          await Preferences.set({ key: 'go_to_login', value: 'false' });
          htmx.ajax('GET', '/tarot-index.html', { target: '#content' });
        } catch (error) {
          alert('There was an error with your login. Try resetting your password. Please contact info@cutetarot.com if you need help.');
        }
        hideLoadingScreen();
      });
  }
}

customElements.define('login-page', LoginPage);
