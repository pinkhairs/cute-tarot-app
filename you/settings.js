class YouSettings extends HTMLElement {
  constructor() {
    super();
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.nonce = '';
  }

  async getNonce() {
    const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=get_credentials`, {
      credentials: 'include'
    });
    const userInfo = await response.json();
    this.nonce = userInfo.nonce;
    return userInfo.nonce;
  }

  async fetchProfile() {
    this.getNonce().then(async () => {
      const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=get_account_info&_wpnonce=${this.nonce}`, { credentials: 'include' });
      const profile = await response.json();
      console.log(profile);
      this.first_name = profile.first_name;
      this.last_name = profile.last_name;
      this.email = profile.email;
      this.render();
    });
  }

  connectedCallback() {
    this.fetchProfile();
    hideLoadingScreen();
  }

  render() {
    this.innerHTML = `
    <title-bar data-back-link="/you-index.html" class="w-full" title="Settings" subtitle="Remember to save changes"></title-bar>
    <form id="account-form" method="post" class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="first_name" class="label opacity-80 font-serif">First name</label>
        <input id="first_name" name="first_name" placeholder="First name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value="${this.first_name}" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="last_name" class="label opacity-80 font-serif">Last name</label>
        <input id="last_name" name="last_name" placeholder="Last name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value="${this.last_name}" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="email" class="label opacity-80 font-serif">Email</label>
        <input type="email" id="email" name="email" placeholder="example@cutetarot.com" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value="${this.email}" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="password" class="label opacity-80 font-serif">Password (only if changing)</label>
        <input type="password" id="password" name="password" placeholder="• • • • •" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>
      <button type="submit" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Save Information</button>
    </form>
    <form method="post" action="${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=log_out&_wpnonce=${this.nonce}" class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <button class="text-brand font-bold text-lg" type="submit">Log out</button>
    </form>
    <div class="h-4"></div>
    `;

    document.getElementById('account-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=save_account_info&_wpnonce=${this.nonce}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      // if password was set
      if (formData.get('password')) {
        window.location.reload();
      }
    });
  }
}

customElements.define('you-settings', YouSettings);