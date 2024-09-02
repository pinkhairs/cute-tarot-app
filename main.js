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
import '/vision-boards/index.js';
import '/vision-boards/entries.js';
import '/vision-boards/settings.js';
import '/vision-boards/entry.js';
import '/vision-boards/new.js';
import '/vision-boards/board-settings.js';
import '/you/index.js';
import '/you/settings.js';
import youBg from '@/assets/you-bg.png';

async function getPath(requestPath) {
  const response = await fetch(`/pwa.php?action=check_logged_in`);
  const data = await response.text();
  if (!data || data <= 0) {
    return '/app/login.html';
  }

  if (requestPath === '/app/') {
    const response = await fetch(`/pwa.php?action=check_if_today_reading_exists`);
    const data = await response.text();

    if (data) {
      return '/app/tarot-today-intention.html';
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

getPath('/app/').then(path => {
  if (path) {
    content.setAttribute('hx-get', path);
    content.setAttribute('hx-trigger', 'load');
  } else {
    content.setAttribute('hx-get', '/app/tarot-index.html');
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
      
  if (requestPath.includes('-index.html') || requestPath.includes('tarot-today-intention.html')) {
    tabDock.classList.remove('translate-y-[150%]');
    bottomSpacer.classList.add('h-[132px]', 'flex-shrink-0');
  } else {
    tabDock.classList.add('translate-y-[150%]');
    bottomSpacer.classList.remove('h-[132px]', 'flex-shrink-0');
  }
  
      if (requestPath.includes('/app/tarot')) {

        document.documentElement.className = 'text-white';
        const mat = async () => {
          const response = await fetch(`/pwa.php?action=get_mat`);
          if (response.ok) {
            return await response.json();
          }
        }
    
        const getMat = async () => {
          return await mat();
        }
    
        const matData = getMat();
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
      } if (requestPath.includes('/app/vision-boards')) {
        document.documentElement.className = 'text-black';
        background.style.backgroundImage = '';
        background.classList.remove(`black-text`, 'white-text');
      } if (requestPath.includes('/app/you')) {
        document.documentElement.className = 'text-black';
        background.style.backgroundImage = `url(${youBg})`;
        background.classList.remove(`black-text`, 'white-text');
      }
});