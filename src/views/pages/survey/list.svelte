<script lang="typescript">
  import {search, hasReply, taxonomies, dates, cache, page} from '../../../stores/public_search';
  import {push} from 'svelte-spa-router';
  import moment from 'moment';
  import Pagination from '../../components/Pagination.svelte';

  const toggleTaxonomy = (id: number): void => {
    let tTaxonomies = $taxonomies;
    const index = tTaxonomies.indexOf(id);
    if (index > -1) {
      tTaxonomies.splice(index, 1);
    } else {
      tTaxonomies.push(id);
    }
    taxonomies.set(tTaxonomies);
  };

  let searchText = '';

// {#each question.taxonomies as taxonomy}
// <li class:active={$taxonomies.includes(taxonomy.id)} on:click={() => toggleTaxonomy(taxonomy.id)}>{taxonomy.name}</li>
// {/each}

  $: listCount = ($cache) ? $cache.count : 0;
  $: maxPage = ($cache) ? $cache.maxPage : 0;

</script>

<h1>Questions</h1>
<input bind:value={$search} type="text" placeholder="Search" />

{#if $cache}
{#await $cache}
  LOADING
{:then data} 
<Pagination results={listCount} max={maxPage} bind:current={$page} />
<ul class="question-list">
  {#each data.results as question}
    <li on:click={() => push('/survey/details/' + question.id)}>
      {#if question.taxonomies.length > 0}
      <ul>
        {#each question.taxonomies as taxonomy}
          <li>{taxonomy.name}</li>
        {/each}
      </ul>
      {/if}
      <p>{question.question}</p>
      <div class="meta" class:answered={question.has_reply}>
        <span class="participant"><span class="icon"></span>{question.participant_synonym}</span>
        <span class="date">{moment(question.created).format('DD.MM.YYYY')}</span>
      </div>
    </li>
  {/each}
</ul>
<Pagination results={listCount} max={maxPage} bind:current={$page} />
{:catch err}
{JSON.stringify(err)}
{/await}
{/if}
