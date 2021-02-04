<script>
  import LoginForm from './form.svelte'
  import {link} from 'svelte-spa-router'
</script>

<main>
  <h1>Log In</h1>
  <LoginForm />
  <a href="/signup" use:link>Create an account.</a>
</main>
