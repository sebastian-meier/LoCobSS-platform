<script lang="ts">
import Loader from '../../components/Loader.svelte';
import RelatedRater from '../../components/RelatedRater.svelte';
import TextArea from '../../components/forms/textarea.svelte';
import TextInput from '../../components/forms/text_input.svelte';
import Select from '../../components/forms/select.svelte';
import Button from '../../components/forms/buttons.svelte';
import RadioGroup from '../../components/forms/radio_group.svelte';
import Captcha from '../../components/captcha.svelte';
import { Auth } from '../../../config/firebase'
import {emailValidation, hasNumbersAndLetters} from '../../../lib/utils';
import {
  postcodes,
  load,
  reset,
  question,
  description,
  name,
  mail,
  age,
  gender,
  postcode,
  register,
  related,
  questionAsked,
  questionAskedId,
  relatedToken} from '../../../stores/ask';
import PasswordInput from '../../components/forms/password_input.svelte';
import {loggedIn, validated} from '../../../stores/current_user';
import {_} from 'svelte-i18n';

load();

let state = 'ask';
let password = '';
let disableAction = false;
let message = null;
let messageType = 'info';
let captchaResponse;
let processingTexts = [
  '',
  $_('survey_ask--txt_upload'),
  $_('survey_ask--txt_check'),
  $_('survey_ask--txt_find')
];
let processingId = 0;
let processingTimeout = null;

$: {
  if ($loggedIn) {
    $register = 'registered';
  }
}

const errors = {
  "question": { error: false, message: '' },
  "mail": { error: false, message: '' },
  "password": { error: false, message: '' },
  "postcode": { error: false, message: '' }
};

const resetError = (keys?: string[]): void => {
  if (!keys || keys.length === 0) {
    keys = Object.keys(errors);
  }
  keys.forEach((k) => {
    errors[k].error = false;
    errors[k].message = '';
  });
};

const setError = (key: string, message: string): void => {
  errors[key] = {
    error: true,
    message
  };
};

const processErrors = (code: number, stats: null | {
    postcode: number,
    state: string,
    regiostar: number
  }) => {
  switch (code) {
    case 2:
      // No valid question
      messageType = 'error';
      message = $_('survey_ask--msg_question');
      errors.question.error = true;
      window.grecaptcha.reset();
      disableAction = false;
      break;
    case 4:
      // Email already registered
      messageType = 'error';
      message = $_('survey_ask--msg_inuse');
      setError('mail', '');
      setError('password', '');
      disableAction = false;
      state = 'ask';
      break;
    case 5:
      // Email not validated
      messageType = 'error';
      message = $_('survey_ask--validate');
      disableAction = false;
      state = 'ask';
      break;
    case 3:
      // Oh no something went wrong
      messageType = 'error';
      message = $_('survey_ask--msg_error');
      disableAction = false;
      state = 'ask';
      break;
    case 1:
      // No valid captcha
      messageType = 'error';
      message = $_('survey_ask--msg_robot_again');
      disableAction = false;
      state = 'ask';
      break;
  }
}

