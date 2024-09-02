class VisionBoardsEntry extends HTMLElement {
  constructor() {
    super();
    this.slug = null; // To store the slug extracted from the URL
    this.entry = null; // To store the fetched entry data
  }

  connectedCallback() {
    this.extractSlugFromURL(); // Extract the slug from the current URL
    if (this.slug) {
      this.fetchPostBySlug(this.slug); // Fetch the post data using the slug
    }
  }

  extractSlugFromURL() {
    // Get the current URL
    const urlParams = new URLSearchParams(window.location.search);
    const slugParam = urlParams.get('id');

    if (slugParam) {
      this.slug = slugParam;
    } else {
      console.error('No slug found in the URL');
    }
  }

  async fetchPostBySlug(slug) {
    const response = await fetch(`/pwa.php?action=vision_board&slug=${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch the post');
    }

    const posts = await response.json();
    console.log(posts);
    this.entry = JSON.parse(posts);
    this.render();
    hideLoadingScreen();
  }

  render() {
    const title = this.entry.title;
    const images = this.entry.inspiration;
    const imagesHtml = images.map(image => `
      <img src="${image}" class="w-full rounded-xl h-auto" alt="">
    `).join('');

    const settings = `
    <form method="post" enctype="multipart/form-data" action="/pwa.php?action=upload_inspiration" id="new" class="pb-8 short:pb-4 w-full  mx-auto flex-col flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl">
        <label for="vision-board-title" class="label opacity-80 font-serif">Name</label>
        <textarea placeholder="Type here" id="vision-board-title" name="title" class="w-full text-center bg-transparent focus:bg-white px-6 py-2 rounded-lg">${title}</textarea>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
        <div class="label opacity-80 font-serif">New inspiration</div>
        <label for="inspiration" class="border-dashed border-2 rounded-lg border-black p-4">
          Upload images <input type="file" id="inspiration" name="files[]" class="hidden" multiple accept="image/*">
        </label>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl text-center">
        <div class="label opacity-80 font-serif">Icon</div>
        <label for="icon" class="border-dashed border-2 rounded-lg border-black p-4">
          Upload <input type="file" id="icon" name="file" class="hidden" multiple accept="image/*">
        </label>
      </div>
    </form>`;
    
    this.innerHTML = `
    <title-bar class="w-full" title="${window.location.search.includes('settings=true') ? 'Settings' : title}"></title-bar>
    <div class="px-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    ${window.location.search.includes('settings=true') ? settings : imagesHtml}
    
    </div>
    `;

    if (window.location.search.includes('settings=true')) {
      document.getElementById('inspiration').addEventListener('change', (event) => {
        event.preventDefault();
        document.getElementById('new').submit();
        event.stopPropagation();
      });
    }
  }
}

customElements.define('vision-boards-entry', VisionBoardsEntry);