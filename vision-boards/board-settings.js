import Cookies from "js-cookie";

class VisionBoardSettings extends HTMLElement {
  constructor() {
    super();
    this.slug = Cookies.get('board-slug'); // To store the slug extracted from the URL
    this.entry = null; // To store the fetched entry data
    this.nonce = '';
  }

  async getNonce() {
    const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=get_credentials`, {
      credentials: 'include'
    });
    const userInfo = await response.json();
    this.nonce = userInfo.nonce;
    return userInfo.nonce;
  }

  connectedCallback() {
    if (this.slug) {
      this.getNonce().then(() => {
      this.fetchPostBySlug(this.slug); // Fetch the post data using the slug
      });
    }
  }

  async fetchPostBySlug(slug) {
    const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=vision_board&slug=${slug}&_wpnonce=${this.nonce}`, { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Failed to fetch the post');
    }

    this.entry = await response.json();
    this.render();
    hideLoadingScreen();
  }

  render() {
    const title = this.entry.title;
    const settings = `
    <form id="new" class="pb-8 short:pb-4 w-full mx-auto flex-col flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl">
        <label for="vision-board-title" class="label opacity-80 font-serif">Name</label>
        <textarea placeholder="Type here" id="vision-board-title" name="title" class="w-full text-center bg-transparent focus:text-black focus:bg-white px-6 py-2 rounded-lg">${title}</textarea>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
        <div class="label opacity-80 font-serif">New inspiration</div>
        <label for="inspiration" class="border-dashed border-2 rounded-lg border-black p-4">
          Upload images <input type="file" id="inspiration" name="files[]" class="hidden" multiple accept="image/*">
        </label>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
        <div class="label opacity-80 font-serif">Icon</div>
        ${this.entry.icon ? `<p class="mb-2"><img src="${this.entry.icon}" class="w-16 h-16 rounded-lg" alt=""></p>` : ''}
        <label for="icon" class="border-dashed border-2 rounded-lg border-black p-4">
          Upload <input type="file" id="icon" name="icon" class="hidden" accept="image/*">
        </label>
      </div>
      <button type="button" class="text-brand font-bold text-lg" type="button">Delete vision board</button>
      <div class="h-4"></div>
    </form>`;

    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-entry.html" class="w-full" title="Settings" subtitle="Changes will save automatically"></title-bar>
    <div class="px-6">
      ${settings}
    </div>
    <div class="h-4"></div>
    `;

    // Handle changes to the vision board title
    document.getElementById('vision-board-title').addEventListener('change', async (event) => {
        const formData = new FormData();
        formData.append('title', event.target.value);
        formData.append('id', this.slug);

        try {
            const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=set_board_title&_wpnonce=${this.nonce}`, {
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
            const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=upload_inspiration&_wpnonce=${this.nonce}`, {
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
            const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=upload_inspiration&_wpnonce=${this.nonce}`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to upload icon');
            }

            alert('Icon updated successfully');
        } catch (error) {
            console.error('Error uploading icon:', error);
        } finally {
            hideLoadingScreen();
        }
    });
  }
}

customElements.define('vision-board-settings', VisionBoardSettings);