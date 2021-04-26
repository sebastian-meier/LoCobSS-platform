import Ask from '../../views/pages/survey/ask.svelte'
import List from '../../views/pages/survey/list.svelte'
import MyList from '../../views/pages/survey/mylist.svelte'
import Details from '../../views/pages/survey/details.svelte'
import View from '../../views/pages/survey/view.svelte'
import NotFound from '../../views/pages/404/404.svelte'

export const routes = {
  '/': View,
  '/ask': Ask,
  '/mylist': MyList,
  '/list': List,
  '/list/:page': List,
  '/details/:id': Details,
  '/404': NotFound,
  '*': NotFound,
}
