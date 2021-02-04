import View from '../../views/pages/user/view.svelte'
import Edit from '../../views/pages/user/edit.svelte'
import Delete from '../../views/pages/user/delete.svelte'
import DeleteConfirm from '../../views/pages/user/deleteConfirm.svelte'
import Login from '../../views/pages/user/login.svelte'
import Logout from '../../views/pages/user/logout.svelte'
import Register from '../../views/pages/user/register.svelte'
import NotFound from '../../views/pages/404/404.svelte'

export const routes = {
  '/': View,
  '/view': View,
  '/edit': Edit,
  '/delete': Delete,
  '/deleteConfim': DeleteConfirm,
  '/login': Login,
  '/register': Register,
  '/logout': Logout,
  '/404': NotFound,
  '*': NotFound,
}
