<script lang="ts">
  import { addAuthorization } from "../../middleware/users/auth";
  import { loggedIn } from "../../stores/current_user";
  export let question:publicQuestion;

  const toggleLike = async () => {
    if ($loggedIn) {
      question.liked = await fetch(
        `http://localhost:5001/bmbf-research-agenda/europe-west3/api/question/like/${question.id}`,
        await addAuthorization()
      ).then((response) => response.json())
      .then((respone) => respone.result);
    }
  };
</script>

{#if $loggedIn && question}
<span class="like" on:click={toggleLike} class:liked={'liked' in question && question.liked}>
  <span class="icon"></span>
</span>
{/if}