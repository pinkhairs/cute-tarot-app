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
import '/digital/index.js';
import '/digital/entries.js';
import '/digital/entry.js';
import '/you/index.js';
import '/you/settings.js';
import '/you/entries.js';
import '/you/pentacles.js';
import '/readings/index.js';
import '/readings/entries.js';
import '/readings/entry.js';
import '/reference/index.js';
import '/reference/entry.js';
import { fetchWithAuth, getToken } from '@/auth';

const app = document.querySelector('#app');
const background = document.querySelector('#background');
const content = document.querySelector('#content');
const tabDock = document.createElement('tab-dock');
tabDock.classList.add('flex', 'w-max', 'justify-center', 'fixed', 'bottom-5', 'left-1/2', 'items-center', '-translate-x-1/2', 'translate-y-[150%]', 'transition-transform', 'duration-1000', 'z-[100]', 'ease-out');
const topSpacer = document.createElement('div');
topSpacer.classList.add('h-6', 'lg:h-8', 'flex-shrink-0', 'top-spacer');
const bottomSpacer = document.createElement('div');

document.addEventListener('DOMContentLoaded', async (event) => {
  app.prepend(topSpacer);
  app.append(bottomSpacer);

  try {
    await getTodayReading();
  } catch (error) {
    htmx.ajax('GET', '/account-signup-page.html', '#content');
  }

  app.appendChild(tabDock);
});

const getTodayReading = async () => {
  const todayInMonthNameDayCommaYear = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=today_card&title=${todayInMonthNameDayCommaYear}&${Date.now()}=${Date.now()}`);
  const json = await response.json() ?? [];

  if (json.length === 0) {
    htmx.ajax('GET', '/tarot-index.html', '#content');
  } else {
    htmx.ajax('GET', '/tarot-today-intention.html', '#content');
  }
};

document.addEventListener('htmx:afterSwap', async (event) => {
  const requestPath = event.detail.pathInfo.requestPath;
  if (requestPath.includes('account')) {
    document.documentElement.className = 'text-black';
    background.style.backgroundImage = `url(${youBg})`;
    background.classList.remove('white-text', 'black-text');
    background.innerHTML = '';
    return;
  }

  const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_deck_preference`)
  if (!response) return;
  if (!response.ok) throw new Error('Network response was not ok.');
  const deck = await response.text();

  if (deck !== 'Spoopy Tarot') {
    document.documentElement.setAttribute('data-theme', 'kawaii');
  } else {
    document.documentElement.setAttribute('data-theme', 'spoopy');
  }

  if (requestPath.includes('-index.html') || requestPath.includes('tarot-today-intention.html')) {
    tabDock.classList.remove('translate-y-[150%]');
    bottomSpacer.classList.add('h-[118px]', 'flex-shrink-0');
  } else {
    tabDock.classList.add('translate-y-[150%]');
    bottomSpacer.classList.remove('h-[118px]', 'flex-shrink-0');
  }

  setTimeout(async () => {
    if (requestPath.startsWith('/tarot')) {
      document.documentElement.className = 'text-white';
      const data = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_mat`);
      if (!data) return;
      const matData = await data.json();
      background.style.backgroundImage = `url(${matData.mat || ''})`;
      document.documentElement.className = `text-${matData.color || 'black'}`;
      background.classList.add(matData.color+'-text');
      background.innerHTML = '';
    } else if (requestPath.startsWith('/digital')) {
      document.documentElement.className = 'text-black';
      background.style.backgroundImage = '';
      background.classList.remove('black-text', 'white-text');
      background.innerHTML = '';
    } else if (requestPath.startsWith('/readings')) {
      if (requestPath.includes('entr')) {
        document.documentElement.className = 'text-black';
        background.style.backgroundImage = '';
        background.classList.add('black-text');
        background.innerHTML = '';
      } else {
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
      }
    } else if (requestPath.startsWith('/reference')) {
      document.documentElement.className = 'text-black';
      background.style.backgroundImage = `url()`;
      background.classList.remove('black-text', 'white-text');
      background.innerHTML = '';
    } else {
      document.documentElement.className = 'text-black';
      background.style.backgroundImage = `url(${youBg})`;
      background.classList.remove('white-text', 'black-text');
      background.innerHTML = '';
    }
  }, 0);
});