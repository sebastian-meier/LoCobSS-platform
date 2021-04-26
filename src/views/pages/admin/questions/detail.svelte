<script type="typescript">
  import {questionId, question, reload} from '../../../../stores/questions';
  import {loggedIn} from '../../../../stores/current_user';
  import {pop} from 'svelte-spa-router';
  import Textarea from '../../../components/forms/textarea.svelte';
  import Buttons from '../../../components/forms/buttons.svelte';
  import { onDestroy, onMount } from 'svelte';
  import ListSelect from '../../../components/forms/ListSelect.svelte';
  import {taxonomies, load as loadTaxonomies} from '../../../../stores/taxonomies';
  import {replies, load as loadReplies} from '../../../../stores/replies';
  import { Auth } from '../../../../config/firebase';
  import Select from '../../../components/forms/select.svelte';

  onMount(() => {
    loadTaxonomies();
    loadReplies();
  });

  onDestroy(() => {
    questionId.set(null);
  });

  let fQuestion = '';
  let fDescription = '';
  let fTaxonomies = [];
  let fReplies = [];
  let fState = '';

  export let params: {id?: string} = {};
  $: if ($loggedIn && 'id' in params && !isNaN(parseInt(params.id))) {
    questionId.set(parseInt(params.id));
  }

  question.subscribe((q) => {
    if (q) {
      fQuestion = q.question_de;
      fDescription = q.description_de;
      fTaxonomies = q.taxonomies;
      fReplies = q.replies;
      fState = q.state;
    }
  });

  const update = () => {
    Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
            `http://localhost:5001/bmbf-research-agenda/europe-west3/api/question/update/${$questionId}`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({
                question: fQuestion,
                description: fDescription,
                state: fState,
              }),
            }
          );
      })
      .then(() => {
        $reload = true;
      });
  }

  const addReply = (id: number) => {
    Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
            `http://localhost:5001/bmbf-research-agenda/europe-west3/api/replies/assign?questions=${$questionId}&replies=${id}`,
            {
              headers: {'Authorization': `Bearer ${token}`}
            }
          );
      })
      .then(() => {
        $reload = true;
      });
  };

  const addTaxonomy = (id: number) => {
    Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
            `http://localhost:5001/bmbf-research-agenda/europe-west3/api/taxonomy/assign?questions=${$questionId}&taxonomies=${id}`,
            {
              headers: {'Authorization': `Bearer ${token}`}
            }
          );
      })
      .then(() => {
        $reload = true;
      });
  };

  const revokeReply = (id: number) => {
    Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
            `http://localhost:5001/bmbf-research-agenda/europe-west3/api/replies/revoke?questions=${$questionId}&replies=${id}`,
            {
              headers: {'Authorization': `Bearer ${token}`}
            }
          );
      })
      .then(() => {
        $reload = true;
      });
  };

  const revokeTaxonomy = (id: number) => {
    Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
            `http://localhost:5001/bmbf-research-agenda/europe-west3/api/taxonomy/revoke?questions=${$questionId}&taxonomies=${id}`,
            {
              headers: {'Authorization': `Bearer ${token}`}
            }
          );
      })
      .then(() => {
        $reload = true;
      });
  };
</script>

{#if $question}
<div class="question-detail">
  <span on:click={() => pop()}>BACK BUTTON</span>
  <div class="question-header">
    <div>
      {$question.sentiment_summary}
    </div>
    <div>
      {$question.sonar_all}
    </div>
    <div>
      {$question.participantSynonym}
    </div>
    <div>
      {$question.created}
    </div>
    <div>
      <Select label="State" bind:value={fState} options={[
        { id: null, name: "Choose"},
        { id: "published", name: "Published"},
        { id: "flagged", name: "Flagged"},
        { id: "review", name: "Review"},
      ]} />
    </div>
  </div>
  <Textarea label="Question" bind:value={fQuestion} />
  <Textarea label="Description" bind:value={fDescription} />
  Replies
  <ul>
    {#each $question.replies as reply}
    <li on:click={() => revokeReply(reply.id)}>{reply.name}</li>
    {/each}
  </ul>
  <ListSelect
    options={$replies.filter((r) => !$question.replies.map((r) => r.id).includes(r.id))}
    on:select={(e) => addReply(e.detail)} />

  Taxonomies
  <ul>
    {#each $question.taxonomies as taxonomy}
    <li on:click={() => revokeTaxonomy(taxonomy.id)}>{taxonomy.name}</li>
    {/each}
  </ul>
  <ListSelect
    options={$taxonomies.filter((t) => !$question.taxonomies.map((t) => t.id).includes(t.id))}
    on:select={(e) => addTaxonomy(e.detail)} />
  <Buttons 
    submitText="save"
    on:submit={() => update()}
    on:cancel={() => pop()} />
</div>
{/if}