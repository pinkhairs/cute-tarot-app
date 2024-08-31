class TarotSettings extends HTMLElement {
  constructor() {
    super();
    this.deck = 'Spoopy Tarot';
  }

  connectedCallback() {
    const deck = async () => {
      const response = await fetch(`/pwa.php?action=get_deck`);
      return await response.json();
    }

    deck().then(data => {
      const json = JSON.parse(data);
      this.deck = json.deck;
      if (this.deck !== 'Spoopy Tarot') this.deck = 'Kawaii Tarot';
      this.options = `<option value="Kawaii Tarot" ${this.deck === 'Kawaii Tarot' ? 'selected' : ''}>Kawaii Tarot</option>`;
      this.options += `<option value="Spoopy Tarot" ${this.deck === 'Spoopy Tarot' ? 'selected' : ''}>Spoopy Tarot</option>`;
      this.render();
    });
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full pb-6 short:pb-2" title="Settings" subtitle="Changes will save automatically"></title-bar>
    <form enctype="multipart/form-data" action="/pwa.php?action=save_reading_settings" id="tarot-settings-form" class="w-full max-w-80 mx-auto flex-col px-4 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Deck</label>
        <select id="deck" class="bg-neutral px-4 py-2 rounded-lg text-xl">
          ${this.options}
        </select>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl text-center">
        <label class="label opacity-80 font-serif">Mat</label>
        <label class="border-dashed border-2 rounded-lg border-black p-4">
          Upload <input type="file" id="mat-file" name="background" class="hidden">
        </label>
        <p>Clear Current Mat</p>
      </div>
    </form>
    `;

    document.getElementById('deck').addEventListener('change', (event) => {
      this.deck = event.target.value;
      fetch(`/pwa.php?action=save_reading_settings&deck=${this.deck}`);
    });

    document.getElementById('mat-file').addEventListener('change', async () => {
      const formData = new FormData();
      formData.append('background', document.getElementById('mat-file').files[0]);
      await fetch('/pwa.php?action=save_reading_settings', {
        method: 'POST',
        body: formData
      });
      window.location.href = '/app/';
    });

    document.getElementById('deck').addEventListener('change', (event) => {
      this.deck = event.target.value;
      fetch(`/pwa.php?action=save_reading_settings&deck=${this.deck}`);
    });
  }
}

customElements.define('tarot-settings', TarotSettings);