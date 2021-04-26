<script lang="ts">
  import {link, location} from 'svelte-spa-router';
  import { loggedIn, hasRoles, roles } from '../../stores/current_user';
  
  export let menu: { url: string, label: string, protected: boolean, role?: string[]}[] = [];

  $: allowedMenu = menu.filter((item, index) => {
      if (!item.protected) {
        return true;
      } else if ($loggedIn){
        if (!('role' in item) || item.role[0] === 'all') {
          return true;
        } else {
          if ($hasRoles) {
            for (let ir = 0; ir < item.role.length; ir += 1){
              for (let ur = 0; ur < $roles.length; ur += 1){
                if ($roles[ur] === item.role[ir]) {
                  return true;
                }
              }
            }
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