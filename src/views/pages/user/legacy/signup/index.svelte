<script>
  import SignupForm from './form.svelte'
  import {link} from 'svelte-spa-router'
</script>

<style>
</style>

<main>
  <h1>Create your account</h1>
  <SignupForm />
  <a href="/login" use:link>Already have an account? Log in</a>
</main>
