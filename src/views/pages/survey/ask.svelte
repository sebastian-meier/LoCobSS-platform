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

load();

let state = 'ask';
let password = '';
let disableAction = false;
let message = null;
let messageType = 'info';
let captchaResponse;
let processingTexts = [
  '',
  'Uploading Question',
  'Checking Question',
  'Finding connections between your Question and other Questions on the platform'
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
      message = 'Please provide a valid question.';
      errors.question.error = true;
      window.grecaptcha.reset();
      disableAction = false;
      break;
    case 4:
      // Email already registered
      messageType = 'error';
      message = 'This email adress is already in use.';
      setError('mail', '');
      setError('password', '');
      disableAction = false;
      state = 'ask';
      break;
    case 5:
      // Email not validated
      messageType = 'error';
      message = 'This email is not yet validated. Please validate before submitting another question.';
      disableAction = false;
      state = 'ask';
      break;
    case 3:
      // Oh no something went wrong
      messageType = 'error';
      message = 'We are really sorry, but something went wrong. Please try again in a minute.';
      disableAction = false;
      state = 'ask';
      break;
    case 1:
      // No valid captcha
      messageType = 'error';
      message = 'Please fill out the robot test at the end of the form. This is not your fault. Sometimes when the internet is too slow, the robot test becomes invalid before we can check it.';
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
    message = 'Please answer the robot test at the end of the form, before submitting';
  }

  // 1. is there a question
  if (!$question || $question.length < 10) {
    valid = false;
    setError('question', 'Please enter a question, at least 10 characters long.');
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
        message = 'Something went wrong. Please try again.';
      }
    } else if($register === 'registered' && $loggedIn && !$validated) {
      valid = false;
      messageType = 'error';
      message = 'Please validate your email before asking another question.';
    } else {
      if (!$mail || $mail.length < 6 || !emailValidation($mail)) {
        valid = false;
        setError('mail', 'Please enter a valid email.');
      } else {
        resetError(['mail']);
      }
      if (!password || password.length < 8 || !hasNumbersAndLetters(password)) {
        valid = false;
        setError('password', 'Please enter a valid password (at least 8 characters, numbers and letters).');
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
          message = 'We could not log you in, with the credentials you provided. Please check them.';
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
      setError('postcode', 'The entered postcode is not valid.');
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
        message = 'You question was added.';
        disableAction = false;
        state = 'asked';
      }
    } catch (error) {
      console.log(error);
      messageType = 'error';
      message = 'Something went wrong submitting your question. Please try again in a moment.';
      window.grecaptcha.reset();
      disableAction = false;
    }
  } else {
    disableAction = false;
    state = 'ask';
  }
};

</script>

<h1>Ask a question</h1>
{#if $loggedIn && !$validated && state === 'ask' && message !== 'Please validate your email before asking another question.'}
<p class="message warning">
  Please validate your email before asking another question.
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
  <p>We are interested in your questions. You can ask anything. Please try to be as clear as possible, be polite and constructive. All questions are reviewed before they are published on the platform. Questions that do not align with our code of conduct are removed from the platform.</p>
  <p><i>Fields marked with <strong>*</strong> are required. All other fields are optional.</i></p>
</div>
<form on:submit|preventDefault={submitQuestion}>
  <TextArea
    bind:value={$question}
    error={errors.question.error}
    id="questionArea"
    label="Your Question*"
    errorMessage={errors.question.message} />
  <TextArea
    bind:value={$description}
    label="Additional notes" />
  {#if !$loggedIn}
    <TextInput
    bind:value={$name}
    label="Your name*" />
  <h2>Tell us a little bit about yourself:</h2>
  <p>We want this survey to represent all groups in our society, therefore it helps us to know a few things about you. This information is stored separately from your question and cannot be associated with you as a person:</p>
  <div class="columns">
    <div>
      <TextInput
        bind:value={$postcode}
        label="Postcode"
        error={errors.postcode.error}
        errorMessage={errors.postcode.message} />    
    </div>
    <div class="gap"></div>
    <div>
      <Select
        bind:value={$gender}
        label="Your gender"
        helpText=""
        errorMessage=""
        options={[
          {id: '_', name: ''},
          {id: 'f', name: 'female'},
          {id: 'm', name: 'male'},
          {id: '*', name: '*'}
        ]} />
    </div>
    <div class="gap"></div>
    <div>
      <Select
        bind:value={$age}
        label="Your age"
        errorMessage=""
        helpText=""
        options={[
          {id: '_', name: ''},
          {id: '<6',    name: 'younger than 6'}, 
          {id: '6_12',  name: '6 to 12'}, 
          {id: '13_18', name: '13 to 18'}, 
          {id: '19_29', name: '19 to 29'}, 
          {id: '30_39', name: '30 to 39'}, 
          {id: '40_49', name: '40 to 49'}, 
          {id: '50_65', name: '50 to 65'}, 
          {id: '66_79', name: '66 to 79'}, 
          {id: '>=80',  name: '80 and older'}
        ]} />
    </div>
  </div>
  <h2>Want to keep in touch?</h2>
  <p>When you register you can get updates on your questions. We will not share your information with third-parties and only inform you about survey-related topics. You can delete your account at any time.</p>
  <RadioGroup
    bind:value={$register}
    id="register"
    group={[
      { value: 'no', label: 'No, thanks.'},
      { value: 'yes', label: 'Yes, please sign me up.'},
      { value: 'registered', label: 'I am already registered'}
    ]} />
  {#if $register === 'yes' || $register === 'registered'}
  {#if $register === 'yes'}
  <p>For registration purposes, please provide us with your email and a password for your account. <i>The password should at least be 8 characters long and contain at least one number and one letter.</i></p>
  {/if}
  {#if $register === 'registered'}
  <p>Please provide your email and password, so we can log you in and add your question.</p>
  {/if}
  <div class="columns">
    <div>
      <TextInput
      bind:value={$mail}
      error={errors.mail.error}
      label="Your email"
      errorMessage={errors.mail.message} />
    </div>
    <div class="gap"></div>
    <div>
      <PasswordInput
      bind:value={password}
      error={errors.password.error}
      label="Your password"
      errorMessage={errors.password.message} />
    </div>
  </div>
  {/if}
  {/if}
  <Captcha bind:response={captchaResponse} />
  <Button id="questionSubmit" cancelButton={false} submitText="Submit question" isLoading={(disableAction||!$postcodes) ? true : false} />
</form>
{:else if state === 'asked'}
<p>Thanks for submitting your question. Our robot helpers found a couple of questions, they think, are related to yours. You would really help us, if you could rate how strongly you think those questions are related to your Question.</p>
<p><strong>{$questionAsked}</strong></p>
<ul>
{#each $related as q}
<RelatedRater question={q} token={$relatedToken} source={$questionAskedId} />
{/each}
</ul>
<button on:click={() => { message = ''; state = 'ask'; }}>Ask another question</button>
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