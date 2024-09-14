import { fetchWithAuth } from '@/auth'; // Use fetchWithAuth from your auth module
import today from '@/assets/today.png';
import reference from '@/assets/reference.png';
import photo from '@/assets/photo.png';
import calendar from '@/assets/calendar.png';
import spoopy from '@/assets/spoopy.png';
import kawaii from '@/assets/kawaii.png';

class TabDock extends HTMLElement {
  constructor() {
    super();
    this.avatar = '';
    this.deck = '';
  }

  async getAvatar() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_avatar`);
    const avatarText = await response.text();
    return avatarText;
  }

  connectedCallback() {
    this.getAvatar()
      .then(avatar => {
        this.avatar = avatar;
        this.getDeckPreference().then(data => {
          this.deck = data;
          this.render();
        });
      })
  }

  async getDeckPreference() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_deck_preference`)
    return await response.text();
  }

  render() {
    // give me a variable for today's date
    const todayDate = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
    });
    this.innerHTML = `
      <div class="w-max p-3 grid grid-cols-5 backdrop-blur-md bg-[rgba(255,255,255,.85)] shadow-[0_0_40px_-8px_rgba(85,123,193,0.2)] items-center rounded-3xl h-20 justify-center gap-2">
        <div class="flex items-center">
          <button type="button" class="w-14 h-14 bg-cover rounded-2xl" style="background-image: url(${calendar})" hx-get="/tarot-index.html" hx-target="#content">
            <h2 class="text-[#F1789F] text-[34px] font-['Madimi_One'] mt-4">${todayDate}</h2>
          </button>
        </div>
        <div class="flex items-center">
          <button id="deck-icon" class="${this.deck !== 'Spoopy Tarot' ? 'kawaii' : 'spoopy'} w-14 h-14 bg-cover rounded-2xl" type="button" hx-get="/digital-index.html" hx-target="#content">
          </button>
        </div>
        <div class="flex items-center">
          <button type="button" hx-get="/readings-index.html" hx-target="#content">
            <img src="${photo}" alt="IRL Readings" class="rounded-2xl h-14">
          </button>
        </div>
        <div class="flex items-center">
          <button type="button" hx-get="/reference-index.html" hx-target="#content">
            <img src="${reference}" alt="Reference" class="rounded-2xl h-14">
          </button>
        </div>
        <div class="flex items-center">
          <button id="avatar" class="rounded-2xl w-14 h-14 bg-cover bg-center bg-no-repeat" type="button" hx-get="/you-index.html" hx-target="#content" style="background-image: url(${this.avatar})">
          </button>
        </div>
      </div>
      <style>html[data-theme="kawaii"] #deck-icon { background-image: url(${kawaii}); }</style>
      <style>html[data-theme="spoopy"] #deck-icon  { background-image: url(${spoopy}); }</style>
    `;

    htmx.process(this); // Re-process the current HTML element with htmx
  }
}

customElements.define('tab-dock', TabDock);
