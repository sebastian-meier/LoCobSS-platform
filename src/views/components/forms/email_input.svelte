<script>
  export let inputName = 'email'
  export let id = 'email'
  export let label = 'E-Mail'
  export let value = ''
  export let error = false
  export let errorMessage = ''
</script>

<div class="input-field">
  <label for={id}>{label}</label>
  <span class="error-text">{errorMessage}</span>
  <input
    bind:value
    on:input={() => (error = false)}
    type="email"
    name={inputName}
    {id}
    class="validate"
    class:invalid={error}
    on:blur />
</div>
