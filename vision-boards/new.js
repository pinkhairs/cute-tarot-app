import { fetchWithAuth } from '@/auth';
import { Preferences } from '@capacitor/preferences';

class VisionBoardsNew extends HTMLElement {
  constructor() {
    super();
    this.index = 0;
    this.ideas = null; // Initialize ideas as null
  }

  async getIdeas() {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=vision_board_ideas`);
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      this.ideas = await response.json();
      this.render();
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      hideLoadingScreen();
    }
  }

  getRandomIdea() {
    if (this.index === this.ideas.length - 1) {
      this.index = 0;
    } else {
      this.index++;
    }
    return this.ideas[this.index];
  }

  connectedCallback() {
    this.getIdeas(); // Directly call getIdeas without nonces
  }

  render() {
    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-index.html" class="w-full" title="Vision Board" subtitle="Changes will save automatically"></title-bar>
    <form method="post" enctype="multipart/form-data" id="new" class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-3 w-full rounded-2xl">
        <label for="vision-board-title" class="label opacity-80 font-serif">Name</label>
        <textarea placeholder="Type here" id="vision-board-title" name="title" class="w-full text-center bg-transparent focus:text-black focus:bg-white px-6 py-2 rounded-lg"></textarea>
        ${this.ideas ? `<button type="button" class="text-brand font-bold" id="random-idea">Try a suggestion</button>` : ''}
      </div>
      <button id="continue" type="button" class="w-max mx-auto transition-opacity origin-top duration-1000 bg-brand text-xl font-serif text-white rounded-xl px-6 py-3">Continue</button>
    </form>
    `;

    document.getElementById('continue').addEventListener('click', async (event) => {
      showLoadingScreen();
      const formData = new FormData();
      formData.append('title', document.getElementById('vision-board-title').value);
      formData.append('id', '');

      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=upload_inspiration`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.text();
          await Preferences.set({ key: 'board-slug', value: data });
          const getBoardSlug = await Preferences.get({ key: 'board-slug' });
          console.log('Board slug:', getBoardSlug.value);

          if (getBoardSlug.value) {
            htmx.ajax('GET', '/vision-boards-entry.html', { target: '#content' });
          } else {
            console.error('Failed to set board-slug');
          }
        } else {
          console.error('Failed to upload inspiration', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading inspiration', error);
      }
    });

    document.getElementById('random-idea').addEventListener('click', (event) => {
      const randomIdea = this.getRandomIdea();
      document.getElementById('vision-board-title').value = randomIdea;
    });
  }
}

customElements.define('vision-boards-new', VisionBoardsNew);
