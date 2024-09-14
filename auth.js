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

// Utility to remove JWT token
export async function removeToken() {
  await Preferences.remove({ key: 'authToken' });
}

function redirectToSignup() {
  htmx.ajax('GET', '/account-signup-page.html', '#content');
}

// Global counter to track active requests
let activeRequests = 0;

export async function fetchWithAuth(url, options = {}, hideLoading = false) {
  const token = await getToken();
  const timestamp = Date.now();

  if (!token) {
    await removeToken();
  }

  // Show loading screen if this is the first active request
  if (activeRequests === 0 && !hideLoading) {
    showLoadingScreen();
  }
  activeRequests++;

  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await fetch(url + '&' + timestamp + '=' + timestamp, options);

    if (response.status === 401 || !token) {
      redirectToSignup();
      return;
    }

    if (response.ok) {
      return response;  // Return the response if the request was successful
    } else {
      console.error('Request failed', response);
      throw new Error('Request failed');
    }

  } catch (error) {
    console.error('Error during fetch', error);
    throw error;

  } finally {
    // Always decrement activeRequests, even if an error occurs
    activeRequests--;

    // Hide loading screen when all requests have finished
    if (activeRequests === 0) {
      hideLoadingScreen();
    }
  }
}
