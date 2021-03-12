<script>
  import Router from 'svelte-spa-router'
  import { routes } from '../../../lib/routes/user'
</script>

<div id="page">
  <Router {routes} prefix="/user" />
</div>