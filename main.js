import '/components/title-bar.js';
import '/components/tarot-card-reading.js';
import '/components/tab-dock.js';
import '/styles.css';
import '/tarot/index.js';
import '/tarot/settings.js';
import '/tarot/entries.js';
import '/tarot/set-intention.js';
import '/tarot/today-intention.js';
import '/tarot/entry.js';
import '/tarot/manifested.js';
import '/vision-boards/index.js';
import '/vision-boards/entries.js';
import '/vision-boards/settings.js';
import '/vision-boards/entry.js';
import '/vision-boards/new.js';
import '/you/index.js';
import '/you/settings.js';
import youBg from '@/assets/you-bg.png';

const checkIfLoggedIn = async () => {
  const response = await fetch(`/pwa.php?action=check_logged_in`);
  if (response.ok) {
    return await response.json();
  }
};

// Define the function to get the nonce value
const getLoggedIn = async () => {
  return await checkIfLoggedIn();
};

const paths = {
  '/app/': '/app/tarot-index.html',
  '/app/today.html': '/app/tarot-today-intention.html',
  '/app/tarot/entries.html': '/app/tarot-entries.html',
  '/app/tarot/settings.html': '/app/tarot-settings.html',
  '/app/tarot/entry.html': '/app/tarot-entry.html',
  
  '/app/vision-boards.html': '/app/vision-boards-index.html',
  '/app/vision-boards/entries.html': '/app/vision-boards-entries.html',
  '/app/vision-boards/settings.html': '/app/vision-boards-settings.html',
  '/app/vision-boards/entry.html': '/app/vision-boards-entry.html',
  '/app/vision-boards/new.html': '/app/vision-boards-new.html',

  '/app/you.html': '/app/you-index.html',
  '/app/you/settings.html': '/app/you-settings.html',
}

const app = document.querySelector('#app');
const path = paths[window.location.pathname];
const background = document.querySelector('#background');
const content = document.querySelector('#content');
const tabDock = document.createElement('tab-dock');
tabDock.classList.add('flex', 'w-max', 'justify-center', 'fixed', 'bottom-5', 'left-1/2', 'items-center', '-translate-x-1/2', 'translate-y-[150%]', 'transition-transform', 'duration-1000', 'z-50');
const topSpacer = document.createElement('div');
topSpacer.classList.add('h-6', 'lg:h-8', 'flex-shrink-0');
app.prepend(topSpacer);
const bottomSpacer = document.createElement('div');
app.appendChild(bottomSpacer);
document.body.appendChild(tabDock);

const loadingState = document.getElementById("loading-screen");

content.setAttribute('hx-get', path);
content.setAttribute('hx-trigger', 'load');

document.addEventListener('htmx:beforeRequest', (event) => {
  if (event.detail.target === content) {
    loadingState.classList.remove('hidden');
    loadingState.classList.add('flex');
    setTimeout(() => {
      loadingState.classList.remove('opacity-0');
    }, 0);
  }
});

document.addEventListener('htmx:afterRequest', (event) => {
    document.documentElement.className = 'text-white';
    if (event.detail.target === content) {
    const mat = async () => {
      const response = await fetch(`/pwa.php?action=get_mat`);
      if (response.ok) {
        return await response.json();
      }
    }
    
    if (event.detail.pathInfo.requestPath.includes('-index.html')) {
      tabDock.classList.remove('translate-y-[150%]');
      bottomSpacer.classList.add('h-[132px]', 'flex-shrink-0');
    } else {
      tabDock.classList.add('translate-y-[150%]');
      bottomSpacer.classList.remove('h-[132px]', 'flex-shrink-0');
    }

    const getMat = async () => {
      return await mat();
    }

    const matData = getMat();

    if (window.location.pathname.startsWith('/app/tarot') || window.location.pathname === '/app/') {
      matData.then(async data => {
        let matJson;
        let textColor
        if (!matData) {
          matJson = '';
          textColor = 'black';
        } else {
          matJson = JSON.parse(data).mat;
          textColor = JSON.parse(data).color;
        }

        background.style.backgroundImage = `url(${matJson})`;
        document.documentElement.className = `text-${textColor}`;
        background.classList.add(`${textColor}-text`);
      })
    } if (window.location.pathname.startsWith('/app/vision-boards')) {
      document.documentElement.className = 'text-black';
      background.style.backgroundImage = '';
      background.classList.remove(`black-text`, 'white-text');
    } if (window.location.pathname.startsWith('/app/you')) {
      document.documentElement.className = 'text-black';
      background.style.backgroundImage = `url(${youBg})`;
    }
  }
});

getLoggedIn().then(data => {
  if (!data) {
    window.location.href = '/log-in';
  }
});