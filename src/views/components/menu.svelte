<script lang="ts">
  import {link, location} from 'svelte-spa-router';
  import { loggedIn, hasRoles, roles } from '../../stores/current_user';
  
  export let menu: { url: string, label: string, protected: boolean, role?: string[]}[] = [];
  $: allowedMenu = menu.filter((item) => {
    if (!item.protected) {
      return true;
    } else if ($loggedIn){
      if (!('role' in item) || item.role[0] === 'all') {
        return true;
      } else {
        if ($hasRoles) {
          item.role.forEach((r) => {
            $roles.forEach((ar) => {
              if (r === ar) {
                return true;
              }
            });
          });
        }
      }
    }
    return false;
  });

  $: cLocation = $location;

</script>

<ul>
  {#each allowedMenu as item}
  <li>
    <a href="{item.url}" class:active="{(item.url !== '/' && cLocation.indexOf(item.url) === 0) || (item.url === '/' && cLocation === item.url)}" use:link>{item.label}</a>
  </li>
  {/each}
</ul>