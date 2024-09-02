class VisionBoardEntries extends HTMLElement {
  constructor() {
    super();
    this.entries = [];
  }

  connectedCallback() {
    this.fetchEntries();
  }


  async fetchEntries() {
    const response = await fetch('/pwa.php?action=vision_boards');
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    const json = await response.json();
    this.entries = JSON.parse(json);
    this.render();
    hideLoadingScreen();
  }

  render() {
    const entriesHtml = this.entries.map(entry => `
      <li class="flex break-all pb-4 mb-4">
        <a href="/app/vision-boards/entry.html?id=${entry.slug}" class="flex items-center">
          <div>
            <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-xl bg-neutral bg-cover bg-no-repeat bg-center" style="background-image: ${entry.icon.includes('//') ? `url(${entry.icon})` : `${entry.icon}`}">
            ${entry.icon.includes('//') ? '' : entry.firstCharacter}
            </div>
          </div>
          <div class="flex-grow pl-4">
            <h3 class="mb-2 break-all">${entry.title}</h3>
            <p class="leading-relaxed">${entry.imageCount} images</p>
            <p class="leading-relaxed opacity-80 text-sm">Created ${entry.created}</p>
          </div>
        </a>
      </li>
    `).join('');

    this.innerHTML = `
    <title-bar class="w-full" title="Entries"></title-bar>
    <div class="w-full px-6 flex-1 flex items-start justify-center">
      <div class="flex-1">
        <ul class="">
          ${entriesHtml}
        </ul>
      </div>
    </div>
    `;
  }
}

customElements.define('vision-board-entries', VisionBoardEntries);