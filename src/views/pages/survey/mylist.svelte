<script lang="typescript">
  import {questions, load} from '../../../stores/myquestions';
  import QuestionList from '../../components/QuestionList.svelte';
  import LoginCheck from '../../components/LoginCheck.svelte';
  import { loggedIn } from '../../../stores/current_user';
  import Loader from '../../components/Loader.svelte';
  import { onMount } from 'svelte';
  import {_} from 'svelte-i18n';

  onMount(() => {
    if ($loggedIn) {
      load();
    }
  });

  $: {
    if ($loggedIn) {
      load();
    }
  }

  $: myQuestions = ($questions) ? $questions.filter((q) => q.relation === 'ask') : [];
  $: likeQuestions = ($questions) ? $questions.filter((q) => q.relation === 'like') : [];
</script>

<h1>{$_('survey_your--headline')}</h1>
<LoginCheck allowRoles={['all']}>
{#if $questions}
{#if myQuestions.length > 0}
<h2>{$_('survey_your--sec1')}</h2>
<QuestionList data={myQuestions} />
{/if}
{#if likeQuestions.length > 0}
<h2>{$_('survey_your--sec2')}</h2>
<QuestionList data={likeQuestions} hideNonLike={true} />
{/if}
{:else}
<Loader />
{/if}
</LoginCheck>