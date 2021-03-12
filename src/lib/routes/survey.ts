import View from '../../views/pages/survey/view.svelte'
import Ask from '../../views/pages/survey/ask.svelte'
import List from '../../views/pages/survey/list.svelte'
import Details from '../../views/pages/survey/details.svelte'
import NotFound from '../../views/pages/404/404.svelte'

export const routes = {
  '/': View,
  '/ask': Ask,
  '/list': List,
  '/list/:page': List,
  '/details/:id': Details,
  '/404': NotFound,
  '*': NotFound,
}
