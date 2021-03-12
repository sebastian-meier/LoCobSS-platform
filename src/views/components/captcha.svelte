<script lang="ts">
  import { onMount } from 'svelte';

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
  <p>To protect the site, we need to make sure you are a real person.<br />We are sorry, but robots are not allowed to participate:</p>
  <div class="g-recaptcha" data-sitekey="{siteKey}" id="recaptcha-container"></div>
</div>