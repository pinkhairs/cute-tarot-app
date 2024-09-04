import { Preferences } from '@capacitor/preferences';
import youBg from '@/assets/you-bg.png';

export async function setToken(token) {
  console.log('Setting token:', token);  // Add this line
  await Preferences.set({
      key: 'authToken',
      value: token
  });
}

export async function getToken() {
  const result = await Preferences.get({ key: 'authToken' });
  console.log('Retrieved token:', result.value);  // Add this line
  return result.value ?? null;
}

// Utility to remove JWT token
export async function removeToken() {
    await Preferences.remove({ key: 'authToken' });
}

function redirectToLogin() {
  const background = document.querySelector('#background');
  const content = document.querySelector('#content');
  document.documentElement.className = 'text-black';
  background.style.backgroundImage = `url(${youBg})`;
  background.classList.remove('black-text', 'white-text');
  content.setAttribute('hx-get', '/account-login-page.html');
  content.setAttribute('hx-trigger', 'load');
  htmx.process(content);
}
export async function fetchWithAuth(url, options = {}) {
  const token = await getToken();
  const timestamp = Date.now();

  if (!token) {
    redirectToLogin();
    return;
  }

  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url+'&'+timestamp+'='+timestamp, options);
  return response;
}
