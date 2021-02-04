<script>
  import {link} from 'svelte-spa-router'
</script>

<style>
</style>

<nav role="navigation">
  <div>
    <ul>
      <li>
        <a href="/" use:link>Home</a>
      </li>
      <li>
        <a href="/login" use:link>Login</a>
      </li>
      <li>
        <a href="/signup" use:link>Signup</a>
      </li>
    </ul>
  </div>
</nav>
