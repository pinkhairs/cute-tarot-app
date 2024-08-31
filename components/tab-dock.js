import today from '/assets/today.png';
import visionBoards from '/assets/vision-boards.png';
import you from '/assets/avatar-example.jpg';

class TabDock extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="w-max p-3 grid grid-cols-3 backdrop-blur-md bg-[rgba(255,255,255,.85)] shadow-[0_0_40px_-8px_rgba(85,123,193,0.2)] items-center rounded-3xl h-24 justify-center gap-2">
        <div class="flex items-center">
          <a href="/app/">
            <img src="${today}" alt="Today" class="rounded-xl h-16">
          </a>
        </div>
        <div class="flex items-center">
          <a href="/app/vision-boards.html">
            <img src="${visionBoards}" alt="Vision Boards" class="rounded-xl h-16">
          </a>
        </div>
        <div class="flex items-center">
          <a href="/app/you.html">
            <img src="${you}" alt="You" class="rounded-xl h-16">
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('tab-dock', TabDock);