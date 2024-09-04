import { Preferences } from '@capacitor/preferences';

export async function setToken(token) {
    await Preferences.set({
        key: 'authToken',
        value: token
    });
}

export async function getToken() {
    const result = await Preferences.get({ key: 'authToken' });
    return result.value ?? null;
}

export async function removeToken() {
    await Preferences.remove({ key: 'authToken' });
}

export async function fetchWithAuth(url, options = {}) {
  const token = await getToken();
  if (!token) {
    redirectToLogin();
    throw new Error('Authentication token not found.');
    return;
  }
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  const response = await fetch(url, options);
  if (response.status !== 200) {
    redirectToLogin();
    return;
  }
  hideLoadingScreen();
  return response;
}

// Redirect using htmx
function redirectToLogin() {
  document.body.dispatchEvent(new CustomEvent('redirectTo', { detail: { url: '/account-login-page.html' } }));
}