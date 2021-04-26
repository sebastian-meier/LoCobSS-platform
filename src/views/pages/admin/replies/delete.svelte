<script type="typescript">
  import {replyId, reply} from '../../../../stores/replies';
  import {loggedIn} from '../../../../stores/current_user';
  import {pop} from 'svelte-spa-router';
  import Buttons from '../../../components/forms/buttons.svelte';
  import { Auth } from '../../../../config/firebase';
  import Loader from '../../../components/Loader.svelte';
  import { onDestroy } from 'svelte';

  onDestroy(() => {
    replyId.set(null);
  });

  export let params: {id?: string} = {};
  $: if ($loggedIn && 'id' in params && !isNaN(parseInt(params.id))) {
    replyId.set(parseInt(params.id));
  }

  let state = "ready";

  const deleteReply = () => {
    if ($replyId && $loggedIn) {
      state = 'loading';
      Auth.currentUser.getIdToken()
        .then((token) => {
          return fetch(
              `http://localhost:5001/bmbf-research-agenda/europe-west3/api/reply/delete/${$replyId}`,
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
{#if $reply}
<div class="question-detail">
  <span on:click={() => pop()}>BACK BUTTON</span>
  <p>Are you sure you want to delete the following reply:</p>
  <h1>{$reply.name}</h1>
  <Buttons 
    submitText="delete"
    on:submit={() => deleteReply()}
    on:cancel={() => pop()} />
</div>
{/if}
{:else}
<Loader />
{/if}