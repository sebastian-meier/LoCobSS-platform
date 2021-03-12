<script lang="ts">
  export let results:number;
  export let max:number;
  export let current:number;
  export let range: number = 5;
</script>

<div class="pagination">
  <span>Results: {results}</span>
  <ul>
    {#if current - range > 0}
    <li on:click={() => { current=0; }}>1</li>
    <li>...</li>
    {/if}

    {#each Array(range * 2 + 1) as _, i}
    {#if current-range+i >= 1 && current-range+i <= max}
    <li on:click={() => { current=current-range+i; }} class:active={i === range}>{current-range+i+1}</li>
    {/if}
    {/each}

    {#if max - current > 0}
    <li>...</li>
    <li on:click={() => { current=(max-1); }}>{max}</li>
    {/if}
  </ul>
</div>