const submitQuestion = async () => {
  disableAction = true;
  message = '';
  state = 'processing'
  // validation
  let valid = true;
  let token = null;

  // 3. check if grecaptcha was fullfilled
  if (!captchaResponse) {
    valid = false;
    messageType = 'error';
    message = $_('survey_ask--msg_robot');
  }

  // 1. is there a question
  if (!$question || $question.length < 10) {
    valid = false;
    setError('question', $_('survey_ask--msg_question'));
  } else {
    resetError(['question']);
  }

  // 2. if someone would like to register, we need email and password
  if ($register === 'yes' || $register === 'registered') {
    if ($register === 'registered' && $validated && $loggedIn) {
      try {
        token = await Auth.currentUser.getIdToken()
          .then((token) => {
            return token;
          });
        $name = await Auth.currentUser.displayName;
      } catch (err) {
        console.log(err);
        valid = false;
        messageType = 'error';
        message = $_('survey_ask--msg_wrong');
      }
    } else if($register === 'registered' && $loggedIn && !$validated) {
      valid = false;
      messageType = 'error';
      message = $_('survey_ask--validate');
    } else {
      if (!$mail || $mail.length < 6 || !emailValidation($mail)) {
        valid = false;
        setError('mail', $_('survey_ask--msg_mail'));
      } else {
        resetError(['mail']);
      }
      if (!password || password.length < 8 || !hasNumbersAndLetters(password)) {
        valid = false;
        setError('password', $_('survey_ask--msg_password'));
      } else {
        resetError(['password']);
      }
      if (valid && $register === 'registered') {
        try {
          token = await Auth.signInWithEmailAndPassword($mail, password)
            .then((user) => {
              return Auth.currentUser.getIdToken()
                .then((token) => {
                  return token;
                });
            });
        } catch (error) {
          console.log(error);
          valid = false;
          setError('password', '');
          setError('mail', '');
          messageType = 'error';
          message = $_('survey_ask--msg_login');
          state = 'ask';
        }
      }
    }
  } else {
    resetError(['mail', 'password']);
  }

  let stats: {
    postcode: number,
    state: string,
    regiostar: number
  } = null;

  if ($postcode) {
    let validPostcode = false;
    // PRIVACY-FIRST MEASUREMENT
    // Instead of providing the detailed postcode, we only derive
    // the federal state of the postcode and the region type of
    // the postcode:
    // 51: Stadtregionen - Metropolen
    // 52: Stadtregionen - Regiopolen und Großstädte
    // 53: Stadtregionen - Umland
    // 54: Ländliche Regionen -Städte, städtischer Raum
    // 55: Ländliche Regionen -Kleinstädtischer, dörflicher Raum
    if ($postcode.length >= 4 && !isNaN(parseInt($postcode))) {
      $postcodes.forEach((p) => {
        if (p.postcode === parseInt($postcode)){
          validPostcode = true;
          stats = p;
        }
      });
    }
    if (!validPostcode) {
      valid = false;
      setError('postcode', $_('survey_ask--msg_postcode'));
    } else {
      resetError(['postcode']);
    }
  } else {
    resetError(['postcode']);
  }

  if (valid) {
    resetError();

    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      processingId = 1;
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
      processingTimeout = setTimeout(() => {
        if (processingId < processingTexts.length - 1) {
          processingId += 1
        } else {
          clearTimeout(processingTimeout);
          processingTimeout = null;
        }
      }, 10000);

      // http://localhost:5001/bmbf-research-agenda/europe-west3/api/
      // https://europe-west3-bmbf-research-agenda.cloudfunctions.net/api/
      const response = await fetch(`http://localhost:5001/bmbf-research-agenda/europe-west3/api/${($loggedIn && $validated) ? '' : 'public/'}question/create`, {
        method: 'POST',
        cache: 'no-cache',
        headers,
        body: JSON.stringify({
          grecaptcha: captchaResponse,
          register: $register.toString(),
          mail: $mail,
          password,
          question: $question,
          name: ($name) ? $name : 'anonym',
          description: $description,
          age: $age,
          gender: $gender,
          state: (stats) ? stats.state : null,
          regiostar: (stats) ? stats.regiostar : null
        })
      });

      const jResponse = await response.json();

      if ('errorCode' in jResponse) {
        processErrors(jResponse.errorCode, stats)
      } else {
        if ($register === 'yes') {
          try {
            await Auth.signInWithEmailAndPassword($mail, password)
              .then(async (user) => {
                await Auth.currentUser.updateProfile({
                    displayName: $name || 'anonymous'
                });

                await Auth.currentUser.sendEmailVerification({
                  url: __global.env.SITE_URL + '/#/user/login'
                });
              });
          } catch (error) {
            console.log(error);
          }
        }

        questionAsked.set(jResponse.text);
        related.set(jResponse.results);
        relatedToken.set(jResponse.token);
        questionAskedId.set(jResponse.question);

        reset();
        messageType = '';
        message = $_('survey_ask--msg_ok');
        disableAction = false;
        state = 'asked';
      }
    } catch (error) {
      console.log(error);
      messageType = 'error';
      message = $_('survey_ask--msg_error');
      window.grecaptcha.reset();
      disableAction = false;
    }
  } else {
    disableAction = false;
    state = 'ask';
  }
};

</script>

