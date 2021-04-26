<script lang="typescript">
  import {search, hasReply, taxonomies, cache, page, isLoading} from '../../../stores/public_search';
  import Pagination from '../../components/Pagination.svelte';
  import QuestionList from '../../components/QuestionList.svelte';
  import Checkbox from '../../components/forms/checkbox.svelte';
  import {taxonomies as taxonomyStore, load as loadTaxonomies} from '../../../stores/taxonomies';
  import Loader from '../../components/Loader.svelte';
  import {_} from 'svelte-i18n';
  import {capitalize} from '../../../lib/utils';

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

  loadTaxonomies();

  let searchText = '';

  $: listCount = ($cache) ? $cache.count : 0;
  $: maxPage = ($cache) ? $cache.maxPage : 0;

  /*
   * This system has also a system implemented for date based search
   * simply set an array to $dates from the public_search store with
   * start and end date.
   */

</script>

<h1>{$_('survey_list--headline')}</h1>
<div id="list-filters">
<input bind:value={$search} type="text" placeholder={capitalize($_('search'))} id="list-search" />
<Checkbox bind:checked={$hasReply} label={$_('survey_list--replies')} />
{#if $taxonomyStore && $taxonomyStore.length > 0}
<h3><strong>{$_('survey_list--taxonomies')}</strong>:</h3>
<ul>
{#each $taxonomyStore as taxonomy}
<li class:active={$taxonomies.includes(taxonomy.id)} on:click={() => toggleTaxonomy(taxonomy.id)}>{taxonomy.name}</li>
{/each}
</ul>
{/if}
</div>
{#if $isLoading}
<Loader />
{:else}
{#if $cache}
<Pagination results={listCount} max={maxPage} bind:current={$page} range={3} />
<QuestionList data={$cache.results} />
<Pagination results={listCount} max={maxPage} bind:current={$page} range={3} />
{/if}
{/if}
