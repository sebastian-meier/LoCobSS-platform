<script lang="ts">
  import {loggedIn, validated} from '../../stores/current_user';
  import {link} from 'svelte-spa-router';

  $: cLoggedIn = $loggedIn;
  $: cValidated = $validated;

  export let allowInvalid = false;
</script>

{#if !cValidated || !cLoggedIn}
<div class="message warning">
  {#if !cLoggedIn}
  <p>You are not logged in! Please <a href="/user/login" use:link>login</a>.</p>
  {:else if !cValidated}
  <p>Your email is not yet validated! <a href="/user/verify" use:link>Send verification again</a>.</p>
  {/if}
</div>
{/if}

{#if cLoggedIn && (cValidated || allowInvalid)}
<slot></slot>
{/if}
