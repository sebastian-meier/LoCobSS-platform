<script type="typescript">
  import {taxonomyId, taxonomy} from '../../../../stores/taxonomies';
  import {loggedIn} from '../../../../stores/current_user';
  import {pop} from 'svelte-spa-router';
  import Buttons from '../../../components/forms/buttons.svelte';
  import { Auth } from '../../../../config/firebase';
  import Loader from '../../../components/Loader.svelte';
  import { onDestroy } from 'svelte';

  onDestroy(() => {
    taxonomyId.set(null);
  });

  export let params: {id?: string} = {};
  $: if ($loggedIn && 'id' in params && !isNaN(parseInt(params.id))) {
    taxonomyId.set(parseInt(params.id));
  }

  let state = "ready";

  const deleteTaxonomy = () => {
    if ($taxonomyId && $loggedIn) {
      state = 'loading';
      Auth.currentUser.getIdToken()
        .then((token) => {
          return fetch(
              `http://localhost:5001/bmbf-research-agenda/europe-west3/api/taxonomy/delete/${$taxonomyId}`,
              {
                headers: {'Authorization': `Bearer ${token}`}
              }
            );
        })
        .then(() => {
          pop();
        });
    }
  };
</script>

{#if state === 'ready'}
{#if $taxonomy}
<div class="question-detail">
  <span on:click={() => pop()}>BACK BUTTON</span>
  <p>Are you sure you want to delete the following taxonomy:</p>
  <h1>{$taxonomy.name}</h1>
  <Buttons 
    submitText="delete"
    on:submit={() => deleteTaxonomy()}
    on:cancel={() => pop()} />
</div>
{/if}
{:else}
<Loader />
{/if}