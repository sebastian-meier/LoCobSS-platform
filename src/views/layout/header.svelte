<script>
  import { loggedIn } from '../../stores/current_user';
  import Menu from '../components/menu.svelte';

  const menu = [
    { url: '/',       label: 'Home',            protected: false },
    { url: '/survey', label: 'Survey',          protected: false },
    { url: '/admin',  label: 'Administration',  protected: true }
  ];

  const userMenu = {
    "default": [
      { url: '/user/login', label: 'Login', protected: false },
      { url: '/user/register', label: 'Register', protected: false }
    ],
    "loggedIn": [
      { url: '/user/edit', label: 'Edit profile', protected: true },
      { url: '/user/logout', label: 'Logout', protected: true }
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