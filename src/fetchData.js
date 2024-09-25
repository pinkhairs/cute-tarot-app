const server = `https://cutetarot.com/api.php?${Date.now()}=${Date.now()}&action=`;
import { Preferences } from "@capacitor/preferences";

const fetchData = async (action, body, method = 'GET', error = '') => {
  const token = (await Preferences.get({ key: 'token' })).value ?? null;

  if (!token && action !== 'signup' && action !== 'login') {
    return Promise.reject('Please log in again.');
  }

  if (body) {
    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    body = formData;
  }

  return fetch(server + action, {
    method,
    body,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(error);
    }
    return response.json();
  })
  .catch(() => {
    throw new Error(error);
  });
};

export default fetchData;