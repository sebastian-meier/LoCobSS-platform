import Index from '../../views/pages/admin/view.svelte'
import Questions from '../../views/pages/admin/questions/list.svelte'
import QuestionDetail from '../../views/pages/admin/questions/detail.svelte'
import QuestionDelete from '../../views/pages/admin/questions/delete.svelte'
import Taxonomies from '../../views/pages/admin/taxonomies/list.svelte'
import TaxonomyDetail from '../../views/pages/admin/taxonomies/detail.svelte'
import TaxonomyDelete from '../../views/pages/admin/taxonomies/delete.svelte'
import Replies from '../../views/pages/admin/replies/list.svelte'
import RepliesDetail from '../../views/pages/admin/replies/detail.svelte'
import RepliesDelete from '../../views/pages/admin/replies/delete.svelte'
import QuestionCluster from '../../views/pages/admin/questions/cluster.svelte'
import Users from '../../views/pages/admin/users/list.svelte'
import UserDetail from '../../views/pages/admin/users/detail.svelte'
import NotFound from '../../views/pages/404/404.svelte'

export const routes = {
  '/': Index,
  '/questions': Questions,
  '/questions/details/:id': QuestionDetail,
  '/questions/delete/:id': QuestionDelete,
  '/questions/cluster/:id': QuestionCluster,
  
  '/taxonomies': Taxonomies,
  '/taxonomies/details/:id': TaxonomyDetail,
  '/taxonomies/delete/:id': TaxonomyDelete,
  
  '/replies': Replies,
  '/replies/details/:id': RepliesDetail,
  '/replies/delete/:id': RepliesDelete,

  '/users': Users,
  '/user/:id': UserDetail,
  '/404': NotFound,
  '*': NotFound,
}
