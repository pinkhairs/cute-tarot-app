import { LogSnag } from 'logsnag';
import { Preferences } from '@capacitor/preferences';

const logsnag = new LogSnag({ 
  token: '05f2e74c752a2b7b1ad77cf71dd9b89e',
  project: 'cute-tarot'
});

export const getUserId = async () => {
  const userId = await Preferences.get({ key: 'user_id' });
  return String(userId.value);
}

export const trackEvent = async (channel, event, icon, notify = false, tags = {}, properties = {}) => {
  await logsnag.track({
    channel,
    event,
    user_id: String(await getUserId()) ?? '',
    icon,
    notify,
    tags,
    properties
  });
}

export const identify = async (user) => {
  return await logsnag.identify({
    user_id: String(await getUserId()),
    properties: {
      email: user.email,
      name: user.name
    }
  });
}