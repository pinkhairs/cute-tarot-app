import { Preferences } from "@capacitor/preferences";
import { loading } from '@/src/store.js';
import { get } from 'svelte/store';

const fetchData = async (action, body, method = 'GET', error = '') => {
  loading.set(true);
  const token = (await Preferences.get({ key: 'token' })).value ?? null;
  let server = '';
  if (token || action === 'validate') {
    server = `https://cutetarot.com/api.php?${Date.now()}=${Date.now()}&action=`;
  } else {
    server = `https://cutetarot.com/anon.php?${Date.now()}=${Date.now()}&action=`;
  }

  if (body) {
    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    body = formData;
  }
  let meta;

  if (token) {
    meta = {
      method,
      body,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  } else {
    meta = {
      method,
      body,
    }
  }

  return fetch(server + action, meta)
  .then(response => {
    if (!response.ok) {
      throw new Error(error);
    }

    setTimeout(() => {
      loading.set(false);
    }, 0);

    return response.json();
  })
  .catch(() => {
    console.log('error', error);
    throw new Error(error);
  });
};

export default fetchData;