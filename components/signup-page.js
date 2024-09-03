class SignupPage extends HTMLElement {
  constructor() {
    super();
    this.nonce = '';
  }

  async fetchNonce() {
    const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=get_nonce`, {
      credentials: 'include'
    });
    this.nonce = await response.text();
    this.render();
  }

  connectedCallback() {
    this.fetchNonce();
    hideLoadingScreen();
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full" title="Welcome to Cute Tarot!" subtitle="Sign up to get free tarot readings with Kawaii Tarot and Spoopy Tarot"></title-bar>
    <form id="signup" class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="first_name" class="label opacity-80 font-serif">First name</label>
        <input id="first_name" name="first_name" placeholder="Your first name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="email" class="label opacity-80 font-serif">Email address</label>
        <input required id="email" type="email" name="email" placeholder="example@cutetarot.com" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
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
      showLoadingScreen();
      const signupRequest = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=account_signup&_wpnonce=${this.nonce}`, {
        method: 'POST',
        credentials: 'include',
        body: new FormData(document.querySelector('form'))
      });
      const signupResponse = await signupRequest.text();
      if (signupResponse == 1) {
        window.location.reload();
      } else {
        hideLoadingScreen();
        alert('There was an error with your signup. Maybe you already have an account? Please contact info@cutetarot.com if you need help.');
      }
    });
  }
}

customElements.define('signup-page', SignupPage);