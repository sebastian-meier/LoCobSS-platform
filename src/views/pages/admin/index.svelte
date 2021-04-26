<script>
  import Router from 'svelte-spa-router';
  import { routes } from '../../../lib/routes/admin';
  import Menu from '../../components/menu.svelte';
  import {_} from 'svelte-i18n';

  const menu = [
    { url: '/admin/questions',   label: $_('questions'),  protected: true, roles: ['admin'] },
    { url: '/admin/taxonomies',  label: $_('taxonomies'),  protected: true, roles: ['admin'] },
    { url: '/admin/replies',  label: $_('replies'),  protected: true, roles: ['admin'] },
    { url: '/admin/users',       label: $_('users'),      protected: true, roles: ['admin'] },
  ];
</script>

<div id="page-container" class="sidebar">
  <div id="sidebar">
    <nav>
      <Menu menu={menu} />
    </nav>
  </div>
  <div id="content">
    <div id="page">
      <Router {routes} prefix="/admin" />
    </div>
  </div>
</div>