<script lang="ts">
import Loader from '../../components/Loader.svelte';
import TextArea from '../../components/forms/textarea.svelte';
import TextInput from '../../components/forms/text_input.svelte';
import Select from '../../components/forms/select.svelte';
import Button from '../../components/forms/buttons.svelte';
import Checkbox from '../../components/forms/checkbox.svelte';
import Captcha from '../../components/captcha.svelte';

const state = 'ask';

const submitQuestion = () => {
  console.log(window.grecaptcha.getResponse());
};

let question = '';
let questionError = false;
let questionMessage = '';

let name = '';
let nameError = false;
let nameMessage = '';

let mail = '';
let mailError = false;
let mailMessage = '';

let gender = '';
let age = '';
let postcode = '';
let description = '';
let register = false;

let disableAction = false;

</script>

<h1>Ask a question</h1>
<div id="intro">
  <p>We are interested in your questions. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.</p>
  <p><i>Fields marked with <strong>*</strong> are required. All other fields are optional.</i></p>
</div>
{#if state === 'ask'}
<form on:submit|preventDefault={submitQuestion}>
  <TextArea
    bind:value={question}
    error={questionError}
    id="questionArea"
    label="Your Question*"
    errorMessage={questionMessage} />
  <TextArea
    bind:value={description}
    label="Additional notes" />
  <div class="columns">
    <div>
      <TextInput
        bind:value={name}
        error={nameError}
        label="Your name*"
        errorMessage={nameMessage} />
    </div>
    <div class="gap"></div>
    <div>
      <TextInput
        bind:value={mail}
        error={mailError}
        label="Your email"
        errorMessage={mailMessage} />
    </div>
  </div>
  <h2>Tell us a little bit about yourself:</h2>
  <p>We want this survey to represent all groups in our society, therefore it helps us to know a few things about you. This information is stored separately from your question and cannot be associated with you as a person:</p>
  <div class="columns">
    <div>
      <TextInput
        bind:value={postcode}
        label="Postcode" />
    </div>
    <div class="gap"></div>
    <div>
      <Select
        bind:value={gender}
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
        bind:value={age}
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
  <Checkbox
    bind:checked={register}
    label="Yes, please create an account for me:" />
  <Captcha />
  <Button id="questionSubmit" cancelButton={false} submitText="Submit question" isLoading={disableAction} />
</form>
{:else if state === 'related'}
Here a few related articles, rank them...
{:else if state === 'loading'}
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