<script lang="typescript">
	import { onMount } from 'svelte'
	import { Canvas } from 'svelte-canvas'
	import { scaleLinear } from 'd3-scale'
	
	import Point from './Point.svelte'
	
	const margin = { top: 10, right: 10, bottom: 25, left: 25 }
	
	let points = []
	let width, height 
	
	onMount(() => {
    fetch("https://storage.googleapis.com/bmbf-research-agenda_embeddings/tsne.csv")
      .then((data) => data.text())
      .then((data) => {
        points = data.split('\n').map((d) => {
          const cols = d.split(',');
          return {
						id: parseInt(cols[0]),
            x: parseFloat(cols[1]),
            y: parseFloat(cols[2])
          };
        }).filter((d) => !isNaN(d.x));
      });
  });
	
	$: x = scaleLinear()
				 	.domain([0,1])
					.range([margin.left, width - margin.right])
					.nice();

	$: y = scaleLinear()
					.domain([0,1])
					.range([height - margin.bottom, margin.top])
					.nice();

  export let selected: number[] = [];

</script>

<style>
	div {
		width: 100%;
		height: 800px;
	}
</style>

<div bind:clientWidth={width} bind:clientHeight={height}>
	<Canvas 
		{width} {height}>
		{#each points as p}
			<Point 
				x={x(p.x)} 
				y={y(p.y)}
        fill={selected.includes(p.id) ? 'red' : 'black'} 
			/>
		{/each}
	</Canvas>
</div>