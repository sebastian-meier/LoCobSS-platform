<script lang="ts">
  import {Auth} from '../../../config/firebase';
  import {push} from 'svelte-spa-router';

  Auth.signOut().then(() => {
    push('/user/login');
  });
</script>