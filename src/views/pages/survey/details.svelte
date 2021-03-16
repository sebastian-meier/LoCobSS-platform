<script type="typescript">
  import {detailId, relatedCache, cache} from '../../../stores/public_detail';
  import QuestionList from '../../components/QuestionList.svelte';
  import {pop} from 'svelte-spa-router';
  import moment from 'moment';

  export let params: {id?: string} = {};

  $: detailId.set(('id' in params && params.id) ? params.id : null)
</script>

<span on:click={() => pop()}>BACK BUTTON</span>
{#if $cache}
{#if $cache.taxonomies.length > 0}
<ul>
  {#each $cache.taxonomies as taxonomy}
    <li>{taxonomy.name}</li>
  {/each}
</ul>
{/if}
<h1 class:answered={$cache.has_reply}>{$cache.question_de}</h1>
{#if $cache.description_de.length > 0}
<p>{$cache.description_de}</p>
{/if}
<div class="meta">
  <span class="participant"><span class="icon"></span>{$cache.participantSynonym}</span>
  <span class="date">{moment($cache.created).format('DD.MM.YYYY')}</span>
</div>

{#if $cache.replies.length > 0}
<h2>Replies</h2>
<ul class="replies">
  {#each $cache.replies as reply}
    <li>{reply.name}</li>
  {/each}
</ul>
{/if}
{/if}

{#if $relatedCache}
<h2>RELATED CONTENT</h2>
<QuestionList data={$relatedCache.results} />
{/if}