<script lang="ts">
  import {detailId, limit, cache, clusterQuestions, newClusterIds, ignoredQuestions, ignoredIds, relatedQuestions, relatedIds} from '../../../../stores/cluster';
  import Scatterplot from '../../../components/vis/canvas/Scatterplot.svelte';

  export let params: {id?: string} = {};
  $: {
    if ('id' in params && !isNaN(parseInt(params.id))){
      newClusterIds.set([]);
      ignoredIds.set([]);
      $detailId = parseInt(params.id);      
    }
  }

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
  $: selection = $clusterQuestions.map((q) => `${q.tsne_x}_${q.tsne_y}`);
  $: console.log(selection)

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
</script>

<Scatterplot bind:selected={selection} />

<h1>Cluster</h1>
<input type="text" placeholder="Name for cluster" />

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

<button>Apply cluster to selection</button>

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