class YouPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full pb-6 short:pb-2" root="true" title="You" subtitle="Personalize your experience"></title-bar>
    <form class="w-full max-w-80 mx-auto flex-col px-4 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl text-center">
        <label class="label opacity-80 font-serif">Avatar</label>
        <div class="border-dashed border-2 rounded-lg border-black p-4">
          Upload
        </div>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Style (emoji work well here)</label>
        <textarea placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral w-full rounded-xl p-2 bg-transparent"></textarea>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Style (emoji work well here)</label>
        <textarea placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral w-full rounded-xl p-2 bg-transparent"></textarea>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Style (emoji work well here)</label>
        <textarea placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral w-full rounded-xl p-2 bg-transparent"></textarea>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Style (emoji work well here)</label>
        <textarea placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral w-full rounded-xl p-2 bg-transparent"></textarea>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Style (emoji work well here)</label>
        <textarea placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral w-full rounded-xl p-2 bg-transparent"></textarea>
      </div>
    </form>
    `;
  }
}

customElements.define('you-page', YouPage);