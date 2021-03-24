<script lang="ts">
  import { _ } from 'svelte-i18n';
  import {link} from 'svelte-spa-router';
</script>

<section class="not-found">
  <h1 class="title">{$_('page_not_found')}</h1>
  <p>
    {$_('return_to')}
    <a href="/" use:link>{$_('home')}</a>
  </p>
</section>
