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

const getPath = async (requestPath) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_credentials`, {
    credentials: 'include'
  });
  const userInfo = await response.json();

  const nonce = userInfo.nonce;

  if (!userInfo.user_id) {
      return '/account-signup-page.html';
  }

  if (requestPath === '/tarot-index.html' || requestPath === '/') {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=check_if_today_reading_exists&_wpnonce=${nonce}`, {
        credentials: 'include'
      });
      const data = await response.text();
      if (data) {
        return '/tarot-today-intention.html';
      }
  }
}

const app = document.querySelector('#app');
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

getPath('/').then(path => {
  if (path) {
    content.setAttribute('hx-get', path);
    content.setAttribute('hx-trigger', 'load');
  } else {
    content.setAttribute('hx-get', '/tarot-index.html');
    content.setAttribute('hx-trigger', 'load');
  }
  htmx.process(content);
});


document.addEventListener('htmx:beforeRequest', (event) => {
  if (event.detail.target === content) {
    loadingState.classList.remove('hidden');
    loadingState.classList.add('flex');
    setTimeout(() => {
      loadingState.classList.remove('opacity-0');
    }, 0);
  }
  const requestPath = event.detail.pathInfo.requestPath;
  if (requestPath === '/tarot-index.html') {
    getPath(requestPath).then(path => {
      if (path === '/tarot-today-intention.html') {
        window.location.reload();
        return;
      }
    });
  }
      
  if (requestPath.includes('-index.html') || requestPath.includes('tarot-today-intention.html')) {
    tabDock.classList.remove('translate-y-[150%]');
    bottomSpacer.classList.add('h-[132px]', 'flex-shrink-0');
  } else {
    tabDock.classList.add('translate-y-[150%]');
    bottomSpacer.classList.remove('h-[132px]', 'flex-shrink-0');
  }
  
      if (requestPath.includes('/tarot')) {
        const getNonce = async () => {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_nonce`, {
            credentials: 'include'
          });
          return await response.text();
        }

        getNonce().then(nonce => {
          document.documentElement.className = 'text-white';
          const mat = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=get_mat&_wpnonce=${nonce}`, { credentials: 'include' });
            return await response.json();
          }
          mat().then(data => {
            let matJson;
            let textColor
            if (!data.mat) {
              matJson = '';
              textColor = 'black';
            } else {
              matJson = data.mat;
              textColor = data.color;
            }
    
            background.style.backgroundImage = `url(${matJson})`;
            document.documentElement.className = `text-${textColor}`;
            background.classList.add(`${textColor}-text`);
          });
        });
      } if (requestPath.includes('/vision-boards')) {
        document.documentElement.className = 'text-black';
        background.style.backgroundImage = '';
        background.classList.remove(`black-text`, 'white-text');
      } if (requestPath.includes('/you') || requestPath.includes('/account')) {
        document.documentElement.className = 'text-black';
        background.style.backgroundImage = `url(${youBg})`;
        background.classList.remove(`black-text`, 'white-text');
      }
});