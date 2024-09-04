import { fetchWithAuth } from '@/auth';

class YouIndex extends HTMLElement {
  constructor() {
    super();
    this.debounceTimeout = null;
    this.debounceDelay = 2000; // 2 seconds debounce delay
  }

  async getProfile() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_profile`);
    const profile = await response.json();
    return profile;
  }

  connectedCallback() {
    this.render();
    this.getProfile().then(json => {
      document.getElementById('life_right_now').value = json.life_right_now;
      document.getElementById('describe_a_day_in_your_dream_life').value = json.describe_a_day_in_your_dream_life;
      document.getElementById('life_vision').value = json.life_vision;
      document.getElementById('bucket_list').value = json.bucket_list;
      document.getElementById('current_responsibilities').value = json.current_responsibilities;
      document.getElementById('style').value = json.style;
      this.attachListeners();
      hideLoadingScreen();
    }).catch(error => {
      console.error('Error fetching profile:', error);
    });
  }

  render() {
    this.innerHTML = `
      <title-bar class="w-full" data-settings-link="/you-settings.html" title="You" subtitle="Personalize your experience"></title-bar>
      <form action="${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=save_profile" method="post" class="w-full mx-auto flex-col px-6 flex-1 flex items-center justify-start gap-6">
        <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-4 w-full rounded-2xl text-center">
          <div class="label opacity-80 font-serif">Avatar</div>
          <label for="avatar" class="border-dashed border-2 rounded-lg border-black p-4">
            Upload <input type="file" id="avatar" name="file" class="hidden" accept="image/*">
          </label>
        </div>

        <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
          <label for="life_right_now" class="label opacity-80 font-serif">Life right now</label>
          <textarea id="life_right_now" name="life_right_now" placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral transition-colors h-32 w-full rounded-xl p-4 bg-transparent"></textarea>
        </div>

        <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
          <label for="describe_a_day_in_your_dream_life" class="label opacity-80 font-serif">Describe a day in your dream life</label>
          <textarea id="describe_a_day_in_your_dream_life" name="describe_a_day_in_your_dream_life" placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral transition-colors h-32 w-full rounded-xl p-4 bg-transparent"></textarea>
        </div>

        <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
          <label for="life_vision" class="label opacity-80 font-serif">Life vision</label>
          <textarea id="life_vision" name="life_vision" placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral transition-colors h-32 w-full rounded-xl p-4 bg-transparent"></textarea>
        </div>

        <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
          <label for="bucket_list" class="label opacity-80 font-serif">Bucket list</label>
          <textarea id="bucket_list" name="bucket_list" placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral transition-colors h-32 w-full rounded-xl p-4 bg-transparent"></textarea>
        </div>

        <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
          <label for="current_responsibilities" class="label opacity-80 font-serif">Current responsibilities</label>
          <textarea id="current_responsibilities" name="current_responsibilities" placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral transition-colors h-32 w-full rounded-xl p-4 bg-transparent"></textarea>
        </div>

        <div class="field flex flex-col items-center justify-between p-4 text-black bg-white bg-opacity-90 gap-3 w-full rounded-2xl">
          <label for="style" class="label opacity-80 font-serif">Style (emoji work well here)</label>
          <input type="text" id="style" name="style" placeholder="Type here" class="text-center focus:outline-none focus:bg-neutral transition-colors h-10 w-full rounded-xl p-4 bg-transparent">
        </div>
      </form>
    `;

    document.getElementById('avatar').addEventListener('change', async (event) => {
      showLoadingScreen();
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=upload_avatar`, {
        method: 'POST',
        body: formData,
      });
      const newAvatar = await response.text();
      const styles = document.createElement('style');
      styles.textContent = `#avatar { background-image: url(${newAvatar}) !important; }`;
      document.head.appendChild(styles);
      hideLoadingScreen();
    });
  }

  attachListeners() {
    const form = this.querySelector('form');
    const inputs = form.querySelectorAll('textarea, input[type="text"], input[type="radio"], input[type="checkbox"]');

    inputs.forEach(input => {
      input.addEventListener('keyup', () => this.debounceSubmit(form));
      input.addEventListener('change', () => this.debounceSubmit(form));
    });
  }

  debounceSubmit(form) {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => this.submitForm(form), this.debounceDelay);
  }

  submitForm(form) {
    const formData = new FormData(form);
    fetchWithAuth(form.action, {
      method: form.method,
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Form submission success:', data);
    })
    .catch(error => {
      console.error('Error submitting form:', error);
    });
  }
}

customElements.define('you-index', YouIndex);
