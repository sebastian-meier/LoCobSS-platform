<script>
  import { _ } from "svelte-i18n";

  export let id = 'selectElement'
  export let label = 'Select'
  export let value = ''
  export let error = false
  export let errorMessage = $_('please_select')
  export let helpText = ''
  export let options = []
  export let defaultOption = {}
  $: if (defaultOption.id) {
    options.unshift(defaultOption)
  }
</script>

<div class="input-field">
  <label for={id}>{label}</label>
  <select bind:value {id} class:invalid={error}>
    {#each options as option (option.id)}
      <option value={option.id}>{option.name}</option>
    {/each}
  </select>
  <span class="helper-text">{helpText}</span>
  <span class="error-text">{errorMessage}</span>
</div>