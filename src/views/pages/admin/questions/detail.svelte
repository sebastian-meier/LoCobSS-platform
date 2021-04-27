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
  import {_} from 'svelte-i18n';
  import moment from 'moment';

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

  let sonar_classes: { class_name: string, confidence: number }[];

  $: if ($question) {
    sonar_classes = JSON.parse($question.sonar_all).sort((a, b) => {
      return b.confidence - a.confidence;
    });
  }

</script>

{#if $question}
<div class="question-detail">
  <span class="back-button" on:click={() => pop()}>&laquo; {$_('back')}</span>
  <span class="date">
    {$_('question_added')}:&nbsp;{moment($question.created).format('DD.MM.YYYY HH:mm')}
    {$_('by')}
    <strong>{($question.participantSynonym === undefined) ? $_('undefined') : $question.participantSynonym}</strong></span>
  <div>
    <Select label={$_('state')} bind:value={fState} options={[
      { id: null, name: $_('please_choose')},
      { id: "published", name: $_('published')},
      { id: "flagged", name: $_('flagged')},
      { id: "review", name: $_('review')},
    ]} errorMessage="" />
  </div>
  <div style="margin-top:20px;">
    <Textarea label={$_('question')} bind:value={fQuestion} id="questionField" />
    <Textarea label={$_('survey_ask--label_notes')} bind:value={fDescription} id="descriptionField" />
    <Buttons 
      submitText={$_('save')}
      on:submit={() => update()}
      on:cancel={() => pop()} />
  </div>
  <div class="columns" style="margin-top:30px; margin-bottom:30px;">
    <div>
      <h3>{$_('replies')}</h3>
      <ul>
        {#each $question.replies as reply}
        <li on:click={() => revokeReply(reply.id)}>{reply.name}</li>
        {/each}
      </ul>
      <ListSelect
        errorMessage=""
        options={$replies.filter((r) => !$question.replies.map((r) => r.id).includes(r.id))}
        on:select={(e) => addReply(e.detail)} />
    </div>
    <div class="gap"></div>
    <div>
      <h3>{$_('taxonomies')}</h3>
      <ul>
        {#each $question.taxonomies as taxonomy}
        <li on:click={() => revokeTaxonomy(taxonomy.id)}>{taxonomy.name}</li>
        {/each}
      </ul>
      <ListSelect
        errorMessage=""
        options={$taxonomies.filter((t) => !$question.taxonomies.map((t) => t.id).includes(t.id))}
        on:select={(e) => addTaxonomy(e.detail)} />
    </div>
  </div>

  <div class="question-header">
    <h3>{$_('analysis_results')}</h3>
    <div class="columns">
      <div>
        <strong>{$_('sentiment')}</strong><br />
        {$_('negative')}: {JSON.parse($question.sentiment_summary).neg.mean} ⌀<br />
        {$_('neutral')}: {JSON.parse($question.sentiment_summary).neu.mean} ⌀<br />
        {$_('positive')}: {JSON.parse($question.sentiment_summary).pos.mean} ⌀<br />
      </div>
      <div>
        <strong>{$_('sonar_classes')}:</strong>
        {#each sonar_classes as sonar_class}
          <br />{$_('hate_' + sonar_class.class_name)}: {sonar_class.confidence.toFixed(3)}
        {/each}
      </div>
      <div>
        <strong>{$_('profanity')}:</strong><br />
        {($question.profanityfilter !== 0) ? $_('profan_yes') : $_('profan_no')}
      </div>
    </div>
  </div>

</div>
{/if}