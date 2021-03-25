<script lang="ts">
  import {loggedIn, validated, roles, hasRoles} from '../../stores/current_user';
  import {link} from 'svelte-spa-router';
  import { _ } from 'svelte-i18n';

  export let allowInvalid = false;
  export let allowRoles = ['admin'];

  let rolesValid = false;
  $: {
    if (allowRoles[0] === 'all') {
      rolesValid = true;
    } else {
      if ($hasRoles) {
        $roles.forEach((r) => {
          allowRoles.forEach((ar) => {
            if (r === ar) {
              rolesValid = true;
            }
          });
        });
      }
    }
  }
</script>

{#if !$validated || !$loggedIn || !rolesValid}
<div class="message warning">
  {#if !$loggedIn}
  <p>{$_('pre_login')}<a href="/user/login" use:link>{$_('login')}</a>.</p>
  {:else if !rolesValid}
  <p>Your account does not have the correct privileges for this page.</p>
  {:else if !$validated}
  <p>{$_('not_valid')} <a href="/user/verify" use:link>{$_('send_verification')}</a>.</p>
  {/if}
</div>
{/if}

{#if $loggedIn && ($validated || allowInvalid) && rolesValid}
<slot></slot>
{/if}
