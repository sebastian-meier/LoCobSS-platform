<script type="typescript">
  import {questionId, question} from '../../../../stores/questions';
  import {loggedIn} from '../../../../stores/current_user';
  import {pop} from 'svelte-spa-router';
  import Buttons from '../../../components/forms/buttons.svelte';
  import { Auth } from '../../../../config/firebase';
  import Loader from '../../../components/Loader.svelte';
  import { onDestroy } from 'svelte';

  onDestroy(() => {
    questionId.set(null);
  });

  export let params: {id?: string} = {};
  $: if ($loggedIn && 'id' in params && !isNaN(parseInt(params.id))) {
    questionId.set(parseInt(params.id));
  }

  let state = "ready";

  const deleteQuestion = () => {
    if ($questionId && $loggedIn) {
      state = 'loading';
      Auth.currentUser.getIdToken()
        .then((token) => {
          return fetch(
              `http://localhost:5001/bmbf-research-agenda/europe-west3/api/question/delete/${$questionId}`,
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
{#if $question}
<div class="question-detail">
  <span on:click={() => pop()}>BACK BUTTON</span>
  <p>Are you sure you want to delete the following question:</p>
  <h1>{$question.question_de}</h1>
  <Buttons 
    submitText="delete"
    on:submit={() => deleteQuestion()}
    on:cancel={() => pop()} />
</div>
{/if}
{:else}
<Loader />
{/if}