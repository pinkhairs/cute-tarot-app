import { fetchWithAuth } from '@/auth'; // Ensure the path to your auth file is correct
import { Preferences } from '@capacitor/preferences';

class VisionBoardSettings extends HTMLElement {
  constructor() {
    super();
    this.slug = null; // To store the slug extracted from the URL
    this.entry = null; // To store the fetched entry data
  }

  async connectedCallback() {
    // Retrieve the slug from Capacitor Preferences instead of cookies
    const result = await Preferences.get({ key: 'board-slug' });
    this.slug = result.value;

    if (this.slug) {
      this.fetchPostBySlug(this.slug); // Fetch the post data using the slug
    }
  }

  async fetchPostBySlug(slug) {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=vision_board&slug=${slug}`, { credentials: 'include' });
      this.entry = await response.json();
      this.render();
      hideLoadingScreen();
    } catch (error) {
      console.error('Failed to fetch the post:', error);
      // Handle error (e.g., show an error message to the user)
    }
  }

  render() {
    const title = this.entry.title;
    const settings = `
    <form id="new" class="pb-8 short:pb-4 w-full mx-auto flex-col flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-3 w-full rounded-2xl">
        <label for="vision-board-title" class="label opacity-80 font-serif">Name</label>
        <textarea placeholder="Type here" id="vision-board-title" name="title" class="w-full text-center bg-transparent focus:text-black focus:bg-white px-6 py-2 rounded-lg">${title}</textarea>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-3 w-full rounded-2xl text-center">
        <div class="label opacity-80 font-serif">New inspiration</div>
        <label for="inspiration" class="border-dashed border-2 rounded-lg border-black p-4">
          Upload images <input type="file" id="inspiration" name="files[]" class="hidden" multiple accept="image/*">
        </label>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-3 w-full rounded-2xl text-center">
        <div class="label opacity-80 font-serif">Icon</div>
        ${this.entry.icon ? `<div style="background-image: url(${this.entry.icon})" class="w-16 h-16 bg-cover bg-center bg-no-repeat rounded-lg" id="icon-now"></div>` : ''}
        <label for="icon" class="border-dashed border-2 rounded-lg border-black p-4">
          Upload <input type="file" id="icon" name="icon" class="hidden" accept="image/*">
        </label>
      </div>
      <button id="delete-vision-board" type="button" class="text-brand font-bold text-lg">Delete vision board</button>
      <div class="h-4"></div>
    </form>`;

    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-entry.html" class="w-full" title="Settings" subtitle="Changes will save automatically"></title-bar>
    <div class="px-6">
      ${settings}
    </div>
    <div class="h-4"></div>
    `;

    document.getElementById('delete-vision-board').addEventListener('click', async () => {
      // first confirm
      if (confirm('Are you sure you want to delete this vision board?')) {
        const formData = new FormData();
        formData.append('id', this.slug);

        await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=delete_vision_board`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        htmx.ajax('GET', '/vision-boards-index.html', { target: '#content' });
      }
    });

    // Handle changes to the vision board title
    document.getElementById('vision-board-title').addEventListener('change', async (event) => {
      const formData = new FormData();
      formData.append('title', event.target.value);
      formData.append('id', this.slug);

      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=set_board_title`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to save board title');
        }

        console.log('Board title saved successfully');
      } catch (error) {
        console.error('Error saving board title:', error);
      }
    });

    // Handle new inspiration file uploads
    document.getElementById('inspiration').addEventListener('change', async (event) => {
      showLoadingScreen();

      const formData = new FormData();
      Array.from(event.target.files).forEach(file => {
        formData.append('files[]', file);
      });
      formData.append('id', this.slug);

      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=upload_inspiration`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to upload inspiration images');
        }

        alert('New inspiration added successfully');
      } catch (error) {
        console.error('Error uploading inspiration images:', error);
      } finally {
        hideLoadingScreen();
      }
    });

    // Handle icon file uploads
    document.getElementById('icon').addEventListener('change', async (event) => {
      showLoadingScreen();

      const formData = new FormData();
      formData.append('icon', event.target.files[0]);
      formData.append('id', this.slug);

      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=upload_icon`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to upload icon');
        }

        document.getElementById('icon-now').src = await response.text();
      } catch (error) {
        console.error('Error uploading icon:', error);
      } finally {
        hideLoadingScreen();
      }
    });
  }
}

customElements.define('vision-board-settings', VisionBoardSettings);
