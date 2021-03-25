<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
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
  <p>To protect the site, we need to make sure you are a real person.<br />We are sorry, but robots are not allowed to participate:</p>
  <div class="g-recaptcha" data-sitekey="{siteKey}" data-callback="verifyUser" id="recaptcha-container"></div>
</div>