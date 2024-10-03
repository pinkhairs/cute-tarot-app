<script>
  export let message;
  export let type;
  export let id;

  const showToast = async (id) => {
    if (id) {
      document.getElementById(id).classList.add('show');
      setTimeout(() => {
        hideToast(id);
      }, 3000);
    }
  };

  const hideToast = async (id) => {
    const thisToast = document.getElementById(id);
    thisToast.classList.remove('show');

    setTimeout(() => {
      thisToast.style.maxHeight = 0;
      thisToast.remove();
    }, 1000);
  };

  setTimeout(() => {
    showToast(id);
  }, 1000)
</script>

{#if message}
  <div
    id={id}
    class="toast {type}"
    on:click={() => hideToast(id)}>
    {message}
  </div>
{/if}
