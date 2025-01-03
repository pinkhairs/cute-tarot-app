<script>
  import { loading } from '@/src/store.js';
  export let title = '';
  export let subtitle = '';
</script>

<div class="flex flex-col gap-2">
  <header class="px-6">
    <div class="flex-shrink-0 flex items-center gap-4 justify-center">
      <div class="w-8">
        <slot name="left-action"></slot>
      </div>
      <div class="flex-grow text-center">
        <h1 class="break-words">{title}</h1>
      </div>
      <div class="flex-shrink-0 flex items-center justify-end w-8 relative">
        <slot name="right-action"></slot>
      </div>
    </div>
  </header>
  {#if subtitle}
    <div class="pt-2 px-6 text-center text-xl">{subtitle}</div>
  {/if}
</div>