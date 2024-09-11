import { fetchWithAuth } from '@/auth'; // Ensure the correct path is used


class TarotSettings extends HTMLElement {
  constructor() {
    super();
    this.deck = 'Spoopy Tarot';
  }

  connectedCallback() {
    const deck = async () => {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_deck_preference`, { credentials: 'include' }, false);
      return await response.text();
    };

    deck().then(data => {
      this.deck = data === 'Spoopy Tarot' ? 'Spoopy Tarot' : 'Kawaii Tarot';
      this.options = `<option value="Kawaii Tarot" ${this.deck === 'Kawaii Tarot' ? 'selected' : ''}>Kawaii Tarot</option>`;
      this.options += `<option value="Spoopy Tarot" ${this.deck === 'Spoopy Tarot' ? 'selected' : ''}>Spoopy Tarot</option>`;
      this.render();
      hideLoadingScreen();
    }).catch(error => {
      console.error('Error fetching deck preference:', error);
    });
  }

  render() {
    this.innerHTML = `
      <title-bar class="w-full" title="Settings" data-back-link="/tarot-index.html" subtitle="Changes will save automatically"></title-bar>
      <form id="tarot-settings-form" class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
        <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-3 w-full rounded-2xl">
          <label for="deck" class="label opacity-80 font-serif">Deck</label>
          <select id="deck" class="bg-neutral px-6 py-2 rounded-lg text-xl">
            ${this.options}
          </select>
        </div>
        <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-3 w-full rounded-2xl text-center">
          <label class="label opacity-80 font-serif">Mat</label>
          <label class="border-dashed border-2 rounded-lg border-black p-4">
            Upload <input type="file" id="mat-file" name="background" class="hidden" accept="image/*">
          </label>
        </div>
      </form>
    `;

    document.getElementById('deck').addEventListener('change', async (event) => {
      this.deck = event.target.value;
      const url = `${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_reading_settings&deck=${this.deck}`;

      try {
        const response = await fetchWithAuth(url, {
          method: 'POST',
          credentials: 'include'
        }, false);

        if (!response.ok) {
          throw new Error('Failed to save deck settings');
        }

        const result = await response.text();
        document.getElementById('deck-icon').setAttribute('src', result);

        console.log('Deck settings saved successfully');
        hideLoadingScreen();
      } catch (error) {
        console.error('Error saving deck settings:', error);
      }
    });

    // Event listener for mat file upload
    document.getElementById('mat-file').addEventListener('change', async () => {
      const formData = new FormData();
      formData.append('background', document.getElementById('mat-file').files[0]);

      const url = `${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=set_mat`;

      try {
        const response = await fetchWithAuth(url, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to upload mat');
        }

        htmx.ajax('GET', '/tarot-index.html', { target: '#content' });
      } catch (error) {
        console.error('Error uploading mat:', error);
        hideLoadingScreen();
      }
    });
  }
}

customElements.define('tarot-settings', TarotSettings);
