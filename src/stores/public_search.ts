import { writable, Writable, Readable, derived } from 'svelte/store';
import {loggedIn} from './current_user';
import {addAuthorization} from '../middleware/users/auth';

export const search: Writable<string> = writable('');
export const taxonomies: Writable<number[]> = writable([]);
export const dates: Writable<Date[]> = writable([]);
export const hasReply: Writable<boolean> = writable(null);
export const page: Writable<number> = writable(0);
export const isLoading: Writable<boolean> = writable(false);

let cacheTimeoutId: number | null = null;
export const cache: Readable<publicQuestionResult> = derived(
  [
    search,
    taxonomies,
    dates,
    hasReply,
    page,
    loggedIn
  ],
  ([
    $search,
    $taxonomies,
    $dates,
    $hasReply,
    $page,
  ], 
  set) => {
    const first = (cacheTimeoutId === null) ? true : false;
    if (cacheTimeoutId) {
      clearTimeout(cacheTimeoutId);
    }
    isLoading.set(true);

    cacheTimeoutId = setTimeout(async () => {
      const queries = [];

      if ($search.length > 0) {
        queries.push('query=' + encodeURIComponent($search));
      }

      if ($taxonomies.length > 0) {
        queries.push('taxonomies=' + $taxonomies.map((t) => encodeURIComponent(t)).join(','));
      }

      if ($dates.length === 2) {
        queries.push('dates=' + $dates.map((d) => encodeURIComponent(d.toDateString())).join(','));
      }

      if ($hasReply === false || $hasReply === true) {
        queries.push('answer=' + $hasReply.toString());
      }

      const query = (queries.length > 0) ? '?' + queries.join('&') : '';

      const response = await fetch(
        `${__global.env.API_URL}public/questions${($page > 0) ? '/' + $page : ''}${query}`,
        await addAuthorization()
      ).then((response) => response.json());

      if (response.page != $page) {
        page.set(response.page);
      }

      set(response);
      isLoading.set(false);
    }, (first) ? 0 : 500);
  }
)
