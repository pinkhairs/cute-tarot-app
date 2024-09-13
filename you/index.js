import { fetchWithAuth } from '@/auth';
import placeholder from '@/assets/placeholder.svg'

class YouIndex extends HTMLElement {
  constructor() {
    super();
    this.pentacles = null;
  }

  connectedCallback() {
    this.getPentacles().then(data => {
      this.pentacles = data;
      this.render();
      hideLoadingScreen();
    });
  }

  async getPentacles() {
    const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_pentacles`);
    return await response.text();
  }

  render() {
    this.innerHTML = `
      <title-bar root="true" class="w-full" data-settings-link="/you-settings.html" title="You" data-entries-link="/you-entries.html"></title-bar>
      <div class="px-6">
        <button type="button" hx-get="/you-pentacles.html" hx-target="#content" class="bg-brand rounded-xl text-white w-full flex items-center justify-between">
          <div class="w-full py-4 px-5 justify-between text-white flex items-center">
            <div class="flex items-center gap-3">
              <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M64.2842 32.1421C64.2842 49.8152 49.9573 64.1421 32.2842 64.1421C14.6111 64.1421 0.28418 49.8152 0.28418 32.1421C0.28418 14.469 14.6111 0.14209 32.2842 0.14209C49.9573 0.14209 64.2842 14.469 64.2842 32.1421ZM32.2842 56.5045C45.7392 56.5045 56.6466 45.5971 56.6466 32.1421C56.6466 18.6871 45.7392 7.77967 32.2842 7.77967C18.8292 7.77967 7.92176 18.6871 7.92176 32.1421C7.92176 45.5971 18.8292 56.5045 32.2842 56.5045ZM32.2842 60.3147C47.8435 60.3147 60.4568 47.7014 60.4568 32.1421C60.4568 16.5828 47.8435 3.96943 32.2842 3.96943C16.7248 3.96943 4.11152 16.5828 4.11152 32.1421C4.11152 47.7014 16.7248 60.3147 32.2842 60.3147ZM24.786 36.7818L24.035 41.7651C23.7747 43.4892 25.6033 44.7624 27.1284 43.9203L31.5415 41.4866C32.1466 41.1518 32.8793 41.1368 33.4977 41.4468L38.0052 43.7014C39.5636 44.4806 41.3407 43.1345 41.0108 41.4236L40.0592 36.4735C39.9283 35.7938 40.1405 35.0925 40.6262 34.6002L44.1639 31.0094C45.3874 29.7677 44.6563 27.6623 42.9272 27.4468L37.9257 26.8235C37.2393 26.7389 36.6375 26.3211 36.3193 25.7061L33.9983 21.2317C33.196 19.685 30.9679 19.7298 30.2285 21.308L28.0883 25.8719C27.7949 26.4985 27.2113 26.9412 26.5283 27.0539L21.5566 27.8795C19.8375 28.1646 19.1926 30.2982 20.4641 31.4885L24.1444 34.9334C24.6484 35.4058 24.8888 36.0971 24.786 36.7818Z" fill="#F6D072"/>
              </svg>
              <div class="flex items-center gap-4">
                <div class="text-left flex flex-col justify-center">
                  <div class="opacity-80 font-serif text-lg">
                  Pentacles
                </div>
                <h1>${this.pentacles ? this.pentacles : '0'}</h1>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end">
            <div class="bg-white text-brand px-3 py-2.5 rounded-xl">Get More</div>
          </div>
        </button>
      </div>
      <div class="px-6 mt-2 mb-1">
        <h2 class="text-center mb-4">Serendipity</h2>
        <p class="text-sm opacity-80 text-center">Serendipity rewards you with pentacles and badges for coincidences around the app.</p>
      </div>
      <div class="px-6 w-full">
      <div class="grid grid-cols-2 gap-[2px] rounded-xl overflow-hidden">
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#FFDEF6] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Got A Spark</h3>
          <p class="text-sm opacity-80 w-full text-center">Good luck shows up 3x in a row</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#FFEECC] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Echoes of Past</h3>
          <p class="text-sm opacity-80 w-full text-center">Repeating cards in different contexts</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#C0EFFF] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Full Moon</h3>
          <p class="text-sm opacity-80 w-full text-center">Reading relevant to full moon</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#E9E0FF] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">New Moon</h3>
          <p class="text-sm opacity-80 w-full text-center">A new moon reading</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-neutral bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Déjà Vu Again</h3>
          <p class="text-sm opacity-80 w-full text-center">Specific "follower" card</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#FFDEF6] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Vibe Change</h3>
          <p class="text-sm opacity-80 w-full text-center">Insight from a reading is carried through</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#FFEECC] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Quantum Leap</h3>
          <p class="text-sm opacity-80 w-full text-center">Full circle moments</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#C0EFFF] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">New Dawn</h3>
          <p class="text-sm opacity-80 w-full text-center">A reading first thing for a while</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#E9E0FF] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Major Arc</h3>
          <p class="text-sm opacity-80 w-full text-center">All major arcana reading</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-neutral bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Wander Lust</h3>
          <p class="text-sm opacity-80 w-full text-center">Wand/cup-heavy readings as of late</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#FFDEF6] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Meet Cute</h3>
          <p class="text-sm opacity-80 w-full text-center">Romantic readings after perspective shift</p>
        </div>
        <div class="flex px-2.5 py-3 flex-col items-center bg-white bg-opacity-70 gap-2">
          <h1 class="font-['Madimi_One'] text-[#FFEECC] bg-opacity-70 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-2xl bg-black">?</h1>
          <h3 class="w-full text-center">Over It</h3>
          <p class="text-sm opacity-80 w-full text-center">Recurrent topic is dropped for a while</p>
        </div>
      </div>
    </div>
    `;

    htmx.process(this);
  }
}

customElements.define('you-index', YouIndex);
