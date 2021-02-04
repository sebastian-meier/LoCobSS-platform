<script>
  import Router from 'svelte-spa-router'
  import { routes } from '../../../lib/routes/admin'
</script>

<h1>Admin</h1>
<h2>views/pages/admin/index.svelte</h2>
<Router {routes} prefix="/admin" />
