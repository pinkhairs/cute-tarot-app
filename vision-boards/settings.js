class VisionBoardSettings extends HTMLElement {
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
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Place "Create New"</label>
        <select id="deck" class="bg-neutral px-4 py-2 rounded-lg text-xl">
          <option value="First">First</option>
          <option value="Last">Last</option>
        </select>
      </div>
    </form>
    `;
  }
}

customElements.define('vision-board-settings', VisionBoardSettings);