import { fetchWithAuth } from '@/auth'; // Ensure the path to fetchWithAuth is correct


class VisionBoardsSettings extends HTMLElement {
  constructor() {
    super();
    this.value = '';
  }

  connectedCallback() {
    this.fetchCreateNewPlacement(); // Fetches the current placement setting
  }

  async fetchCreateNewPlacement() {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=place_create_new`, { credentials: 'include' }, false);
      this.value = await response.text();
      if (this.value === '') this.value = 'first'; // Default value if no response
      this.render();
      hideLoadingScreen();
    } catch (error) {
      console.error('Error fetching create new placement:', error);
      hideLoadingScreen();
    }
  }

  render() {
    const saveCreateNew = async () => {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_create_new&value=${this.value}`, { credentials: 'include' }, false);
        const data = await response.text();
        console.log('Create New placement saved:', data);
      } catch (error) {
        console.error('Error saving create new placement:', error);
      }
    };

    const options = `
      <option value="first" ${this.value === 'first' ? 'selected' : ''}>First</option>
      <option value="last" ${this.value === 'last' ? 'selected' : ''}>Last</option>
    `;
    
    this.innerHTML = `
    <title-bar data-back-link="/vision-boards-index.html" class="w-full" title="Settings" subtitle="Changes will save automatically"></title-bar>
    <form class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
      <div class="field flex flex-col items-center justify-between p-4 bg-translucent gap-3 w-full rounded-2xl">
        <label for="create-new-placement" class="label opacity-80 font-serif">Place "Create New"</label>
        <select id="create-new-placement" class="bg-white px-6 py-2 rounded-lg text-xl">
          ${options}
        </select>
      </div>
    </form>
    `;

    document.getElementById('create-new-placement').addEventListener('change', (event) => {
      this.value = event.target.value;
      saveCreateNew();
    });
  }
}

customElements.define('vision-boards-settings', VisionBoardsSettings);
