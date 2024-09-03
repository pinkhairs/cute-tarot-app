import Cookies from "js-cookie";

class VisionBoardsEntry extends HTMLElement {
  constructor() {
    super();
    this.slug = Cookies.get('board-slug'); // To store the slug extracted from the URL
    this.entry = null; // To store the fetched entry data
  }

  connectedCallback() {
    if (this.slug) {
      this.fetchPostBySlug(this.slug); // Fetch the post data using the slug
    }
  }

  async fetchPostBySlug(slug) {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=vision_board&slug=${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch the post');
    }

    const posts = await response.json();
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
    <form method="post" enctype="multipart/form-data" action="${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=upload_inspiration" id="new" class="pb-8 short:pb-4 w-full  mx-auto flex-col flex-1 flex items-center justify-start gap-6">
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
    </form>`;
    
    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-index.html" data-settings-link="/vision-board-settings.html" class="w-full" title="${title}"></title-bar>
    <div class="px-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      ${imagesHtml}
    </div><div class="h-4"></div>
    `;
  }
}

customElements.define('vision-boards-entry', VisionBoardsEntry);