class TabDock extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="p-3 grid grid-cols-3 max-w-max backdrop-blur-md bg-[rgba(255,255,255,.85)] shadow-[0_0_40px_-8px_rgba(85,123,193,0.2)] items-center rounded-3xl h-24 justify-center gap-2">
        <div class="flex items-center">
          <a href="/">
            <img src="/assets/today.png" alt="Today" class="rounded-xl h-16">
          </a>
        </div>
        <div class="flex items-center">
          <a href="/vision-boards.html">
            <img src="/assets/vision-boards.png" alt="Vision Boards" class="rounded-xl h-16">
          </a>
        </div>
        <div class="flex items-center">
          <a href="/you.html">
            <img src="/assets/avatar-example.jpg" alt="You" class="rounded-xl h-16">
          </a>
        </div>
      </div>
    `;
  }
}

customElements.define('tab-dock', TabDock);