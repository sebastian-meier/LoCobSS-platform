<script lang="ts">
  import LoginCheck from '../../components/LoginCheck.svelte';
  import {link} from 'svelte-spa-router';
  import {currentUser} from '../../../stores/current_user';

  $: userName = $currentUser.name || '';
</script>

<LoginCheck allowInvalid={true} allowRoles={['all']}>
  <h1>Willkommen {userName}</h1>
  <a href="/user/edit" use:link>Edit profile</a><br />
  <a href="/user/delete" use:link>Delete account</a><br />
  <a href="/user/logout" use:link>Logout</a>
</LoginCheck>
