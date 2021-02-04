<script lang="ts">
  import {link, location} from 'svelte-spa-router';
  import { loggedIn } from '../../stores/current_user';
  
  export let menu: { url: string, label: string, protected: boolean}[] = [];

  $: cLoggedIn = $loggedIn;
  $: cLocation = $location;

</script>

<ul>
  {#each menu as item}
  {#if !item.protected || (item.protected && cLoggedIn) }
  <li>
    <a href="{item.url}" class:active="{cLocation === item.url}" use:link>{item.label}</a>
  </li>
  {/if}
  {/each}
</ul>