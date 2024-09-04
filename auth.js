import { Preferences } from '@capacitor/preferences';

// Utility to set JWT token
export async function setToken(token) {
    await Preferences.set({
        key: 'authToken',
        value: token
    });
}

// Utility to get JWT token
export async function getToken() {
    const result = await Preferences.get({ key: 'authToken' });
    return result.value ?? null;
}

// Utility to remove JWT token
export async function removeToken() {
    await Preferences.remove({ key: 'authToken' });
}

export async function fetchWithAuth(url, options = {}) {
  const token = await getToken();
  const validateToken = async (token) => {
    const request = await fetch(`${import.meta.env.VITE_API_BASE_URL}/pwa.php?action=is_valid_jwt&token=${token}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const response = await request.text();
    return response;
  }
  if (!await validateToken(token)) {
    await Preferences.set({ key: 'go_to_login', value: 'true' });
  }

  // Add the token to the Authorization header
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, options);

  return response;
}