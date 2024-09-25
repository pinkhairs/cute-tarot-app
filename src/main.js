import App from '@/App.svelte';
import '@/assets/styles.css';

const target = document.getElementById('app');

const app = new App({
  target,
});

export default app;
