class VisionBoardsNew extends HTMLElement {
  constructor() {
    super();
    this.index = 0;
  }

  async getNonce() {
    const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=get_credentials`, {
      credentials: 'include'
    });
    const userInfo = await response.json();
    this.nonce = userInfo.nonce;
    return userInfo.nonce;
  }

  async getIdeas() {
    const response = await fetch(`${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=vision_board_ideas&_wpnonce=${this.nonce}`, { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    const json = await response.json();
    this.ideas = JSON.parse(json).ideas;
    this.render();
    hideLoadingScreen();
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
    this.getNonce().then(() => {
      this.getIdeas();
      hideLoadingScreen();
    });
  }

  render() {
    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-index.html" class="w-full" title="Vision Board" subtitle="Changes will save automatically"></title-bar>
    <form method="post" enctype="multipart/form-data" action="${window.location.hostname.includes('localhost') ? 'https://cutetarot.local' : 'https://cutetarot.com'}/pwa.php?action=upload_inspiration" id="new" class="w-full  mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-4 w-full rounded-2xl">
        <label for="vision-board-title" class="label opacity-80 font-serif">Name</label>
        <textarea placeholder="Type here" id="vision-board-title" name="title" class="w-full text-center bg-transparent focus:text-black focus:bg-white px-6 py-2 rounded-lg"></textarea>
        ${this.ideas ? `<button type="button" class="text-brand font-bold" id="random-idea">Try a suggestion</button>` : ''}
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
          Upload <input type="file" id="icon" name="icon" class="hidden" accept="image/*">
        </label>
      </div>
    </form>
    `;

    document.getElementById('inspiration').addEventListener('change', (event) => {
      showLoadingScreen();
      document.getElementById('new').submit();
    });

    document.getElementById('icon').addEventListener('change', (event) => {
      showLoadingScreen();
      document.getElementById('new').submit();
    });

    document.getElementById('random-idea').addEventListener('click', (event) => {
      const randomIdea = this.getRandomIdea();
      document.getElementById('vision-board-title').value = randomIdea;
    });
  }
}

customElements.define('vision-boards-new', VisionBoardsNew);