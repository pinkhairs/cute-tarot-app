class VisionBoardsIndex extends HTMLElement {
  constructor() {
    super();
    this.entries = [];
    this.placeCreateNew = null;
  }

  connectedCallback() {
    this.fetchEntries();
  }


  async fetchEntries() {
    const response = await fetch('/pwa.php?action=vision_boards');
    if (!response.ok) {
      return;
    }
    const json = await response.json();
    this.entries = JSON.parse(json);
    const placeCreateNew = await fetch('/pwa.php?action=place_create_new');
    if (!placeCreateNew.ok) {
      this.placeCreateNew = 'first';
    } else {
      const createNewJson = await placeCreateNew.json();
      this.placeCreateNew = JSON.parse(createNewJson).place;
    }

    this.render();
  }

  render() {
    const entriesHtml = this.entries.map(entry => `
      <a href="/app/vision-boards/entry.html?id=${entry.slug}" class="flex flex-col items-center">
        <div class="text-2xl w-[72px] h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0 flex items-center justify-center rounded-xl bg-neutral bg-cover bg-no-repeat bg-center" style="background: ${entry.icon.includes('//') ? `url(${entry.icon})` : `${entry.icon}`}">
        ${entry.icon.includes('//') ? '' : entry.firstCharacter}
        </div>
        <p class="w-[72px] lg:w-[96px] mt-2 text-center opacity-80 text-sm">${entry.title}</p>
      </a>
    `).join('');
    this.innerHTML = `
    <title-bar root="true" class="w-full pb-6 short:pb-2" title="Vision Boards"></title-bar>
    <div class="grid grid-cols-4 px-4 gap-x-2 gap-y-4">
      ${this.placeCreateNew === 'first' ? `<a href="/app/vision-boards/new.html" class="flex flex-col items-center">
        <div class="text-2xl w-[72px] h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0 flex items-center justify-center rounded-xl bg-brand text-white font-serif">
        New
        </div>
        <p class="w-[72px] lg:w-[96px] mt-2 text-center opacity-80 text-sm">Create New</p>
      </a>` : ''}
      ${entriesHtml}
      ${this.placeCreateNew === 'last' ? `<a href="/app/vision-boards/new.html" class="flex flex-col items-center">
        <div class="text-2xl w-[72px] h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0 flex items-center justify-center rounded-xl bg-brand text-white font-serif">
        New
        </div>
        <p class="w-[72px] lg:w-[96px] mt-2 text-center opacity-80 text-sm">Create New</p>
      </a>` : ''}
    </div>
    `;
  }
}

customElements.define('vision-boards-index', VisionBoardsIndex);