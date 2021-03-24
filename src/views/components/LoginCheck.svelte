<script lang="ts">
  import {loggedIn, validated} from '../../stores/current_user';
  import {link} from 'svelte-spa-router';
  import { _ } from 'svelte-i18n';

  $: cLoggedIn = $loggedIn;
  $: cValidated = $validated;

  export let allowInvalid = false;
</script>

{#if !cValidated || !cLoggedIn}
<div class="message warning">
  {#if !cLoggedIn}
  <p>{$_('pre_login')}<a href="/user/login" use:link>{$_('login')}</a>.</p>
  {:else if !cValidated}
  <p>{$_('not_valid')} <a href="/user/verify" use:link>{$_('send_verification')}</a>.</p>
  {/if}
</div>
{/if}

{#if cLoggedIn && (cValidated || allowInvalid)}
<slot></slot>
{/if}
