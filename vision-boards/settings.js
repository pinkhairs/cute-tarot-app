class VisionBoardsSettings extends HTMLElement {
  constructor() {
    super();
    this.value = '';
  }

  async getNonce() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_credentials`, {
      credentials: 'include'
    });
    const userInfo = await response.json();
    this.nonce = userInfo.nonce;
    return userInfo.nonce;
  }

  connectedCallback() {
    this.getNonce().then(() => {
      const placeCreateNew = async () => await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=place_create_new&_wpnonce=${this.nonce}`, { credentials: 'include' });
      placeCreateNew().then(async data => {
        this.value = await data.text();
        if (this.value === '') this.value = 'first';
        this.render();
        hideLoadingScreen();
      });
    });
  }

  render() {
    const saveCreateNew = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_create_new&value=${this.value}&_wpnonce=${this.nonce}`, { credentials: 'include' });
      const data = await response.text();
      return data;
    }

    const options = `
      <option value="first" ${this.value === 'first' ? 'selected' : ''}>First</option>
      <option value="last" ${this.value === 'last' ? 'selected' : ''}>Last</option>
    `;
    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-index.html" class="w-full" title="Settings" subtitle="Changes will save automatically"></title-bar>
    <form class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Place "Create New"</label>
        <select id="deck" class="bg-white px-6 py-2 rounded-lg text-xl">
          ${options}
        </select>
      </div>
    </form>
    `;

    document.getElementById('deck').addEventListener('change', (event) => {
      this.value = event.target.value;
      saveCreateNew();
    });
  }
}

customElements.define('vision-boards-settings', VisionBoardsSettings);