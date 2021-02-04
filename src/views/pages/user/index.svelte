<script>
  import Router from 'svelte-spa-router'
  import { routes } from '../../../lib/routes/user'
</script>

<h1>User</h1>
<h2>views/pages/user/index.svelte</h2>
<Router {routes} prefix="/user" />
