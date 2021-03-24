<script>
  import { loggedIn } from '../../stores/current_user';
  import Menu from '../components/menu.svelte';
  import { _ } from 'svelte-i18n';
  import { capitalize } from '../../lib/utils';

  const menu = [
    { url: '/',       label: capitalize($_('home')),            protected: false },
    { url: '/survey', label: $_('survey'),          protected: false },
    { url: '/admin',  label: $_('administration'),  protected: true }
  ];

  const userMenu = {
    "default": [
      { url: '/user/login', label: capitalize($_('login')), protected: false },
      { url: '/user/register', label: capitalize($_('register')), protected: false }
    ],
    "loggedIn": [
      { url: '/user/edit', label: capitalize($_('edit_profile')), protected: true },
      { url: '/user/logout', label: capitalize($_('logout')), protected: true }
    ]
  };

  let userMenuFilter = userMenu.default;
 
  $: if ($loggedIn) {
    userMenuFilter = userMenu.loggedIn;
  } else {
    userMenuFilter = userMenu.default;
  }

</script>

<header>
  <div id="logo">LoCobSS</div>
  <nav>
    <Menu menu={menu} />
  </nav>
  <div id="user-menu">
    <Menu menu={userMenuFilter} />
  </div>
</header>