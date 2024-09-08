//main.js
import youBg from '@/assets/you-bg.png';
import video from '@/assets/video.mp4';
import '/components/title-bar.js';
import '/components/tarot-card-reading.js';
import '/components/tab-dock.js';
import '/components/login-page.js';
import '/components/signup-page.js';
import '/styles.css';
import '/tarot/index.js';
import '/tarot/settings.js';
import '/tarot/entries.js';
import '/tarot/set-intention.js';
import '/tarot/today-intention.js';
import '/tarot/entry.js';
import '/vision-boards/index.js';
import '/vision-boards/entries.js';
import '/vision-boards/settings.js';
import '/vision-boards/entry.js';
import '/vision-boards/new.js';
import '/vision-boards/board-settings.js';
import '/you/index.js';
import '/you/settings.js';
import '/you/pentacles.js';
import '/readings/index.js';
import { fetchWithAuth } from '@/auth';
import { Preferences } from '@capacitor/preferences';

const app = document.querySelector('#app');
const background = document.querySelector('#background');
const content = document.querySelector('#content');
const tabDock = document.createElement('tab-dock');
tabDock.classList.add('flex', 'w-max', 'justify-center', 'fixed', 'bottom-5', 'left-1/2', 'items-center', '-translate-x-1/2', 'translate-y-[150%]', 'transition-transform', 'duration-1000', 'z-50', 'ease-out');
const topSpacer = document.createElement('div');
topSpacer.classList.add('h-6', 'lg:h-8', 'flex-shrink-0');
const bottomSpacer = document.createElement('div');
const loadingState = document.getElementById("loading-screen");

const getTodayReading = async () => {
  // const userId = await Preferences.get({ key: 'user_id' });
  if (!userId.value) return;
  const todayInMonthNameDayCommaYear = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=today_card&today=${todayInMonthNameDayCommaYear}&timestamp=${Date.now()}`);
  const json = await response.json();
  return json ?? [];
};

async function setupTodayCard() {
  const todaysCard = await getTodayReading();
  content.removeAttribute('hx-get');
  content.removeAttribute('hx-trigger');

  if (todaysCard) {
    content.setAttribute('hx-get', '/tarot-today-intention.html');
  } else {
    content.setAttribute('hx-get', '/tarot-index.html');
  }

  content.setAttribute('hx-trigger', 'load');
  htmx.process(content);
}

setupTodayCard();

document.addEventListener('htmx:beforeSwap', async (event) => {
  const todaysCard = await getTodayReading();
  if (todaysCard && event.detail.pathInfo.requestPath === '/tarot-index.html') {
    event.preventDefault();
    htmx.ajax('GET', '/tarot-today-intention.html', { target: '#content' });
    return;
  }
});


document.addEventListener('htmx:beforeRequest', async (event) => {
  if (event.detail.target === content) {
    loadingState.classList.remove('hidden');
    loadingState.classList.add('flex');
    setTimeout(() => {
      loadingState.classList.remove('opacity-0');
    }, 0);
  }
});

document.addEventListener('htmx:afterSwap', async (event) => {
  const requestPath = event.detail.pathInfo.requestPath;

  if (requestPath.includes('-index.html') || requestPath.includes('tarot-today-intention.html')) {
    tabDock.classList.remove('translate-y-[150%]');
    bottomSpacer.classList.add('h-[132px]', 'flex-shrink-0');
  } else {
    tabDock.classList.add('translate-y-[150%]');
    bottomSpacer.classList.remove('h-[132px]', 'flex-shrink-0');
  }

  setTimeout(async () => {
    if (requestPath.startsWith('/tarot')) {
      document.documentElement.className = 'text-white';
      const data = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_mat`, { credentials: 'include' });
      if (!data) return;
      const matData = await data.json();
      background.style.backgroundImage = `url(${matData.mat || ''})`;
      document.documentElement.className = `text-${matData.color || 'black'}`;
      background.classList.add(matData.color+'-text');
      background.innerHTML = '';
    } else if (requestPath.startsWith('/vision-boards')) {
      document.documentElement.className = 'text-black';
      background.style.backgroundImage = '';
      background.classList.remove('black-text', 'white-text');
      background.innerHTML = '';
    } else if (requestPath.startsWith('/readings')) {
      document.documentElement.className = 'text-white';
      background.style.backgroundImage = ``;
      // add a video background
      background.innerHTML = `
        <video autoplay muted playsinline loop class="object-cover w-full h-full">
          <source src="${video}" type="video/mp4">
        </video>
      `;
      
      background.classList.add('white-text');
      background.classList.remove('black-text');
    } else {
      document.documentElement.className = 'text-black';
      background.style.backgroundImage = `url(${youBg})`;
      background.classList.remove('white-text');
      background.innerHTML = '';
    }
  }, 0);
});

app.prepend(topSpacer);
app.appendChild(bottomSpacer);
document.body.appendChild(tabDock);
