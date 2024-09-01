import star from '@/assets/star.svg';

class TarotEntries extends HTMLElement {
  constructor() {
    super();
    this.entries = [];
  }

  connectedCallback() {
    this.fetchEntries();
  }


  async fetchEntries() {
    const response = await fetch('/pwa.php?action=tarot_entries');
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    const json = await response.json();
    this.entries = JSON.parse(json);
    this.render();
  }

  render() {
    const entriesHtml = this.entries.map(entry => `
      <li class="flex pb-4 mb-4">
        <a href="/app/tarot/entry.html?id=${entry.slug}" class="flex">
          <div>
            <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-xl bg-white">
              <img src="${entry.card_image}" alt="" class="h-[53px] rounded-md">
            </div>
            <p class="w-20 mt-2 text-center opacity-80 text-sm">${entry.card_title}</p>
          </div>
          <div class="flex-grow pl-4">
            <h3 class="mb-2">${entry.title}</h3>
            <p class="leading-loose">${entry.intention} ${entry.manifested ? `<span class="bg-accent text-black font-serif inline-flex gap-1 px-2 py-[5px] items-center rounded-md text-sm"><img class="h-4" src="${star}" alt=""> Manifested</span>` : ''}
            </p>
          </div>
        </a>
      </li>
    `).join('');

    this.innerHTML = `
    <title-bar class="w-full pb-6 short:pb-2" title="Entries"></title-bar>
    <div class="w-full px-4 flex-1 flex items-start justify-center">
      <div class="flex-1">
        <ul class="">
          ${entriesHtml}
        </ul>
      </div>
    </div>
    `;
  }
}

customElements.define('tarot-entries', TarotEntries);