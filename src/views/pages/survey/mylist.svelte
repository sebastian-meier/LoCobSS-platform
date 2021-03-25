<script lang="typescript">
  import {questions, load} from '../../../stores/myquestions';
  import QuestionList from '../../components/QuestionList.svelte';
  import LoginCheck from '../../components/LoginCheck.svelte';
  import { loggedIn } from '../../../stores/current_user';

  $: {
    if ($loggedIn) {
      load();
    }
  }
</script>

<h1>Your Questions</h1>
<LoginCheck allowRoles={['all']}>
{#if $questions}
{#await $questions}
  LOADING
{:then data} 
<QuestionList data={data} />
{:catch err}
{JSON.stringify(err)}
{/await}
{/if}
</LoginCheck>