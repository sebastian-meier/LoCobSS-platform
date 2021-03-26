<script lang="ts">
  import {
    detailId,
    limit,
    cache,
    clusterQuestions,
    newClusterIds,
    ignoredQuestions,
    ignoredIds,
    relatedQuestions,
    relatedIds} from '../../../../stores/cluster';
  import {taxonomies, load as loadTaxonomies} from '../../../../stores/taxonomies';
  import Scatterplot from '../../../components/vis/canvas/Scatterplot.svelte';
  import Select from '../../../components/forms/select.svelte';
  import { Auth } from '../../../../config/firebase';
  import { onMount } from 'svelte';
  
  export let params: {id?: string} = {};

  onMount(() => {
    loadTaxonomies();
  });

  $: {
    if ('id' in params && !isNaN(parseInt(params.id))){
      newClusterIds.set([]);
      ignoredIds.set([]);
      $detailId = parseInt(params.id);      
    }
  }
  $: selectTaxonomies = [{id: -1, name: 'New Taxonomy'}, ...(($taxonomies) ? $taxonomies.map((t) => {
      return { id: t.id, name: t.name };
    }) : [])];

  const removeFromCluster = (id: number) => {
    if (id === $detailId) {
      // TODO: message: cannot remove starting point
    } else {
      const tCluster = $newClusterIds;
      const index = tCluster.indexOf(id);
      if (index >= 0) {
        tCluster.splice(index, 1);
        newClusterIds.set(tCluster);
      }
    }
  }

  let clusterGroup: number[] = [];
  let ignoreGroup: number[] = [];
  $: selection = $clusterQuestions.map((q) => q.id);

  let newTaxonomy = '';
  let selectedTaxonomy = -1;

  const add = (group: number[], ignoreRest: boolean = true) => {
    const tCluster = $newClusterIds;
    const ignored = $ignoredIds;
    group.forEach((q) => {
      if (!tCluster.includes(q)) {
        tCluster.push(q);
      }
      if (ignored.includes(q)) {
        ignored.splice(ignored.indexOf(q), 1);
      }
    });
    newClusterIds.set(tCluster);
    if (ignoreRest) {
      $relatedIds.forEach((id) => {
        if (!group.includes(id)) {
          ignored.push(id);
        }
      });
      ignoredIds.set(ignored);
    }
    ignoreGroup = [];
    clusterGroup = [];
  };

  let message = null;
  let messageType = '';

  const applyCluster = async () => {
    let taxId = null;
    const token = await Auth.currentUser.getIdToken()
      .then((token) => {
        return token;
      });
    if (selectedTaxonomy === -1) {
      if (newTaxonomy.length > 2) {
        taxId = await fetch(
          "http://localhost:5001/bmbf-research-agenda/europe-west3/api/taxonomy/create?name=" +
            encodeURIComponent(newTaxonomy),
          {
            headers: { Authorization:  `Bearer ${token}`},
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((response) => response.id);
      }
    } else {
      taxId = selectedTaxonomy;
    }
    if (taxId) {
      await fetch(
          "http://localhost:5001/bmbf-research-agenda/europe-west3/api/taxonomy/assign?taxonomies=" +
            encodeURIComponent(taxId) + "&questions=" + encodeURIComponent(selection.join(',')),
          {
            headers: { Authorization:  `Bearer ${token}`},
            method: "GET",
          }
        );

      messageType = '';
      message = 'Taxonomy successfully applied.';
    } else {
      messageType = 'error';
      message = 'Please enter a new taxonomy or select an existing taxonomy from the drop-down and try again.';
    }
  };
</script>

{#if message}
<p class="message" class:error={messageType === 'error'} class:warning={messageType === 'warning'}>
  {message}
</p>
{/if}

<Scatterplot bind:selected={selection} />

<h1>Cluster</h1>
<Select options={selectTaxonomies} bind:value={selectedTaxonomy} errorMessage='' />
{#if selectedTaxonomy === -1}
<input type="text" placeholder="Name for cluster" bind:value={newTaxonomy} />
{/if}

<h2>Starting point</h2>
{#if $cache}
<p>{$cache.question_de}</p>
{/if}

<h2>Cluster members</h2>
<ul>
  {#each $clusterQuestions as q}
  <li on:click={() => removeFromCluster(q.id)}>{q.question_de}</li>
  {/each}
</ul>

<button on:click={applyCluster}>Apply cluster to selection</button>

<h2>Candidates</h2>
Number of candidates per item:
<select bind:value={$limit}>
  <option value="10">10</option>
  <option value="20">20</option>
  <option value="40">40</option>
</select>
<ul>
  <li>
    {#each $relatedQuestions as q}
    <li>
      <input type=checkbox bind:group={clusterGroup} value={q.id}>
      {q.question_de}</li>
    {/each}
  </li>
</ul>

<button on:click={() => add(clusterGroup)}>Add selection to cluster & ignore rest</button>

<h2>Ignored Candidates</h2>
<ul>
  {#each $ignoredQuestions as q}
  <li>
    <input type=checkbox bind:group={ignoreGroup} value={q.id}>
    {q.question_de}
  </li>
  {/each}
</ul>

<button on:click={() => add(ignoreGroup, false)}>Add selection to cluster</button>