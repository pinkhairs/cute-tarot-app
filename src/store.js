import { writable } from 'svelte/store';

export const user = writable();
export const loading = writable(true);
export const customAvatar = writable();