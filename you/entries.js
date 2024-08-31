class YouEntries extends HTMLElement {
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
        <ul class="flex-col flex gap-6">
          <li class="flex gap-6 items-center justify-between mb-2">
            <h3 class="leading-[1.4]">A question that people would like to answer</h3>
            <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-white bg-opacity-70 font-bold text-xl">
              -
            </div>
          </li>
          <li class="flex gap-6 items-center justify-between mb-2">
            <h3 class="leading-[1.4]">A question that people would like to answer</h3>
            <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-white bg-opacity-70 font-bold text-xl">
              -
            </div>
          </li>
          <li class="flex gap-6 items-center justify-between mb-2">
            <h3 class="leading-[1.4] opacity-80">A question that people would like to answer</h3>
            <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-accent font-bold text-xl">
              +
            </div>
          </li>
          <li class="flex gap-6 items-center justify-between mb-2">
            <h3 class="leading-[1.4] opacity-80">A question that people would like to answer</h3>
            <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-accent font-bold text-xl">
              +
            </div>
          </li>
          <li class="flex gap-6 items-center justify-between mb-2">
            <h3 class="leading-[1.4] opacity-80">A question that people would like to answer</h3>
            <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-accent font-bold text-xl">
              +
            </div>
          </li>
          <li class="flex gap-6 items-center justify-between mb-2">
            <h3 class="leading-[1.4] opacity-80">A question that people would like to answer</h3>
            <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-accent font-bold text-xl">
              +
            </div>
          </li>
        </ul>
      </div>
    </div>
    `;
  }
}

customElements.define('you-entries', YouEntries);