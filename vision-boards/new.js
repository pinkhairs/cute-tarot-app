class NewVisionBoard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <title-bar class="w-full pb-6 short:pb-2" title="Vision Board" subtitle="Changes will save automatically"></title-bar>
    <form method="post" enctype="multipart/form-data" action="/pwa.php?action=upload_inspiration" id="new" class="w-full max-w-80 mx-auto flex-col px-4 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl">
        <label for="vision-board-title" class="label opacity-80 font-serif">Name</label>
        <textarea placeholder="Type here" id="vision-board-title" name="title" class="w-full text-center bg-transparent focus:bg-white px-4 py-2 rounded-lg"></textarea>
      </div>
      <div class="field flex flex-col items-center justify-between p-4 text-black bg-translucent gap-4 w-full rounded-2xl text-center">
        <div class="label opacity-80 font-serif">New inspiration</div>
        <label for="inspiration" class="border-dashed border-2 rounded-lg border-black p-4">
          Upload images <input type="file" id="inspiration" name="files[]" class="hidden" multiple accept="image/*">
        </label>
      </div>
    </form>
    `;

    document.getElementById('inspiration').addEventListener('change', (event) => {
      document.getElementById('new').submit();
    });
  }
}

customElements.define('new-vision-board', NewVisionBoard);