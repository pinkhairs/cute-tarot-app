import { setToken } from '@/auth';

class SignupPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full mb-3" title="Welcome to Cute Tarot!" subtitle=""></title-bar>
    <form id="signup" class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
        <label for="first_name" class="label opacity-80 font-serif">First name</label>
        <input id="first_name" name="first_name" placeholder="Your first name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
        <label for="email" class="label opacity-80 font-serif">Email address</label>
        <input required id="email" type="email" name="email" placeholder="example@cutetarot.com" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
        <label for="password" class="label opacity-80 font-serif">Password</label>
        <input required type="password" id="password" name="password" placeholder="• • • • •" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>
      <button type="submit" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Sign up &amp; continue</button>
      <button hx-get="/account-login-page.html" hx-target="#content" class="text-brand font-bold text-lg" type="button">Log in instead</button>
      <div class="h-4"></div>
    </form>
    `;

    htmx.process(this);

    document.getElementById('signup').addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData();
      formData.append('first_name', document.getElementById('first_name').value);
      formData.append('email', document.getElementById('email').value);
      formData.append('password', document.getElementById('password').value);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=account_signup`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        await setToken(result.token);
        htmx.ajax('GET', '/tarot-index.html', { target: '#content' });
      } else {
        alert('There was an error with your signup. Maybe you already have an account? Please contact info@cutetarot.com if you need help.');
      }dingScreen();
    });
  }
}

customElements.define('signup-page', SignupPage);
