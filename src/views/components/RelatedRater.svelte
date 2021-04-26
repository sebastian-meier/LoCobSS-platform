<script lang="ts">
  import RadioGroup from './forms/radio_group.svelte';
  import {v4 as uuid} from 'uuid';
  import {_} from 'svelte-i18n';
  
  export let question: publicQuestion = null;
  export let token: string = null;
  export let source: number = null;

  const ratings = [
    {label: $_('rel_not'), value: 0},
    {label: $_('rel_slightly'), value: 1},
    {label: $_('rel_strong'), value: 2},
  ];
  let isRated = false;
  let selection = null;
  let id = uuid();

  $: {
    if (selection) {
      isRated = true;
      fetch(`http://localhost:5001/bmbf-research-agenda/europe-west3/api/questions/link`, {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source,
            target:question.id,
            strength:selection,
            token
          })
        });
    }
  }
</script>
<li class:rated={isRated}>
  <div class="rate-body">
    {question.question_de}
  </div>
  <div class="rate-control">
    <RadioGroup id={id} group={ratings} bind:value={selection} />
  </div>
</li>
