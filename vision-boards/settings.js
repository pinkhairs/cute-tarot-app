class VisionBoardsSettings extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const placeCreateNew = async () => await fetch('/pwa.php?action=place_create_new');
    placeCreateNew().then(async data => {
      const jsonData = await data.json();
      const json = JSON.parse(jsonData);
      this.placeCreateNew = json.place;
      this.render();
      hideLoadingScreen();
    });
  }

  render() {
    const saveCreateNew = async (value) => {
      const response = await fetch(`/pwa.php?action=save_create_new&value=${value}`);
      const data = await response.json();
      return data;
    }

    const options = `
      <option value="first" ${this.placeCreateNew === 'first' ? 'selected' : ''}>First</option>
      <option value="last" ${this.placeCreateNew === 'last' ? 'selected' : ''}>Last</option>
    `;
    this.innerHTML = `
    <title-bar class="w-full" title="Settings" subtitle="Changes will save automatically"></title-bar>
    <form class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Place "Create New"</label>
        <select id="deck" class="bg-white px-6 py-2 rounded-lg text-xl">
          ${options}
        </select>
      </div>
    </form>
    `;

    document.getElementById('deck').addEventListener('change', (event) => {
      const value = event.target.value;
      saveCreateNew(value);
    });
  }
}

customElements.define('vision-boards-settings', VisionBoardsSettings);