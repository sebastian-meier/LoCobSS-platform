<script lang="ts">
  import LoginCheck from '../../components/LoginCheck.svelte';
  import {link} from 'svelte-spa-router';
  import {currentUser} from '../../../stores/current_user';
  import { _ } from 'svelte-i18n';
  import { capitalize } from '../../../lib/utils';

  $: userName = $currentUser.name || '';
</script>

<LoginCheck allowInvalid={true}>
  <h1>{$_('welcome')} {userName}</h1>
  <a href="/user/edit" use:link>{$_('edit_profile')}</a><br />
  <a href="/user/delete" use:link>{$_('delete_profile')}</a><br />
  <a href="/user/logout" use:link>{capitalize($_('logout'))}</a>
</LoginCheck>
