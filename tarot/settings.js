class TarotSettings extends HTMLElement {
  constructor() {
    super();
    this.deck = 'Spoopy Tarot';
    this.nonce = '';
  }

  async getNonce() {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_credentials`, {
      credentials: 'include'
    });
    const userInfo = await response.json();
    this.nonce = userInfo.nonce;
    return userInfo.nonce;
  }

  connectedCallback() {
    this.getNonce().then(async nonce => {
      const deck = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_deck_preference&_wpnonce=${nonce}`, { credentials: 'include' });
        return await response.text();
      }

      deck().then(data => {
        this.deck = data === 'Spoopy Tarot' ? 'Spoopy Tarot' : 'Kawaii Tarot';
        this.options = `<option value="Kawaii Tarot" ${this.deck === 'Kawaii Tarot' ? 'selected' : ''}>Kawaii Tarot</option>`;
        this.options += `<option value="Spoopy Tarot" ${this.deck === 'Spoopy Tarot' ? 'selected' : ''}>Spoopy Tarot</option>`;
        this.render();
        hideLoadingScreen();
      });
    });
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full" title="Settings" data-back-link="/tarot-index.html" subtitle="Changes will save automatically"></title-bar>
    <form id="tarot-settings-form" class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl">
        <label for="deck" class="label opacity-80 font-serif">Deck</label>
        <select id="deck" class="bg-neutral px-6 py-2 rounded-lg text-xl">
          ${this.options}
        </select>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
        <label class="label opacity-80 font-serif">Mat</label>
        <label class="border-dashed border-2 rounded-lg border-black p-4">
          Upload <input type="file" id="mat-file" name="background" class="hidden" accept="image/*">
        </label>
      </div>
    </form>
    `;

    document.getElementById('deck').addEventListener('change', async (event) => {
        this.deck = event.target.value;

        const url = `${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_reading_settings&deck=${this.deck}&_wpnonce=${this.nonce}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to save deck settings');
            }

            console.log('Deck settings saved successfully');
        } catch (error) {
            console.error('Error saving deck settings:', error);
        }
    });

    // Event listener for mat file upload
    document.getElementById('mat-file').addEventListener('change', async () => {
        showLoadingScreen();

        const formData = new FormData();
        formData.append('background', document.getElementById('mat-file').files[0]);

        const url = `${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=set_mat&_wpnonce=${this.nonce}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to upload mat');
            }

            const background = document.querySelector('#background');
            const mat = async () => {
              const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_mat&_wpnonce=${this.nonce}`, { credentials: 'include' });
              return await response.json();
            }
            mat().then(data => {
              let matJson;
              let textColor
              if (!data.mat) {
                matJson = '';
                textColor = 'black';
              } else {
                matJson = data.mat;
                textColor = data.color;
              }
      
              background.style.backgroundImage = `url(${matJson})`;
              document.documentElement.className = `text-${textColor}`;
              background.classList.add(`${textColor}-text`);
              hideLoadingScreen();
            });
        } catch (error) {
            console.error('Error uploading mat:', error);
        } finally {
          
        }
    });
  }
}

customElements.define('tarot-settings', TarotSettings);