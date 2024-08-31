import card from '@/assets/kt-back.png';

class VisionBoardEntries extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full pb-6 short:pb-2" title="Entries"></title-bar>
    <div class="w-full px-4 flex-1 flex items-start justify-center">
      <div class="flex-1">
        <ul class="">
          <li class="flex pb-4 mb-4">
            <a href="/app/vision-boards/entry.html?title=High-rise+Dreams" class="flex">
              <div>
                <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-xl bg-white">
                  <img src="${card}" alt="Tarot Card" class="h-[53px] rounded-md">
                </div>
              </div>
              <div class="flex-grow pl-4">
                <h3 class="mb-2">Start a new project</h3>
                <p class="leading-relaxed">3 media</p>
                <p class="leading-relaxed opacity-80 text-sm">Created August 20, 2024</p>
              </div>
            </a>
          </li>
          <li class="flex pb-4 mb-4">
            <a href="/app/vision-boards/entry.html?title=High-rise+Dreams" class="flex">
            <div>
              <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-xl bg-white">
                <img src="${card}" alt="Tarot Card" class="h-[53px] rounded-md">
              </div>
              <p class="w-20 mt-2 text-center opacity-80 text-sm">The Fool</p>
            </div>
            <div class="flex-grow pl-4">
              <h3 class="mb-2">August 20, 2024</h3>
              <p class="leading-loose">Start a new project</p>
            </div>
            </a>
          </li>
          <li class="flex pb-4 mb-4">
            <a href="/app/vision-boards/entry.html?title=High-rise+Dreams" class="flex">
            <div>
              <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-xl bg-white">
                <img src="${card}" alt="Tarot Card" class="h-[53px] rounded-md">
              </div>
              <p class="w-20 mt-2 text-center opacity-80 text-sm">The Fool</p>
            </div>
            <div class="flex-grow pl-4">
              <h3 class="mb-2">August 20, 2024</h3>
              <p class="leading-loose">Start a new project</p>
            </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    `;
  }
}

customElements.define('vision-board-entries', VisionBoardEntries);