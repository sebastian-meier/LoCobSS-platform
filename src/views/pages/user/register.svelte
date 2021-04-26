<script>
  import {link, push} from 'svelte-spa-router'
  import {_} from 'svelte-i18n';

  import validate from 'validate.js'
  import { Auth } from '../../../config/firebase'

  import TextInput from '../../components/forms/text_input.svelte'
  import PasswordInput from '../../components/forms/password_input.svelte'
  import EmailInput from '../../components/forms/email_input.svelte'
  import FormButtons from '../../components/forms/buttons.svelte'

  const signupConstraints = {
    name: {
      presence: true,
      length: {
        minimum: 4,
        message: $_('name_length')
      }
    },
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

  let name = ''
  let nameError = false
  let nameMessage = ''
  let email = ''
  let emailError = false
  let emailMessage = ''
  let passwordMessage = ''
  let password = ''
  let passwordError = false
  let disableAction = false

  const resetErrorInfo = () => {
    nameError = false
    nameMessage = ''
    emailError = false
    emailMessage = ''
    passwordMessage = ''
    passwordError = false
  }

  const validateLoginForm = () => {
    resetErrorInfo()
    const validationResult = validate({ name, email, password }, signupConstraints)
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
      if (validationResult.name && validationResult.name.length > 0) {
        nameMessage = validationResult.name[0]
        nameError = true
      }
    }

    return false
  }

  const signInUser = async () => {
    disableAction = true
    validateLoginForm()
    if (validateLoginForm()) {
      await Auth.createUserWithEmailAndPassword(email, password);
      const user = Auth.currentUser;
      if (user) {
        await user.updateProfile({
            displayName: name
        }); 

        await user.sendEmailVerification({
          url: __global.env.SITE_URL + '/#/user/login'
        });
      }
      Auth.signOut().then(() => {
        push('/login')
      });
    } else {
      disableAction = false
    }
  }
</script>

<div id="page">
  <h1>{$_('create_account_title')}</h1>
  <form ref="form" on:submit|preventDefault={signInUser}>
    <TextInput
      bind:value={name}
      error={nameError}
      label={$_('survey_ask--label_name')}
      errorMessage={nameMessage} />
    <EmailInput bind:value={email} error={emailError} errorMessage={emailMessage} />
    <PasswordInput bind:value={password} error={passwordError} errorMessage={passwordMessage} />
    <FormButtons cancelButton={false} submitText={$_('create_account_action')} isLoading={disableAction} />
  </form>  
  {$_('already_account')} <a href="/user/login" use:link>{$_('already_account_action')} &raquo;</a>
</div>
