<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { _ } from 'svelte-i18n';

  const siteKey = __global.env.RECAPTCHA_v2;
  export let response: string = null;

  const verifyUser = (e) => {
    response = e;
  }

  onMount(() => {
    window.verifyUser = verifyUser;
  });

  onDestroy(() => {
    window.verifyUser = null;
  });

</script>

<svelte:head>
  <script src="https://www.google.com/recaptcha/api.js"></script>
</svelte:head>

<div class="g-recaptcha-container">
  <p>{@html $_('no_robots')}</p>
  <div class="g-recaptcha" data-sitekey="{siteKey}" data-callback="verifyUser" id="recaptcha-container"></div>
</div>