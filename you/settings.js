class YouSettings extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full pb-6 short:pb-2" title="Settings" subtitle="Changes will save automatically"></title-bar>
    <form class="w-full max-w-80 mx-auto flex-col px-4 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Deck</label>
        <select id="deck" class="bg-neutral px-4 py-2 rounded-lg text-xl">
          <option value="Kawaii Tarot">Kawaii Tarot</option>
          <option value="Spoopy Tarot">Spoopy Tarot</option>
        </select>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
        <label class="label opacity-80 font-serif">Mat</label>
        <div class="border-dashed border-2 rounded-lg border-black p-4">
          Upload
        </div>
        <p>Clear Current Mat</p>
      </div>
    </form>
    `;
  }
}

customElements.define('you-settings', YouSettings);