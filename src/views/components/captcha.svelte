<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';

  onMount(() => {

    let script = document.createElement('script');
    script.src = "https://www.google.com/recaptcha/api.js";
    document.head.append(script);

    // script.onload = function() {
    // };

  });

  const siteKey = __global.env.RECAPTCHA_v2;

</script>

<div class="g-recaptcha-container">
  <p>{@html $_('no_robots')}</p>
  <div class="g-recaptcha" data-sitekey="{siteKey}" id="recaptcha-container"></div>
</div>