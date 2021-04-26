<script type="typescript">
  import {taxonomyId, taxonomy, reload, taxonomies, load} from '../../../../stores/taxonomies';
  import {loggedIn} from '../../../../stores/current_user';
  import {pop} from 'svelte-spa-router';
  import TextInput from '../../../components/forms/text_input.svelte';
  import Buttons from '../../../components/forms/buttons.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { Auth } from '../../../../config/firebase';
import Select from '../../../components/forms/select.svelte';

  onMount(() => {
    load();
  });

  onDestroy(() => {
    taxonomyId.set(null);
  });

  let fName = '';
  let fParent = null;

  export let params: {id?: string} = {};
  $: if ($loggedIn && 'id' in params && !isNaN(parseInt(params.id))) {
    taxonomyId.set(parseInt(params.id));
  }

  taxonomy.subscribe((t) => {
    console.log(t);
    if (t) {
      fName = t.name;
      fParent = t.parent;
    }
  });

  const update = () => {
    Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
            `http://localhost:5001/bmbf-research-agenda/europe-west3/api/taxonomy/update/${$taxonomyId}`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({
                name: fName,
                parent: fParent,
              }),
            }
          );
      })
      .then(() => {
        $reload = true;
      });
  }

</script>

{#if $taxonomy}
<div class="question-detail">
  <span on:click={() => pop()}>BACK BUTTON</span>
  <TextInput label="Name" bind:value={fName} />
  <Select 
    label="Parent Taxonomy"
    options={[{ id: null, name: "Choose"}, ...$taxonomies.filter((t) => t.id !== $taxonomyId)]} 
    bind:value={fParent} />
  <Buttons 
    submitText="save"
    on:submit={() => update()}
    on:cancel={() => pop()} />
</div>
{/if}