<script>
  import {link, push} from 'svelte-spa-router'
  import {_} from 'svelte-i18n';
  import validate from 'validate.js'
  import PasswordInput from '../../components/forms/password_input.svelte'
  import EmailInput from '../../components/forms/email_input.svelte'
  import FormButtons from '../../components/forms/buttons.svelte'
  import { Auth } from '../../../config/firebase'

  const loginConstraints = {
    email: {
      presence: true,
      email: true
    },
    password: {
      presence: true,
      length: {
        minimum: 6,
        message: $_('password_length')
      }
    }
  }

  let email = ''
  let emailError = false
  let emailMessage = ''
  let passwordMessage = ''
  let password = ''
  let passwordError = false
  let disableAction = false

  const resetErrorInfo = () => {
    emailError = false
    emailMessage = ''
    passwordMessage = ''
    passwordError = false
  }

  const validateLoginForm = () => {
    resetErrorInfo()
    const validationResult = validate({ email, password }, loginConstraints)
    if (!validationResult) {
      return true
    } else {
      if (validationResult.email && validationResult.email.length > 0) {
        emailMessage = validationResult.email[0]
        emailError = true
      }
      if (validationResult.password && validationResult.password.length > 0) {
        passwordMessage = validationResult.password[0]
        passwordError = true
      }
    }

    return false
  }

  const signInUser = () => {
    console.log("submit");
    disableAction = true
    validateLoginForm()
    if (validateLoginForm()) {
      Auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
          disableAction = false
          push('/user/view')
        })
        .catch(error => {
          console.log("login did not work")
          disableAction = false
        })
    } else {
      disableAction = false
    }
  }
</script>

<div id="page">
  <h1>Log In</h1>
  <form ref="form" on:submit|preventDefault={signInUser}>
    <EmailInput bind:value={email} error={emailError} errorMessage={emailMessage} />
    <PasswordInput bind:value={password} error={passwordError} errorMessage={passwordMessage} />
    <FormButtons on:submit={signInUser} cancelButton={false} submitText="Login" isLoading={disableAction} />
  </form>
  <a href="/user/register" use:link>{$_('create_account')} &raquo;</a>
</div>