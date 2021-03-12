<script>
  import Router from 'svelte-spa-router';
  import { routes } from '../../../lib/routes/admin';
  import Menu from '../../components/menu.svelte'

  const menu = [
    { url: '/admin/questions',   label: 'Questions',  protected: true },
    { url: '/admin/users',       label: 'Users',      protected: true },
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