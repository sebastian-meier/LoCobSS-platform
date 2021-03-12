<script>
  import Router from 'svelte-spa-router'
  import { routes } from '../../../lib/routes/survey'
  import Menu from '../../components/menu.svelte'

  const menu = [
    { url: '/survey/ask',   label: 'Ask a Question',    protected: false },
    { url: '/survey/list',  label: 'Explore Questions', protected: false },
  ];

  export let params = {}
</script>

<div id="page-container" class="sidebar">
  <div id="sidebar">
    <nav>
      <Menu menu={menu} />
    </nav>
  </div>
  <div id="content">
    <div id="page">
      <Router {routes} prefix="/survey" />
    </div>
  </div>
</div>