class YouSettings extends HTMLElement {
  constructor() {
    super();
    this.first_name = '';
    this.last_name = '';
    this.email = '';
  }

  async fetchProfile() {
    const response = await fetch('/pwa.php?action=get_account_info');
    const json = await response.json();
    const profile = JSON.parse(json);
    this.first_name = profile.first_name;
    this.last_name = profile.last_name;
    this.email = profile.email;
    this.render();
  }

  connectedCallback() {
    this.fetchProfile();
    hideLoadingScreen();
  }

  render() {
    this.innerHTML = `
    <title-bar data-back-link="/app/you-index.html" class="w-full" title="Settings" subtitle="Remember to save changes"></title-bar>
    <form method="post" action="/pwa.php?action=save_account_info" class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="first_name" class="label opacity-80 font-serif">First name</label>
        <input id="first_name" name="first_name" placeholder="First name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value="${this.first_name}" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="last_name" class="label opacity-80 font-serif">Last name</label>
        <input id="last_name" name="last_name" placeholder="Last name" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value="${this.last_name}" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="email" class="label opacity-80 font-serif">Last name</label>
        <input type="email" id="email" name="email" placeholder="you@cutetarot.com" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" value="${this.email}" />
      </div>

      <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl">
        <label for="password" class="label opacity-80 font-serif">Password (only if changing)</label>
        <input type="password" id="password" name="password" placeholder="• • • • •" class="text-center focus:outline-none focus:bg-neutral transition-colors w-full rounded-xl p-2 bg-transparent" />
      </div>
      <button type="submit" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Save Information</button>
    </form>
    <form method="post" action="/pwa.php?action=log_out" class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <button class="text-brand font-bold text-lg" type="submit">Log out</button>
    </form>
    <div class="h-4"></div>
    `;
  }
}

customElements.define('you-settings', YouSettings);