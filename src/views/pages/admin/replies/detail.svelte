<script type="typescript">
  import {replyId, reply, reload} from '../../../../stores/replies';
  import {loggedIn} from '../../../../stores/current_user';
  import {pop} from 'svelte-spa-router';
  import Textarea from '../../../components/forms/textarea.svelte';
  import TextInput from '../../../components/forms/text_input.svelte';
  import Buttons from '../../../components/forms/buttons.svelte';
  import { onDestroy } from 'svelte';
  import { Auth } from '../../../../config/firebase';

  onDestroy(() => {
    replyId.set(null);
  });

  let fName = '';
  let fBody = '';
  let fUrl = '';

  export let params: {id?: string} = {};
  $: if ($loggedIn && 'id' in params && !isNaN(parseInt(params.id))) {
    replyId.set(parseInt(params.id));
  }

  reply.subscribe((r) => {
    if (r) {
      fName = r.name;
      fBody = r.body;
      fUrl = r.url;
    }
  });

  const update = () => {
    Auth.currentUser.getIdToken()
      .then((token) => {
        return fetch(
            `http://localhost:5001/bmbf-research-agenda/europe-west3/api/replies/update/${$replyId}`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({
                name: fName,
                body: fBody,
                url: fUrl,
              }),
            }
          );
      })
      .then(() => {
        $reload = true;
      });
  }

</script>

{#if $reply}
<div class="question-detail">
  <span on:click={() => pop()}>BACK BUTTON</span>
  <Textarea label="Name" bind:value={fName} />
  <Textarea label="Body" bind:value={fBody} />
  <TextInput label="Url" bind:value={fUrl} />
  <Buttons 
    submitText="save"
    on:submit={() => update()}
    on:cancel={() => pop()} />
</div>
{/if}