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
import youBg from '@/assets/you-bg.png';
import { fetchWithAuth } from '@/auth'; // Adjust the path as necessary

const app = document.querySelector('#app');
const background = document.querySelector('#background');
const content = document.querySelector('#content');
const tabDock = document.createElement('tab-dock');
tabDock.classList.add('flex', 'w-max', 'justify-center', 'fixed', 'bottom-5', 'left-1/2', 'items-center', '-translate-x-1/2', 'translate-y-[150%]', 'transition-transform', 'duration-1000', 'z-50', 'ease-out');
const topSpacer = document.createElement('div');
topSpacer.classList.add('h-6', 'lg:h-8', 'flex-shrink-0');
app.prepend(topSpacer);
const bottomSpacer = document.createElement('div');
app.appendChild(bottomSpacer);
document.body.appendChild(tabDock);
const loadingState = document.getElementById("loading-screen");

const getTodayReading = async () => {
  const data = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=today_card`, { credentials: 'include' });
  return await data.json();
}

async function setupTodayCard() {
  const todaysCard = await getTodayReading();

  const content = document.getElementById('content'); // Ensure you have the correct element
  // Remove any existing HTMX attributes
  content.removeAttribute('hx-get');
  content.removeAttribute('hx-trigger');

  // Conditionally set the hx-get attribute based on the user's status
  content.setAttribute('hx-get', todaysCard ? '/tarot-today-intention.html' : '/tarot-index.html');
  content.setAttribute('hx-trigger', 'load');

  // Reinitialize HTMX on the content element
  htmx.process(content);
}

setupTodayCard();

document.addEventListener('htmx:beforeSwap', async (event) => {
  const todaysCard = await getTodayReading();

  // Check if today's card exists and if the current request is for tarot-index.html
  if (todaysCard && event.detail.pathInfo.requestPath === '/tarot-index.html') {
    // Prevent htmx from swapping the default view
    event.preventDefault();

    // Optionally, load a different view or navigate to a different URL
    // You can use htmx or window.location to navigate or modify the DOM directly
    htmx.ajax('GET', '/tarot-today-intention.html', { target: '#content' });

    return; // Exit the function after handling the event
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
  const requestPath = event.detail.pathInfo.requestPath;

  // Ensure tabs respond properly
  if (requestPath.includes('-index.html') || requestPath.includes('tarot-today-intention.html')) {
    tabDock.classList.remove('translate-y-[150%]');
    bottomSpacer.classList.add('h-[132px]', 'flex-shrink-0');
  } else {
    tabDock.classList.add('translate-y-[150%]');
    bottomSpacer.classList.remove('h-[132px]', 'flex-shrink-0');
  }
  
  // Theme settings for different sections
  if (requestPath.includes('/tarot')) {
    document.documentElement.className = 'text-white';
    const data = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_mat`, { credentials: 'include' });
    const matData = await data.json();
    background.style.backgroundImage = `url(${matData.mat || ''})`;
    document.documentElement.className = `text-${matData.color || 'black'}`;
    background.classList.add(matData.color+'-text');
  } else if (requestPath.includes('/vision-boards')) {
    document.documentElement.className = 'text-black';
    background.style.backgroundImage = '';
    background.classList.remove('black-text', 'white-text');
  } else if (requestPath.includes('/you') || requestPath.includes('/account')) {
    document.documentElement.className = 'text-black';
    background.style.backgroundImage = `url(${youBg})`;
    background.classList.remove('black-text', 'white-text');
  }
});
