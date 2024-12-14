<script>
  import Toast from '@/src/components/Toast.svelte';
  export let notifications;

  $: {
    if (notifications.length > 0) {
      setTimeout(() => {
        notifications.shift();
      }, 20000);
    }
  }
</script>

<div class="z-[100] fixed left-1/2 -translate-x-1/2 toasts flex flex-col gap-2">
{#each notifications as toast}
  <Toast id={Date.now()} message={toast.message} type={toast.type}></Toast>
{/each}
</div>