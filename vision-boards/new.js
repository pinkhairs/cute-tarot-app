import { fetchWithAuth } from '@/auth';
import { Preferences } from '@capacitor/preferences';
import { trackEvent } from '@/logsnag';

class VisionBoardsNew extends HTMLElement {
  constructor() {
    super();
    this.index = 0;
  }

  connectedCallback() {
    this.render();
    hideLoadingScreen();
  }

  render() {
    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-index.html" class="w-full" title="Vision Board"></title-bar>
    <form method="post" enctype="multipart/form-data" id="new" class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-3 w-full rounded-2xl">
        <label for="vision-board-title" class="label opacity-80 font-serif">Name</label>
        <textarea placeholder="Type here" id="vision-board-title" name="title" class="w-full text-center bg-transparent focus:text-black focus:bg-white px-6 py-2 rounded-lg"></textarea>
        <button type="button" class="inline-flex items-center gap-1">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.35434 9.63724L5.08937 11.3956C4.99753 12.0039 5.64272 12.4531 6.18086 12.156L7.73797 11.2973C7.95148 11.1791 8.21002 11.1739 8.4282 11.2833L10.0187 12.0788C10.5685 12.3537 11.1956 11.8787 11.0791 11.2751L10.7434 9.52845C10.6972 9.28862 10.7721 9.04119 10.9434 8.86746L12.1917 7.60048C12.6234 7.16236 12.3654 6.41949 11.7553 6.34345L9.99058 6.12351C9.74841 6.09368 9.53608 5.94628 9.42377 5.72926L8.60485 4.15051C8.32174 3.60476 7.53558 3.62056 7.2747 4.17742L6.51954 5.78776C6.41601 6.00886 6.21011 6.16504 5.96912 6.20482L4.21488 6.49612C3.6083 6.59673 3.38076 7.34955 3.82941 7.76953L5.12797 8.98504C5.30579 9.15174 5.39061 9.39566 5.35434 9.63724Z" fill="#F6D072"/>
</svg>

<div class="opacity-80 font-serif text-sm" hx-get="/you-pentacles.html" hx-target="#content">Get 10 ideas = 1 pentacle</div>

</button>
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
          trackEvent('vision-boards', 'New vision board', '🔮', false, { title: document.getElementById('vision-board-title').value, slug: getBoardSlug.value });

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
  }
}

customElements.define('vision-boards-new', VisionBoardsNew);
