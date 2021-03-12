<script lang="ts">
  import {Auth} from '../../../config/firebase';
  import {loggedIn, validated} from '../../../stores/current_user';
  import {link} from 'svelte-spa-router';

  let state = '';

  if ($loggedIn && !$validated) {
    Auth.currentUser.sendEmailVerification({
      url: __global.env.SITE_URL + '/#/user/login'
    }).then(function() {
      state = 'send';
      console.log('send');
      return Auth.signOut();
    }).catch(function(error) {
      console.log(error);
    });
  } else if ($loggedIn) {
    state = 'valid';
  } else {
    state = 'login';
  }

</script>

<h1>Verification</h1>
<p>
{#if state === 'valid'}
Looks like you are already verified.
{:else if state === 'login'}
You need to <a href="/user/login" use:link>login</a> first to re-verify your account.
{:else if state === 'send'}
Verification mail send again. Please <a href="/user/login" use:link>login</a> after verifying your account.
{:else}
Please wait...
{/if}
</p>