import today from '/assets/today.png';
import visionBoards from '/assets/vision-boards.png';

class TabDock extends HTMLElement {
  constructor() {
    super();
    this.avatar = '';
    this.nonce = '';
  }

  async getNonce() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_credentials`, {
      credentials: 'include'
    });
    const userInfo = await response.json();
    return userInfo.nonce;
  }

  async getAvatar() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_avatar&_wpnonce=${this.nonce}`, { credentials: 'include' });
    return await response.text();
  }
  connectedCallback() {
    this.getNonce().then((nonce) => {
      this.nonce = nonce;
      this.getAvatar().then(avatar => {
        this.avatar = avatar;
        this.render();
      });
    });
  }

  render() {
    this.innerHTML = `
      <div class="w-max p-3 grid grid-cols-3 -max backdrop-blur-md bg-[rgba(255,255,255,.85)] shadow-[0_0_40px_-8px_rgba(85,123,193,0.2)] items-center rounded-3xl h-24 justify-center gap-2">
        <div class="flex items-center">
          <button type="button" hx-get="/tarot-index.html" hx-target="#content">
            <img src="${today}" alt="Today" class="rounded-xl h-16">
          </button>
        </div>
        <div class="flex items-center">
          <button type="button" hx-get="/vision-boards-index.html" hx-target="#content">
            <img src="${visionBoards}" alt="Vision Boards" class="rounded-xl h-16">
          </button>
        </div>
        <div class="flex items-center">
          <button type="button" hx-get="/you-index.html" hx-target="#content">
            <img src="${this.avatar}" id="avatar" alt="You" class="rounded-xl w-16 h-16">
          </button>
        </div>
      </div>
    `;
    
    htmx.process(this);
  }
}

customElements.define('tab-dock', TabDock);