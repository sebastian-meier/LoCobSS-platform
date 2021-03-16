<script lang="typescript">
  import {search, hasReply, taxonomies, dates, cache, page} from '../../../stores/public_search';
  import Pagination from '../../components/Pagination.svelte';
  import QuestionList from '../../components/QuestionList.svelte';

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
<Pagination results={listCount} max={maxPage} bind:current={$page} range={3} />
<QuestionList data={data.results} />
<Pagination results={listCount} max={maxPage} bind:current={$page} range={3} />
{:catch err}
{JSON.stringify(err)}
{/await}
{/if}
