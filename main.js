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
import '/you/index.js';
import '/you/entries.js';
import '/you/settings.js';

function navigateTo(path) {
  const app = document.querySelector('#app');
  const tabDock = document.createElement('tab-dock');
  const spacer = document.createElement('div');
  tabDock.classList.add('w-full', 'flex', 'justify-center', 'fixed', 'bottom-5');
  spacer.classList.add('h-[136px]');
  app.innerHTML = '';

  switch (path) {
    case '/':
      app.appendChild(document.createElement('tarot-index'));
      break;
    case '/tarot/settings.html':
      app.appendChild(document.createElement('tarot-settings'));
      break;
    case '/tarot/entries.html':
      app.appendChild(document.createElement('tarot-entries'));
      break;
    case '/tarot/set-intention.html':
      app.appendChild(document.createElement('set-intention'));
      break;
    case '/tarot/today-intention.html':
      app.appendChild(document.createElement('today-intention'));
      break;
    case '/tarot/entry.html':
      app.appendChild(document.createElement('entry-reading'));
      break;
    case '/tarot/manifested.html':
      app.appendChild(document.createElement('manifested-intention'));
      break;
    case '/vision-boards.html':
      app.appendChild(document.createElement('vision-boards-index'));
      break;
    case '/vision-boards/entries.html':
      app.appendChild(document.createElement('vision-board-entries'));
      break;
    case '/vision-boards/settings.html':
      app.appendChild(document.createElement('vision-board-settings'));
      break;
    case '/vision-boards/entry.html':
      app.appendChild(document.createElement('vision-board-entry'));
      break;
    case '/you.html':
      app.appendChild(document.createElement('you-page'));
      break;
    case '/you/entries.html':
      app.appendChild(document.createElement('you-entries'));
      break;
    case '/you/settings.html':
      app.appendChild(document.createElement('you-settings'));
      break;
    default:
      app.innerHTML = '<h1>404 Not Found</h1>'; // Handle unknown paths
      break;
  }
  
  app.appendChild(spacer);
  app.appendChild(tabDock);
  app.classList.add(window.location.pathname.startsWith('/you') ? 'bg-rainbow' : 'bg-neutral');

  window.history.pushState({ path }, '', path+(window.location.search ? '?' : '')+`${new URLSearchParams(window.location.search).toString()}`);
}

// Set up event listeners for navigation
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent the link from causing a page reload
      const path = link.getAttribute('href');
      navigateTo(path);
    });
  });

  // Handle browser back and forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state?.path) {
      navigateTo(e.state.path);
    }
  });
});

// Initial navigation to the current path
navigateTo(window.location.pathname);