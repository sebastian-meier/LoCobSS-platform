<script lang="ts">
  import Select from "./select.svelte";
  import { createEventDispatcher } from 'svelte'
  import Buttons from "./buttons.svelte";

  export let options:{ id: number, name: string }[] = [];
  let value = null;

  const dispatch = createEventDispatcher();

  const listSelect = event => {
    if (value !== -1) {
      event.preventDefault();
      dispatch('select', value);
      value = -1;
    }
  };
</script>

<Select label="" options={[{id: -1, name: 'Please choose'}, ...options]} bind:value={value} />
<Buttons cancelButton={false} submitText='Select' on:submit={listSelect} />
