import Cookies from "js-cookie";

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
    hideLoadingScreen();
  }

  render() {
    const entriesHtml = this.entries.map(entry => `
      <button type="button" hx-target="#content" hx-get="/app/vision-boards-entry.html" data-slug="${entry.slug}" class="load-entry flex flex-col items-center">
        <div class="text-2xl w-[72px] h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0 flex items-center justify-center rounded-xl bg-neutral text-black bg-cover bg-no-repeat bg-center" style="background-image: ${entry.icon.includes('//') ? `url(${entry.icon})` : `${entry.icon}`}">
        ${entry.icon.includes('//') ? '' : entry.firstCharacter}
        </div>
        <p class="w-[72px] lg:w-[96px] mt-2 text-center opacity-80 text-sm break-all">${entry.title}</p>
      </button>
    `).join('');
    this.innerHTML = `
    <title-bar data-entries-link="/app/vision-boards-entries.html" data-settings-link="/app/vision-boards-settings.html" root="true" class="w-full" title="Vision Boards"></title-bar>
    <div class="grid grid-cols-4 px-6 gap-x-2 gap-y-4">
      ${this.placeCreateNew === 'first' ? `<button type="button" hx-target="#content" hx-get="/app/vision-boards-new.html" class="flex flex-col items-center">
        <div class="text-xl w-[72px] h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0 flex items-center justify-center rounded-xl bg-brand text-white font-serif">
        New
        </div>
        <p class="w-[72px] lg:w-[96px] mt-2 text-center opacity-80 text-sm break-words">Create New</p>
      </button>` : ''}
      ${entriesHtml}
      ${this.placeCreateNew === 'last' ? `<a hx-target="#content" hx-get="/app/vision-boards-new.html" class="flex flex-col items-center">
        <div class="text-2xl w-[72px] h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0 flex items-center justify-center rounded-xl bg-brand text-white font-serif">
        New
        </div>
        <p class="w-[72px] lg:w-[96px] mt-2 text-center opacity-80 text-sm break-all">Create New</p>
      </button>` : ''}
    </a>
    `;

    htmx.process(this);
    
    document.querySelectorAll('.load-entry').forEach(button => {
      button.addEventListener('click', () => {
        Cookies.set('board-slug', button.getAttribute('data-slug'));
      });
    });
  }
}

customElements.define('vision-boards-index', VisionBoardsIndex);