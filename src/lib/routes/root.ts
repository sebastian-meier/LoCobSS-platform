import Home from '../../views/pages/home/index.svelte'
import Survey from '../../views/pages/survey/index.svelte'
import Admin from '../../views/pages/admin/index.svelte'
import User from '../../views/pages/user/index.svelte'
import NotFound from '../../views/pages/404/404.svelte'

export const routes = {
  '/': Home,
  '/survey': Survey,
  '/survey/*': Survey,
  '/admin': Admin,
  '/admin/*': Admin,
  '/user': User,
  '/user/*': User,
  '/404': NotFound,
  '*': NotFound,
}
