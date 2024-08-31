import star from '@/assets/star.svg';

import card from '@/assets/kt-back.png';

class ManifestedIntention extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <title-bar class="w-full pb-6 short:pb-0" title="Today" subtitle="August 29, 2024"></title-bar>
      <div class="w-full px-4 flex-1 flex items-start justify-center">
        <img src="${card}" class="rounded-2xl bg-[rgba(255,255,255,.85)] shadow-[0_0_56px_-8px_rgba(85,123,193,0.2)] h-32 md:h-48 short:h-32 lg:h-48" alt="Kawaii Tarot">
      </div>
      <div class="px-4 mt-8 short:mt-4 flex items-center justify-center gap-4 flex-col">
        <div class="text-center items-center justify-center">
          <h2>The Fool</h2>
        </div>
        <div class="text-center items-center justify-center">
          <p>Try a new adventure.</p>
        </div>
        <form class="max-w-80 flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl text-center">
          <div class="field flex flex-col items-center justify-between  gap-2 w-full rounded-2xl text-center">
            <label class="label opacity-80 font-serif">Today's intention</label>
            <p class="text-lg">Welp. Here it is.</p>
          </div>
          <a href="/app/tarot/manifested.html" class="transition-opacity origin-top duration-1000 bg-accent text-lg font-serif text-black rounded-xl px-4 py-3 inline-flex items-center gap-2"><img class="h-4" src="${star}" alt="Star"> I Manifested This</a>
        </form>
      </div>
    `;
  }
}

customElements.define('manifested-intention', ManifestedIntention);