<h1>{$_('survey_ask--headline')}</h1>
{#if $loggedIn && !$validated && state === 'ask' && message !== $_('survey_ask--validate')}
<p class="message warning">
  {$_('survey_ask--validate')}
</p>
{/if}
{#if message}
<p 
  class="message"
  class:error={messageType==='error'}
  class:info={messageType==='info'}
  class:warning={messageType==='warning'}>{@html message}</p>
{/if}
{#if state === 'ask'}
<div id="intro">
  <p>{$_('survey_ask--intro')}</p>
  <p>{@html $_('required_text')}</p>
</div>
<form>
  <TextArea
    bind:value={$question}
    error={errors.question.error}
    id="questionArea"
    label={$_('survey_ask--label_question')}
    errorMessage={errors.question.message} />
  <TextArea
    bind:value={$description}
    label={$_('survey_ask--label_notes')} />
  {#if !$loggedIn}
    <TextInput
    bind:value={$name}
    label={$_('survey_ask--label_name')} />
  <h2>{$_('survey_ask--about_title')}:</h2>
  <p>{$_('survey_ask--about_copy')}:</p>
  <div class="columns">
    <div>
      <TextInput
        bind:value={$postcode}
        label={$_('survey_ask--label_postcode')}
        error={errors.postcode.error}
        errorMessage={errors.postcode.message} />    
    </div>
    <div class="gap"></div>
    <div>
      <Select
        bind:value={$gender}
        label={$_('survey_ask--label_gender')}
        helpText=""
        errorMessage=""
        options={[
          {id: '_', name: ''},
          {id: 'f', name: $_('female')},
          {id: 'm', name: $_('male')},
          {id: '*', name: '*'}
        ]} />
    </div>
    <div class="gap"></div>
    <div>
      <Select
        bind:value={$age}
        label={$_('survey_ask--label_age')}
        errorMessage=""
        helpText=""
        options={[
          {id: '_', name: ''},
          {id: '<6',    name: $_('younger_than') + ' 6'}, 
          {id: '6_12',  name: '6 ' + $_('to') + ' 12'}, 
          {id: '13_18', name: '13 ' + $_('to') + ' 18'}, 
          {id: '19_29', name: '19 ' + $_('to') + ' 29'}, 
          {id: '30_39', name: '30 ' + $_('to') + ' 39'}, 
          {id: '40_49', name: '40 ' + $_('to') + ' 49'}, 
          {id: '50_65', name: '50 ' + $_('to') + ' 65'}, 
          {id: '66_79', name: '66 ' + $_('to') + ' 79'}, 
          {id: '>=80',  name: '80 ' + $_('and_older')}
        ]} />
    </div>
  </div>
  <h2>{$_('survey_ask--intouch_title')}</h2>
  <p>{$_('survey_ask--intouch_copy')}</p>
  <RadioGroup
    bind:value={$register}
    id="register"
    group={[
      { value: 'no', label: $_('survey_ask--label_no')},
      { value: 'yes', label: $_('survey_ask--label_yes')},
      { value: 'registered', label: $_('survey_ask--label_already')}
    ]} />
  {#if $register === 'yes' || $register === 'registered'}
  {#if $register === 'yes'}
  <p>{@html $_('survey_ask--register_copy')}</p>
  {/if}
  {#if $register === 'registered'}
  <p>{@html $_('survey_ask--login_copy')}</p>
  {/if}
  <div class="columns">
    <div>
      <TextInput
      bind:value={$mail}
      error={errors.mail.error}
      label={$_('survey_ask--label_mail')}
      errorMessage={errors.mail.message} />
    </div>
    <div class="gap"></div>
    <div>
      <PasswordInput
      bind:value={password}
      error={errors.password.error}
      label={$_('survey_ask--label_mail')}
      errorMessage={errors.password.message} />
    </div>
  </div>
  {/if}
  {/if}
  <Captcha bind:response={captchaResponse} />
  <Button on:submit={submitQuestion} id="questionSubmit" cancelButton={false} submitText={$_('survey_ask--label_submit')} isLoading={(disableAction||!$postcodes) ? true : false} />
</form>
{:else if state === 'asked'}
<p>{$_('survey_ask--thanks')}</p>
<div class="question-detail"><h1>{$questionAsked}</h1></div>

<div class="related-rating-container">
<ul>
{#each $related as q}
<RelatedRater question={q} token={$relatedToken} source={$questionAskedId} />
{/each}
</ul>
</div>
<button on:click={() => { message = ''; state = 'ask'; }}>{$_('survey_ask--again')}</button>
{:else if state === 'loading' || state === 'processing'}
<p>{processingTexts[processingId]}</p>
<Loader />
{:else}
Ooops...
{/if}


<style lang="scss">
  p{
    padding-bottom:20px;
  }

  h2{
    padding-top:30px;
  }
</style>