<script>
  import Router from 'svelte-spa-router';
  import {_} from 'svelte-i18n';
  import { routes } from '../../../lib/routes/survey';
  import Menu from '../../components/menu.svelte';

  let menu = [
    { url: '/survey/ask',    label: $_('survey_ask--headline'),    protected: false },
    { url: '/survey/mylist', label: $_('survey_your--headline'), protected: true, role: ['all'] },
    { url: '/survey/list',   label: $_('survey_list--headline'), protected: false },
  ];

  export let params = {};
</script>

<div id="page-container" class="sidebar">
  <div id="sidebar">
    <nav>
      <Menu menu={menu} />
    </nav>
  </div>
  <div id="content">
    <div id="page">
      <Router {routes} prefix="/survey" />
    </div>
  </div>
</div>