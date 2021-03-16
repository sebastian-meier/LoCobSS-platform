<script lang="typescript">
  import {push} from 'svelte-spa-router';
  import moment from 'moment';

  export let data:publicQuestion[] = [];
</script>
<ul class="question-list">
  {#each data as question}
    <li on:click={() => push('/survey/details/' + question.id)}>
      {#if question.taxonomies.length > 0}
      <ul>
        {#each question.taxonomies as taxonomy}
          <li>{taxonomy.name}</li>
        {/each}
      </ul>
      {/if}
      <p>{question.question_de}</p>
      <div class="meta" class:answered={question.has_reply}>
        <span class="participant"><span class="icon"></span>{question.participantSynonym}</span>
        <span class="date">{moment(question.created).format('DD.MM.YYYY')}</span>
      </div>
    </li>
  {/each}
</ul>