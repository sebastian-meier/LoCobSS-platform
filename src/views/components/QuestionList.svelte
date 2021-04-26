<script lang="typescript">
  import {push} from 'svelte-spa-router';
  import moment from 'moment';
  import QuestionLike from './QuestionLike.svelte';

  export let data:publicQuestion[] = [];
  export let hideNonLike = false;
</script>
{#if data && data.length > 0}
<ul class="question-list">
  {#each data as question}
    {#if !hideNonLike || ('liked' in question && question.liked)}
    <li>
      <div on:click={() => push('/survey/details/' + question.id)}>
        {#if question.taxonomies.length > 0}
        <ul class="taxonomy-list">
          {#each question.taxonomies as taxonomy}
            <li>{taxonomy.name}</li>
          {/each}
        </ul>
        {/if}
        <p>{question.question_de}</p>
      </div>
      <div class="meta" class:answered={question.has_reply}>
        <span class="participant"><span class="icon"></span>{question.participantSynonym}</span>
        <QuestionLike bind:question={question} />
        <span class="date">{moment(question.created).format('DD.MM.YYYY')}</span>
      </div>
    </li>
    {/if}
  {/each}
</ul>
{/if}
