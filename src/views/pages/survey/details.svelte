<script type="typescript">
  import {detailId, relatedCache, cache} from '../../../stores/public_detail';
  import QuestionList from '../../components/QuestionList.svelte';
  import QuestionLike from '../../components/QuestionLike.svelte';
  import {pop} from 'svelte-spa-router';
  import {_} from 'svelte-i18n';
  import moment from 'moment';

  export let params: {id?: string} = {};

  $: detailId.set(('id' in params && params.id) ? params.id : null)
</script>

<div class="question-detail">
  <span class="back-button" on:click={() => pop()}>&laquo; {$_('back')}</span>
  {#if $cache}
  {#if $cache.taxonomies.length > 0}
  <ul>
    {#each $cache.taxonomies as taxonomy}
      <li>{taxonomy.name}</li>
    {/each}
  </ul>
  {/if}
  <QuestionLike question={$cache} />
  <h1 class:answered={$cache.has_reply}>{$cache.question_de}</h1>
  {#if $cache.description_de.length > 0}
  <p>{$cache.description_de}</p>
  {/if}
  <div class="meta">
    <span class="participant"><span class="icon"></span>{$cache.participantSynonym}</span>
    <span class="date">{moment($cache.created).format('DD.MM.YYYY')}</span>
  </div>

  {#if $cache.replies.length > 0}
  <h2>{$_('replies')}</h2>
  <ul class="replies">
    {#each $cache.replies as reply}
      <li>{reply.name}</li>
    {/each}
  </ul>
  {/if}
  {/if}
  {#if $relatedCache}
  <h2>{$_('related_content')}</h2>
  <QuestionList data={$relatedCache} />
  {/if}
</div>
