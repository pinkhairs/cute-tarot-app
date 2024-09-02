import today from '/assets/today.png';
import visionBoards from '/assets/vision-boards.png';

class TabDock extends HTMLElement {
  constructor() {
    super();
    this.avatar = '';
  }

  async getAvatar() {
    const response = await fetch('/pwa.php?action=get_avatar');
    const avatar = await response.json();
    return avatar;
  }

  connectedCallback() {
    this.getAvatar().then(data => {
      const json = JSON.parse(data);
      this.avatar = json.avatar;
      this.render();
    });
  }

  render() {
    this.innerHTML = `
      <div class="w-max p-3 grid grid-cols-3 -max backdrop-blur-md bg-[rgba(255,255,255,.85)] shadow-[0_0_40px_-8px_rgba(85,123,193,0.2)] items-center rounded-3xl h-24 justify-center gap-2">
        <div class="flex items-center">
          <button hx-push-url="/app/" type="button" hx-get="/app/tarot-index.html" hx-target="#content">
            <img src="${today}" alt="Today" class="rounded-xl h-16">
          </button>
        </div>
        <div class="flex items-center">
          <button hx-push-url="/app/vision-boards.html" type="button" hx-get="/app/vision-boards-index.html" hx-target="#content">
            <img src="${visionBoards}" alt="Vision Boards" class="rounded-xl h-16">
          </button>
        </div>
        <div class="flex items-center">
          <button hx-push-url="/app/you.html" type="button" hx-get="/app/you-index.html" hx-target="#content">
            <img src="${this.avatar}" id="avatar" alt="You" class="rounded-xl w-16 h-16">
          </button>
        </div>
      </div>
    `;
    
    htmx.process(this);
  }
}

customElements.define('tab-dock', TabDock);