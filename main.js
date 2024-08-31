import '/components/title-bar.js';
import '/components/tarot-card-reading.js';
import '/components/tab-dock.js';
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
  tabDock.classList.add('flex', 'justify-center', 'fixed', 'bottom-5', 'left-1/2', 'items-center', '-translate-x-1/2');
  spacer.classList.add('h-[136px]');
  app.innerHTML = '';

  switch (path) {
    case '/app/':
      app.appendChild(document.createElement('tarot-index'));
      break;
    case '/app/tarot/settings.html':
      app.appendChild(document.createElement('tarot-settings'));
      break;
    case '/app/tarot/entries.html':
      app.appendChild(document.createElement('tarot-entries'));
      break;
    case '/app/tarot/set-intention.html':
      app.appendChild(document.createElement('set-intention'));
      break;
    case '/app/tarot/today-intention.html':
      app.appendChild(document.createElement('today-intention'));
      break;
    case '/app/tarot/entry.html':
      app.appendChild(document.createElement('entry-reading'));
      break;
    case '/app/tarot/manifested.html':
      app.appendChild(document.createElement('manifested-intention'));
      break;
    case '/app/vision-boards.html':
      app.appendChild(document.createElement('vision-boards-index'));
      break;
    case '/app/vision-boards/entries.html':
      app.appendChild(document.createElement('vision-board-entries'));
      break;
    case '/app/vision-boards/settings.html':
      app.appendChild(document.createElement('vision-board-settings'));
      break;
    case '/app/vision-boards/entry.html':
      app.appendChild(document.createElement('vision-board-entry'));
      break;
    case '/app/you.html':
      app.appendChild(document.createElement('you-page'));
      break;
    case '/app/you/entries.html':
      app.appendChild(document.createElement('you-entries'));
      break;
    case '/app/you/settings.html':
      app.appendChild(document.createElement('you-settings'));
      break;
    default:
      app.innerHTML = '<h1>404 Not Found</h1>'; // Handle unknown paths
      break;
  }
  
  app.appendChild(spacer);
  app.appendChild(tabDock);
  app.classList.add(window.location.pathname.startsWith('/app/you') ? 'bg-rainbow' : 'bg-neutral');

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